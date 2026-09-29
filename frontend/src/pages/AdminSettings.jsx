import React, { useEffect, useMemo, useState } from "react";

/**
 * Admin settings.
 *
 * Deliberately built only on what the backend actually exposes. There is no
 * endpoint to update an admin profile, and none to persist notification or
 * order preferences, so nothing here pretends to save to the server unless it
 * really does:
 *
 *   Profile    read-only, from the signed token — no update endpoint exists
 *   Password   real, via the existing /api/forgot-password flow
 *   Display    saved in this browser, and applied to the dashboard immediately
 *   Company    read-only; super admins get the real list from the API
 *   Orders     the preference is applied; the rules beside it are read-only
 *
 * Anything read-only says so on the card rather than offering a control that
 * would quietly do nothing.
 */

export const PREFS_KEY = "mrtech.admin.prefs";

export const DEFAULT_PREFS = {
  autoRefresh: true,
  pendingDot: true,
  revenueRange: 14,
};

/** Never let a corrupt or half-written value break the dashboard. */
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

const Row = ({ label, value, hint }) => (
  <div className="set-row">
    <span className="set-row-label">{label}</span>
    <span className="set-row-value">
      {value || <em>Not set</em>}
      {hint && <small>{hint}</small>}
    </span>
  </div>
);

const Toggle = ({ id, checked, onChange, label, hint }) => (
  <label className="set-toggle" htmlFor={id}>
    <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="set-toggle-track" aria-hidden="true">
      <span className="set-toggle-knob" />
    </span>
    <span className="set-toggle-text">
      {label}
      {hint && <small>{hint}</small>}
    </span>
  </label>
);

export default function AdminSettings({ currentUser, prefs, onPrefsChange, companies }) {
  // The password endpoints are deliberately unauthenticated (they are the same
  // ones the login page uses), so no authFetch is needed here.
  /* ------------------------------------------------ display preferences */
  const [draft, setDraft] = useState(prefs);
  const [prefNote, setPrefNote] = useState("");

  useEffect(() => setDraft(prefs), [prefs]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(prefs),
    [draft, prefs]
  );

  const applyPrefs = () => {
    if (!savePrefs(draft)) {
      setPrefNote("This browser is blocking storage, so the change was not kept.");
      return;
    }
    onPrefsChange(draft);
    setPrefNote("Saved for this browser.");
  };

  const resetPrefs = () => {
    setDraft({ ...DEFAULT_PREFS });
    setPrefNote("");
  };

  /* ------------------------------------------------ password change */
  const email = currentUser.email || "";
  const [pwStage, setPwStage] = useState("idle"); // idle -> code -> password
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwNote, setPwNote] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordForm = () => {
    setPwStage("idle");
    setCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError("");
    setPwNote("");
  };

  const sendCode = async () => {
    setPwBusy(true);
    setPwError("");
    setPwNote("");
    try {
      const res = await fetch("/api/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwError(data.error || "Could not send the code. Please try again.");
        return;
      }
      setPwStage("code");
      setPwNote(`A 6-digit code was emailed to ${email}.`);
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setPwBusy(false);
    }
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code)) {
      setPwError("Enter the 6-digit code from the email.");
      return;
    }
    setPwBusy(true);
    setPwError("");
    try {
      const res = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, otp: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.resetToken) {
        setPwError(data.error || "That code was not accepted.");
        return;
      }
      setResetToken(data.resetToken);
      setPwStage("password");
      setPwNote("Code accepted. Choose a new password.");
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setPwBusy(false);
    }
  };

  const submitPassword = async () => {
    if (newPassword.length < 6) {
      setPwError("Use at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("The two passwords do not match.");
      return;
    }
    setPwBusy(true);
    setPwError("");
    try {
      const res = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwError(data.error || "Could not change the password.");
        return;
      }
      resetPasswordForm();
      setPwNote("Password changed. Use it the next time you sign in.");
    } catch {
      setPwError("Network error. Check your connection and try again.");
    } finally {
      setPwBusy(false);
    }
  };

  /* ------------------------------------------------ render */
  const role = currentUser.isSuperAdmin
    ? "Super admin"
    : currentUser.userType === "admin"
    ? "Company admin"
    : currentUser.userType || "—";

  return (
    <div className="settings-grid">
      {/* ---------------------------------------------------- profile */}
      <section className="admin-card set-card">
        <header className="set-head">
          <div>
            <h2>Profile</h2>
            <p>The account you are signed in with</p>
          </div>
          <span className="set-tag">Read-only</span>
        </header>
        <div className="set-body">
          <Row label="Name" value={currentUser.fullName} />
          <Row label="Email" value={email} />
          <Row label="Role" value={role} />
          <Row label="Company" value={currentUser.companyId} />
        </div>
        <p className="set-foot">
          There is no endpoint to change these details, so they are shown rather
          than edited. Ask a super admin to update the account.
        </p>
      </section>

      {/* ---------------------------------------------------- password */}
      <section className="admin-card set-card">
        <header className="set-head">
          <div>
            <h2>Password</h2>
            <p>Confirm by email, then choose a new one</p>
          </div>
        </header>

        <div className="set-body">
          {pwStage === "idle" && (
            <p className="set-explain">
              A 6-digit code goes to <strong>{email || "your account email"}</strong>.
              Entering it lets you set a new password.
            </p>
          )}

          {pwStage === "code" && (
            <label className="set-field">
              <span>Code from the email</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                placeholder="------"
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setPwError("");
                }}
              />
            </label>
          )}

          {pwStage === "password" && (
            <>
              <label className="set-field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPwError("");
                  }}
                />
              </label>
              <label className="set-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPwError("");
                  }}
                />
              </label>
            </>
          )}

          {pwError && <p className="set-msg set-msg-error" role="alert">{pwError}</p>}
          {pwNote && !pwError && <p className="set-msg set-msg-ok" role="status">{pwNote}</p>}
        </div>

        <div className="set-actions">
          <button type="button" className="set-btn set-btn-ghost" onClick={resetPasswordForm} disabled={pwBusy}>
            Reset
          </button>
          {pwStage === "idle" && (
            <button type="button" className="set-btn set-btn-primary" onClick={sendCode} disabled={pwBusy || !email}>
              {pwBusy ? "Sending…" : "Email me a code"}
            </button>
          )}
          {pwStage === "code" && (
            <button type="button" className="set-btn set-btn-primary" onClick={verifyCode} disabled={pwBusy || code.length !== 6}>
              {pwBusy ? "Checking…" : "Verify code"}
            </button>
          )}
          {pwStage === "password" && (
            <button type="button" className="set-btn set-btn-primary" onClick={submitPassword} disabled={pwBusy}>
              {pwBusy ? "Saving…" : "Save password"}
            </button>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- notifications */}
      <section className="admin-card set-card">
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
            onChange={(v) => setDraft({ ...draft, autoRefresh: v })}
            label="Auto-refresh the dashboard"
            hint="Re-polls orders and products every 30 seconds"
          />
          <Toggle
            id="set-pending-dot"
            checked={draft.pendingDot}
            onChange={(v) => setDraft({ ...draft, pendingDot: v })}
            label="Show the pending-orders dot"
            hint="The marker on the bell in the header"
          />
          {prefNote && <p className="set-msg set-msg-ok" role="status">{prefNote}</p>}
        </div>
        <div className="set-actions">
          <button type="button" className="set-btn set-btn-ghost" onClick={resetPrefs}>
            Reset
          </button>
          <button type="button" className="set-btn set-btn-primary" onClick={applyPrefs} disabled={!dirty}>
            Save changes
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- company */}
      <section className="admin-card set-card">
        <header className="set-head">
          <div>
            <h2>Company</h2>
            <p>What your account is scoped to</p>
          </div>
          <span className="set-tag">Read-only</span>
        </header>
        <div className="set-body">
          <Row label="Company ID" value={currentUser.companyId} />
          <Row
            label="Data access"
            value={currentUser.isSuperAdmin ? "All companies" : "This company only"}
            hint={
              currentUser.isSuperAdmin
                ? "Orders and products are not filtered for you"
                : "Every order and product view is filtered to your company"
            }
          />
          {currentUser.isSuperAdmin && (
            <Row
              label="Companies"
              value={companies?.length ? `${companies.length} registered` : "None registered"}
              hint="Manage them from the Companies tab"
            />
          )}
        </div>
        <p className="set-foot">
          Company records are created from the Companies tab by a super admin.
        </p>
      </section>

      {/* ---------------------------------------------------- orders & email */}
      <section className="admin-card set-card set-card--wide">
        <header className="set-head">
          <div>
            <h2>Order &amp; email settings</h2>
            <p>One preference you control, and the rules that already apply</p>
          </div>
        </header>
        <div className="set-body">
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
                  onClick={() => setDraft({ ...draft, revenueRange: d })}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <ul className="set-rules">
            <li>
              <strong>Cash on Delivery</strong>
              Marked delivered only through Complete Delivery, which emails the
              customer a code and records the payment at the same time.
            </li>
            <li>
              <strong>Status changes</strong>
              Updating an order&rsquo;s status emails the customer automatically.
            </li>
            <li>
              <strong>Collection</strong>
              A verified collection emails the customer a receipt and the admin a
              notification.
            </li>
            <li>
              <strong>New orders</strong>
              Each company&rsquo;s admin is emailed with only their own items.
            </li>
          </ul>
        </div>
        <div className="set-actions">
          <button type="button" className="set-btn set-btn-ghost" onClick={resetPrefs}>
            Reset
          </button>
          <button type="button" className="set-btn set-btn-primary" onClick={applyPrefs} disabled={!dirty}>
            Save changes
          </button>
        </div>
        <p className="set-foot">
          The rules above are how the backend behaves today. They are shown here
          rather than offered as switches, because there is no endpoint to change
          them.
        </p>
      </section>
    </div>
  );
}
