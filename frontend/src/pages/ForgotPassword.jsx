import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "./ForgotPassword.css";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const STEPS = ["Identify", "Verify", "New password"];
const MIN_PASSWORD_LENGTH = 6;
const RESEND_SECONDS = 30;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^(\+?91|0)?\d{10}$/.test(v.replace(/[\s-]/g, ""));

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resetToken, setResetToken] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [channel, setChannel] = useState("email");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const otpRef = useRef(null);
  const passwordRef = useRef(null);

  // resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // move focus to the field that matters for the step we just entered
  useEffect(() => {
    if (step === 1 && otpRef.current) otpRef.current.focus();
    if (step === 2 && passwordRef.current) passwordRef.current.focus();
  }, [step]);

  const post = async (path, body) => {
    const res = await fetch(`/api/forgot-password/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  };

  // ---- step 1: ask for a code ----
  const handleRequest = async (e) => {
    e.preventDefault();
    if (loading) return;

    const value = identifier.trim();
    if (!value) return setError("Enter your registered email or phone number.");
    if (!isEmail(value) && !isPhone(value)) {
      return setError("Enter a valid email address or 10-digit mobile number.");
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { ok, data } = await post("request", { identifier: value });
      if (!ok) {
        setError(data.error || "We could not send the code. Please try again.");
      } else {
        setSentTo(data.sentTo || value);
        setChannel(data.channel || "email");
        setNotice(data.message || "If that account exists, a reset code is on its way.");
        setCooldown(RESEND_SECONDS);
        setStep(1);
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading || cooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await post("request", { identifier: identifier.trim() });
      if (!ok) setError(data.error || "Could not resend the code.");
      else {
        setNotice("A new code has been sent.");
        setCooldown(RESEND_SECONDS);
        setOtp("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- step 2: verify the code ----
  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code.");

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { ok, data } = await post("verify", { identifier: identifier.trim(), otp });
      if (!ok) {
        setError(
          data.attemptsLeft !== undefined && data.attemptsLeft > 0
            ? `${data.error} ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? "" : "s"} left.`
            : data.error || "That code is not correct."
        );
      } else {
        setResetToken(data.resetToken);
        setNotice(data.message || "Code verified. Choose a new password.");
        setStep(2);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- step 3: set the new password ----
  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    if (password !== confirm) return setError("Both passwords must match.");

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { ok, data } = await post("reset", { resetToken, password });
      if (!ok) {
        setError(data.error || "We could not update your password.");
        // an expired session has to start over
        if (/expired/i.test(data.error || "")) setStep(0);
      } else {
        setStep(3);
        setNotice(data.message || "Password updated. You can sign in now.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= MIN_PASSWORD_LENGTH) s += 1;
    if (password.length >= 10) s += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
    if (/\d/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strength];

  return (
    <div className="lg-page fp-page">
      {/* ================= LEFT — branding (shared with Login) ================= */}
      <aside className="lg-brand">
        <div className="lg-brand-grid" aria-hidden="true" />
        <div className="lg-orb lg-orb--orange" aria-hidden="true" />
        <div className="lg-orb lg-orb--emerald" aria-hidden="true" />
        <div className="lg-orb lg-orb--violet" aria-hidden="true" />

        <svg className="lg-net" viewBox="0 0 400 600" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <g className="lg-net-lines">
            <line x1="60" y1="120" x2="180" y2="60" />
            <line x1="180" y1="60" x2="320" y2="130" />
            <line x1="60" y1="120" x2="140" y2="260" />
            <line x1="140" y1="260" x2="320" y2="130" />
            <line x1="140" y1="260" x2="90" y2="420" />
            <line x1="140" y1="260" x2="300" y2="330" />
            <line x1="300" y1="330" x2="340" y2="480" />
            <line x1="90" y1="420" x2="220" y2="520" />
            <line x1="220" y1="520" x2="340" y2="480" />
            <line x1="300" y1="330" x2="220" y2="520" />
          </g>
          <g className="lg-net-nodes">
            <circle cx="60" cy="120" r="4" />
            <circle cx="180" cy="60" r="5" />
            <circle cx="320" cy="130" r="4" />
            <circle cx="140" cy="260" r="6" />
            <circle cx="90" cy="420" r="4" />
            <circle cx="300" cy="330" r="5" />
            <circle cx="340" cy="480" r="4" />
            <circle cx="220" cy="520" r="5" />
          </g>
        </svg>

        <div className="lg-brand-inner">
          <div className="lg-logo-ring">
            <span className="lg-logo-halo" aria-hidden="true" />
            <div className="lg-logo-circle">
              <img src="/MR LOGO.jpeg" alt="Myth Reality Technologies logo" className="lg-logo-img" />
            </div>
          </div>

          <h2 className="lg-brand-title">Myth Reality Technologies</h2>
          <p className="lg-brand-subtitle">Account recovery, handled securely</p>

          <ul className="lg-features">
            <li className="lg-feature" style={{ "--i": 0 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>One-time code</p>
            </li>
            <li className="lg-feature" style={{ "--i": 1 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>Expires in 10 minutes</p>
            </li>
            <li className="lg-feature" style={{ "--i": 2 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>Single use only</p>
            </li>
          </ul>
        </div>
      </aside>

      {/* ================= RIGHT — the flow ================= */}
      <main className="lg-panel">
        <div className="lg-panel-tint" aria-hidden="true" />

        <div className="lg-card fp-card">
          <div className="lg-card-badge">
            <FaShieldAlt /> Password reset
          </div>

          {step < 3 ? (
            <>
              <h1 className="lg-title">
                {step === 0 && "Forgot password?"}
                {step === 1 && "Check your messages"}
                {step === 2 && "Set a new password"}
              </h1>
              <p className="lg-subtitle">
                {step === 0 && "We'll send a one-time code to your registered email or phone."}
                {step === 1 && (
                  <>
                    Enter the 6-digit code sent to <strong>{sentTo}</strong>.
                  </>
                )}
                {step === 2 && "Choose a password you haven't used before."}
              </p>

              {/* step tracker */}
              <ol className="fp-steps" aria-label="Progress">
                {STEPS.map((label, i) => (
                  <li
                    key={label}
                    className={`fp-step${i === step ? " is-current" : ""}${i < step ? " is-done" : ""}`}
                  >
                    <span className="fp-step-dot">{i < step ? <FaCheck /> : i + 1}</span>
                    <span className="fp-step-label">{label}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          {error && (
            <div className="fp-alert fp-alert--error" role="alert">
              <FaExclamationCircle /> <span>{error}</span>
            </div>
          )}
          {!error && notice && step < 3 && (
            <div className="fp-alert fp-alert--info" role="status">
              <FaCheckCircle /> <span>{notice}</span>
            </div>
          )}

          {/* ---------- STEP 1 ---------- */}
          {step === 0 && (
            <form onSubmit={handleRequest} className="lg-form">
              <div className="lg-field" style={{ "--i": 0 }}>
                <label htmlFor="fp-identifier">Email / Phone</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><FaUser /></span>
                  <input
                    id="fp-identifier"
                    type="text"
                    name="identifier"
                    placeholder="Enter your email or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  <span className="lg-input-line" aria-hidden="true" />
                </div>
              </div>

              <button type="submit" className={`lg-btn${loading ? " is-loading" : ""}`} disabled={loading} style={{ "--i": 1 }}>
                <span className="lg-btn-label">{loading ? "Sending..." : "Send reset code"}</span>
                {loading ? <span className="lg-spinner" aria-hidden="true" /> : <FaArrowRight className="lg-btn-arrow" aria-hidden="true" />}
                <span className="lg-btn-shine" aria-hidden="true" />
              </button>

              <p className="lg-bottom" style={{ "--i": 2 }}>
                <Link to="/login" className="fp-back"><FaArrowLeft /> Back to login</Link>
              </p>
            </form>
          )}

          {/* ---------- STEP 2 ---------- */}
          {step === 1 && (
            <form onSubmit={handleVerify} className="lg-form">
              <div className="lg-field" style={{ "--i": 0 }}>
                <label htmlFor="fp-otp">6-digit code</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><FaKey /></span>
                  <input
                    id="fp-otp"
                    ref={otpRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="fp-otp-input"
                    placeholder="------"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                  <span className="lg-input-line" aria-hidden="true" />
                </div>
              </div>

              <button type="submit" className={`lg-btn${loading ? " is-loading" : ""}`} disabled={loading || otp.length !== 6} style={{ "--i": 1 }}>
                <span className="lg-btn-label">{loading ? "Verifying..." : "Verify code"}</span>
                {loading ? <span className="lg-spinner" aria-hidden="true" /> : <FaArrowRight className="lg-btn-arrow" aria-hidden="true" />}
                <span className="lg-btn-shine" aria-hidden="true" />
              </button>

              <div className="fp-row" style={{ "--i": 2 }}>
                <button type="button" className="fp-link-btn" onClick={() => { setStep(0); setOtp(""); setError(""); setNotice(""); }}>
                  <FaArrowLeft /> Change {channel === "email" ? "email" : "number"}
                </button>
                <button type="button" className="fp-link-btn" onClick={handleResend} disabled={cooldown > 0 || loading}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          {/* ---------- STEP 3 ---------- */}
          {step === 2 && (
            <form onSubmit={handleReset} className="lg-form">
              <div className="lg-field" style={{ "--i": 0 }}>
                <label htmlFor="fp-password">New password</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><FaLock /></span>
                  <input
                    id="fp-password"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    required
                  />
                  <button
                    type="button"
                    className="lg-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <span className="lg-input-line" aria-hidden="true" />
                </div>
                {password && (
                  <div className={`fp-strength fp-strength--${strength}`}>
                    <span /><span /><span /><span /><span />
                    <small>{password.length < MIN_PASSWORD_LENGTH ? `At least ${MIN_PASSWORD_LENGTH} characters` : strengthLabel}</small>
                  </div>
                )}
              </div>

              <div className="lg-field" style={{ "--i": 1 }}>
                <label htmlFor="fp-confirm">Confirm password</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><FaLock /></span>
                  <input
                    id="fp-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <span className="lg-input-line" aria-hidden="true" />
                </div>
                {confirm && password !== confirm && (
                  <small className="fp-mismatch">Both passwords must match.</small>
                )}
              </div>

              <button
                type="submit"
                className={`lg-btn${loading ? " is-loading" : ""}`}
                disabled={loading || password.length < MIN_PASSWORD_LENGTH || password !== confirm}
                style={{ "--i": 2 }}
              >
                <span className="lg-btn-label">{loading ? "Updating..." : "Update password"}</span>
                {loading ? <span className="lg-spinner" aria-hidden="true" /> : <FaArrowRight className="lg-btn-arrow" aria-hidden="true" />}
                <span className="lg-btn-shine" aria-hidden="true" />
              </button>
            </form>
          )}

          {/* ---------- DONE ---------- */}
          {step === 3 && (
            <div className="fp-done">
              <span className="fp-done-icon"><FaCheckCircle /></span>
              <h1 className="lg-title">Password updated</h1>
              <p className="lg-subtitle">You can sign in with your new password now.</p>
              <button type="button" className="lg-btn" onClick={() => navigate("/login")} style={{ "--i": 0 }}>
                <span className="lg-btn-label">Go to login</span>
                <FaArrowRight className="lg-btn-arrow" aria-hidden="true" />
                <span className="lg-btn-shine" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
