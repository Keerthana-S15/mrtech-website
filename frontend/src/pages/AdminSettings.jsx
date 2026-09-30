import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaUserCircle, FaKey, FaBell, FaBuilding, FaShieldAlt, FaSyncAlt,
  FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaArrowLeft,
  FaSignOutAlt, FaLock,
} from "react-icons/fa";

/**
 * Admin settings.
 *
 * Every control here is wired to an endpoint that exists. The backend has no
 * route to update an admin profile and none to persist preferences, so:
 *
 *   Profile        read-only, from the signed token — no update endpoint
 *   Password       fully interactive, via /api/forgot-password (3 steps)
 *   Notifications  saved in this browser, applied to the dashboard at once
 *   Company        live from GET /api/admin/companies (super admin)
 *   Security       real session facts, decoded from the token, plus sign out
 *
 * Read-only cards say so on the card rather than offering a dead control.
 */

export const PREFS_KEY = "mrtech.admin.prefs";

export const DEFAULT_PREFS = {
  autoRefresh: true,
  pendingDot: true,
  revenueRange: 14,
};

export function loadPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    return {
      autoRefresh: typeof raw.autoRefresh === "boolean" ? raw.autoRefresh : DEFAULT_PREFS.autoRefresh,
      pendingDot: typeof raw.pendingDot === "boolean" ? raw.pendingDot : DEFAULT_PREFS.pendingDot,
      revenueRange: [7, 14, 30].includes(raw.revenueRange) ? raw.revenueRange : DEFAULT_PREFS.revenueRange,
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

/** Reads the claims out of the stored JWT without trusting it for anything. */
function readToken() {
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    const [, payload] = raw.split(".");
    const json = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
    return json && typeof json === "object" ? json : null;
  } catch {
    return null;
  }
}

const SECTIONS = [
  { id: "profile", label: "Profile", icon: FaUserCircle },
  { id: "password", label: "Password", icon: FaKey },
  { id: "display", label: "Notifications", icon: FaBell },
  { id: "company", label: "Company", icon: FaBuilding },
  { id: "security", label: "Security", icon: FaShieldAlt },
];

const Row = ({ label, value, hint }) => (
  <div className="set-row">
    <span className="set-row-label">{label}</span>
    <span className="set-row-value">
      {value === undefined || value === null || value === "" ? <em>Not set</em> : value}
      {hint && <small>{hint}</small>}
    </span>
  </div>
);

const Toggle = ({ id, checked, onChange, label, hint, disabled }) => (
  <label className={`set-toggle${disabled ? " is-disabled" : ""}`} htmlFor={id}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="set-toggle-track" aria-hidden="true">
      <span className="set-toggle-knob" />
    </span>
    <span className="set-toggle-text">
      {label}
      {hint && <small>{hint}</small>}
    </span>
  </label>
);

const Note = ({ kind, children }) =>
  children ? (
    <p className={`set-msg set-msg-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {kind === "error" ? <FaExclamationTriangle aria-hidden="true" /> : <FaCheckCircle aria-hidden="true" />}
      <span>{children}</span>
    </p>
  ) : null;

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function AdminSettings({ currentUser, authFetch, prefs, onPrefsChange, onSignOut }) {
  const [section, setSection] = useState("profile");
  const claims = useMemo(readToken, []);
  const email = currentUser.email || claims?.email || "";

  /* ---------------------------------------------------------------- display */
  const [draft, setDraft] = useState(prefs);
  const [prefNote, setPrefNote] = useState("");
  const [prefError, setPrefError] = useState("");

  useEffect(() => setDraft(prefs), [prefs]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(prefs), [draft, prefs]);

  const applyPrefs = () => {
    setPrefError("");
    if (!savePrefs(draft)) {
      setPrefNote("");
      setPrefError("This browser is blocking storage, so the change was not kept.");
      return;
    }
    onPrefsChange(draft);
    setPrefNote("Saved. The dashboard is using these now.");
  };

  const cancelPrefs = () => {
    setDraft(prefs);
    setPrefNote("");
    setPrefError("");
  };

  const defaultPrefs = () => {
    setDraft({ ...DEFAULT_PREFS });
    setPrefNote("");
    setPrefError("");
  };

  /* --------------------------------------------------------------- password */
  const [step, setStep] = useState(1); // 1 request, 2 code, 3 password, 4 done
  const [busy, setBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwNote, setPwNote] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [codeLeft, setCodeLeft] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [resetToken, setResetToken] = useState("");
  const [tokenLeft, setTokenLeft] = useState(0);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeLeft <= 0) return undefined;
    const t = setTimeout(() => setCodeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [codeLeft]);

  useEffect(() => {
    if (tokenLeft <= 0) return undefined;
    const t = setTimeout(() => setTokenLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [tokenLeft]);

  useEffect(() => {
    if (step === 2 && codeRef.current) codeRef.current.focus();
  }, [step]);

  const resetFlow = useCallback(() => {
    setStep(1);
    setCode("");
    setResetToken("");
    setPw1("");
    setPw2("");
    setShowPw(false);
    setPwError("");
    setPwNote("");
    setSentTo("");
    setCodeLeft(0);
    setTokenLeft(0);
    setAttemptsLeft(null);
  }, []);

  const post = async (path, body) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  };

  const requestCode = async ({ resend = false } = {}) => {
    setBusy(true);
    setPwError("");
    setPwNote("");
    try {
      const { ok, data } = await post("/api/forgot-password/request", { identifier: email });
      if (!ok) {
        setPwError(data.error || "Could not send the code. Please try again.");
        return;
      }
      setSentTo(data.sentTo || email);
      setCodeLeft(Math.round((data.expiresInMinutes || 10) * 60));
      setAttemptsLeft(null);
      setCode("");
      setStep(2);
      setPwNote(resend ? "A new code is on its way." : `Code sent to ${data.sentTo || email}.`);
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code)) {
      setPwError("Enter the 6-digit code from the email.");
      return;
    }
    setBusy(true);
    setPwError("");
    setPwNote("");
    try {
      const { ok, data } = await post("/api/forgot-password/verify", { identifier: email, otp: code });
      if (!ok || !data.resetToken) {
        setPwError(data.error || "That code was not accepted.");
        if (typeof data.attemptsLeft === "number") setAttemptsLeft(data.attemptsLeft);
        return;
      }
      setResetToken(data.resetToken);
      setTokenLeft(Math.round((data.expiresInMinutes || 10) * 60));
      setStep(3);
      setPwNote("Code accepted. Choose a new password.");
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async () => {
    if (pw1.length < 6) {
      setPwError("Use at least 6 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setPwError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setPwError("");
    try {
      const { ok, data } = await post("/api/forgot-password/reset", { resetToken, password: pw1 });
      if (!ok) {
        setPwError(data.error || "Could not change the password.");
        return;
      }
      setStep(4);
      setPwNote("Password changed. Use it the next time you sign in.");
      setPw1("");
      setPw2("");
      setResetToken("");
      setTokenLeft(0);
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------------------------------------------- company */
  const isSuper = Boolean(currentUser.isSuperAdmin || claims?.isSuperAdmin);
  const [companies, setCompanies] = useState(null); // null = not loaded yet
  const [coBusy, setCoBusy] = useState(false);
  const [coError, setCoError] = useState("");

  const loadCompanies = useCallback(async () => {
    if (!isSuper) return;
    setCoBusy(true);
    setCoError("");
    try {
      const res = await authFetch("/api/admin/companies");
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setCoError(data.error || `Could not load companies (HTTP ${res.status}).`);
        setCompanies([]);
        return;
      }
      setCompanies(data.companies || []);
    } catch {
      setCoError("Network error while loading companies.");
      setCompanies([]);
    } finally {
      setCoBusy(false);
    }
  }, [authFetch, isSuper]);

  useEffect(() => {
    if (section === "company" && isSuper && companies === null && !coBusy) loadCompanies();
  }, [section, isSuper, companies, coBusy, loadCompanies]);

  /* --------------------------------------------------------------- security */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (section !== "security") return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [section]);

  const expiresAt = claims?.exp ? claims.exp * 1000 : null;
  const secondsLeft = expiresAt ? Math.max(Math.floor((expiresAt - now) / 1000), 0) : null;
  const expiryText = (() => {
    if (secondsLeft === null) return null;
    if (secondsLeft === 0) return "Expired — sign in again";
    const d = Math.floor(secondsLeft / 86400);
    const h = Math.floor((secondsLeft % 86400) / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    if (d > 0) return `${d}d ${h}h remaining`;
    if (h > 0) return `${h}h ${m}m remaining`;
    return `${m}m ${secondsLeft % 60}s remaining`;
  })();

  const role = isSuper ? "Super admin" : currentUser.userType === "admin" ? "Company admin" : currentUser.userType || "—";

  /* ------------------------------------------------------------------ views */
  const panels = {
    profile: (
      <>
        <header className="set-head">
          <div>
            <h2>Profile</h2>
            <p>The account this session is signed in with</p>
          </div>
          <span className="set-tag">Read-only</span>
        </header>
        <div className="set-body">
          <Row label="Name" value={currentUser.fullName} />
          <Row label="Email" value={email} />
          <Row label="Role" value={role} />
          <Row label="Company" value={currentUser.companyId || claims?.companyId} />
          <Row label="Account ID" value={claims?.adminId} hint="From the signed session token" />
        </div>
        <div className="set-actions">
          <button type="button" className="set-btn set-btn-primary" onClick={() => setSection("password")}>
            <FaKey aria-hidden="true" /> Change password
          </button>
        </div>
        <p className="set-foot">
          The API has no route to update these details, so they are shown rather than
          edited. A super admin can create or replace an admin account from the
          Companies tab.
        </p>
      </>
    ),

    password: (
      <>
        <header className="set-head">
          <div>
            <h2>Change password</h2>
            <p>Confirm by email, then choose a new one</p>
          </div>
        </header>

        <ol className="set-steps" aria-label="Progress">
          {["Send code", "Enter code", "New password"].map((label, i) => {
            const n = i + 1;
            const state = step > n || step === 4 ? "done" : step === n ? "current" : "todo";
            return (
              <li key={label} className={`set-step is-${state}`}>
                <span className="set-step-dot">{state === "done" ? <FaCheckCircle /> : n}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="set-body">
          {step === 1 && (
            <p className="set-explain">
              A 6-digit code goes to <strong>{email || "your account email"}</strong>. It is
              valid for 10 minutes, and you can request up to 3 in any 15 minutes.
            </p>
          )}

          {step === 2 && (
            <>
              <p className="set-explain">
                Enter the code sent to <strong>{sentTo || email}</strong>.
              </p>
              <label className="set-field">
                <span>6-digit code</span>
                <input
                  ref={codeRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="------"
                  className="set-code"
                  value={code}
                  disabled={busy}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPwError("");
                  }}
                />
              </label>
              <div className="set-meta">
                {codeLeft > 0 ? (
                  <span>Expires in <strong>{mmss(codeLeft)}</strong></span>
                ) : (
                  <span className="set-meta-warn">This code has expired — send a new one.</span>
                )}
                {attemptsLeft !== null && <span>{attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left</span>}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <label className="set-field">
                <span>New password</span>
                <div className="set-input-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={pw1}
                    disabled={busy}
                    onChange={(e) => { setPw1(e.target.value); setPwError(""); }}
                  />
                  <button
                    type="button"
                    className="set-reveal"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label className="set-field">
                <span>Confirm new password</span>
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={pw2}
                  disabled={busy}
                  onChange={(e) => { setPw2(e.target.value); setPwError(""); }}
                />
              </label>
              <div className="set-meta">
                <span>Minimum 6 characters</span>
                {tokenLeft > 0 && <span>Finish within <strong>{mmss(tokenLeft)}</strong></span>}
              </div>
            </>
          )}

          {step === 4 && (
            <p className="set-explain">
              <FaLock aria-hidden="true" /> Your password has been changed. The next sign-in
              will need the new one.
            </p>
          )}

          <Note kind="error">{pwError}</Note>
          {!pwError && <Note kind="ok">{pwNote}</Note>}
        </div>

        <div className="set-actions">
          {step === 1 && (
            <button type="button" className="set-btn set-btn-primary" onClick={() => requestCode()} disabled={busy || !email}>
              {busy ? <><FaSyncAlt className="set-spin" /> Sending…</> : "Email me a code"}
            </button>
          )}

          {step === 2 && (
            <>
              <button type="button" className="set-btn set-btn-ghost" onClick={resetFlow} disabled={busy}>
                <FaArrowLeft aria-hidden="true" /> Cancel
              </button>
              <button type="button" className="set-btn set-btn-ghost" onClick={() => requestCode({ resend: true })} disabled={busy}>
                Resend
              </button>
              <button type="button" className="set-btn set-btn-primary" onClick={verifyCode} disabled={busy || code.length !== 6}>
                {busy ? <><FaSyncAlt className="set-spin" /> Checking…</> : "Verify code"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button type="button" className="set-btn set-btn-ghost" onClick={resetFlow} disabled={busy}>
                Cancel
              </button>
              <button type="button" className="set-btn set-btn-primary" onClick={savePassword} disabled={busy || !pw1 || !pw2}>
                {busy ? <><FaSyncAlt className="set-spin" /> Saving…</> : "Save new password"}
              </button>
            </>
          )}

          {step === 4 && (
            <button type="button" className="set-btn set-btn-ghost" onClick={resetFlow}>
              Done
            </button>
          )}
        </div>
      </>
    ),

    display: (
      <>
        <header className="set-head">
          <div>
            <h2>Notifications &amp; display</h2>
            <p>Applied to the dashboard as soon as you save</p>
          </div>
          <span className="set-tag set-tag-soft">This browser</span>
        </header>
        <div className="set-body">
          <Toggle
            id="set-auto-refresh"
            checked={draft.autoRefresh}
            onChange={(v) => { setDraft({ ...draft, autoRefresh: v }); setPrefNote(""); }}
            label="Auto-refresh the dashboard"
            hint="Re-polls orders and products every 30 seconds"
          />
          <Toggle
            id="set-pending-dot"
            checked={draft.pendingDot}
            onChange={(v) => { setDraft({ ...draft, pendingDot: v }); setPrefNote(""); }}
            label="Show the pending-orders dot"
            hint="The marker on the bell in the header"
          />

          <div className="set-field set-field--inline">
            <span>Revenue trend range</span>
            <div className="set-segmented" role="radiogroup" aria-label="Revenue trend range">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={draft.revenueRange === d}
                  className={draft.revenueRange === d ? "is-active" : ""}
                  onClick={() => { setDraft({ ...draft, revenueRange: d }); setPrefNote(""); }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <Note kind="error">{prefError}</Note>
          {!prefError && <Note kind="ok">{prefNote}</Note>}
        </div>
        <div className="set-actions">
          <button type="button" className="set-btn set-btn-ghost" onClick={defaultPrefs}>Reset to defaults</button>
          <button type="button" className="set-btn set-btn-ghost" onClick={cancelPrefs} disabled={!dirty}>Cancel</button>
          <button type="button" className="set-btn set-btn-primary" onClick={applyPrefs} disabled={!dirty}>Save changes</button>
        </div>
        <p className="set-foot">
          There is no endpoint that stores admin preferences, so these live in this
          browser. Another device or a cleared cache starts from the defaults.
        </p>
      </>
    ),

    company: (
      <>
        <header className="set-head">
          <div>
            <h2>Company</h2>
            <p>{isSuper ? "Every registered company admin" : "What your account is scoped to"}</p>
          </div>
          {isSuper ? (
            <button type="button" className="set-icon-btn" onClick={loadCompanies} disabled={coBusy} title="Reload">
              <FaSyncAlt className={coBusy ? "set-spin" : ""} aria-hidden="true" />
              <span>{coBusy ? "Loading" : "Refresh"}</span>
            </button>
          ) : (
            <span className="set-tag">Read-only</span>
          )}
        </header>

        <div className="set-body">
          <Row label="Company ID" value={currentUser.companyId || claims?.companyId} />
          <Row
            label="Data access"
            value={isSuper ? "All companies" : "This company only"}
            hint={isSuper
              ? "Orders and products are not filtered for you"
              : "Every order and product view is filtered to your company"}
          />

          {isSuper && (
            <>
              <Note kind="error">{coError}</Note>
              {coBusy && companies === null && <p className="set-explain">Loading companies…</p>}
              {!coBusy && companies !== null && companies.length === 0 && !coError && (
                <p className="set-explain">
                  No company admins are registered yet. Create one from the Companies tab.
                </p>
              )}
              {companies !== null && companies.length > 0 && (
                <ul className="set-list">
                  {companies.map((c) => (
                    <li key={c.id}>
                      <div>
                        <strong>{c.companyName || c.companyId || "Unnamed"}</strong>
                        <small>{c.email}</small>
                      </div>
                      <span className={`set-pill${c.isSuperAdmin ? " is-super" : ""}`}>
                        {c.isSuperAdmin ? "Super admin" : c.companyId}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
        <p className="set-foot">
          Company admins are created from the Companies tab. This list is read from the
          same API and refreshes on demand.
        </p>
      </>
    ),

    security: (
      <>
        <header className="set-head">
          <div>
            <h2>Security</h2>
            <p>This session and how account recovery behaves</p>
          </div>
        </header>
        <div className="set-body">
          <Row
            label="Session expires"
            value={expiryText || "Unknown"}
            hint={expiresAt ? new Date(expiresAt).toLocaleString("en-IN") : "No expiry claim in the token"}
          />
          <Row label="Signed in as" value={email} hint={role} />
          <Row
            label="Scope"
            value={isSuper ? "All companies" : currentUser.companyId || claims?.companyId}
            hint="Enforced by the API on every admin request, not just in the UI"
          />

          <ul className="set-rules">
            <li><strong>Reset code</strong>Valid 10 minutes, 5 attempts, then it is burnt.</li>
            <li><strong>Reset requests</strong>At most 3 per account in any 15 minutes.</li>
            <li><strong>Codes at rest</strong>Stored as SHA-256 hashes and compared in constant time.</li>
            <li><strong>Sessions</strong>Tokens are issued for 7 days and are not revocable server-side.</li>
          </ul>
        </div>
        <div className="set-actions">
          <button type="button" className="set-btn set-btn-danger" onClick={onSignOut}>
            <FaSignOutAlt aria-hidden="true" /> Sign out of this browser
          </button>
        </div>
        <p className="set-foot">
          There is no server-side session revocation, so signing out clears this
          browser only. A token stays valid until it expires.
        </p>
      </>
    ),
  };

  return (
    <div className="settings-shell">
      <nav className="settings-nav" aria-label="Settings sections">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`settings-nav-item${section === id ? " is-active" : ""}`}
            aria-current={section === id ? "page" : undefined}
            onClick={() => setSection(id)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <section className="admin-card set-panel" aria-live="polite">
        {panels[section]}
      </section>
    </div>
  );
}
