import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
  });

  // Use your backend API URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // Show OTP in development mode
      if (data.otp) {
        console.log("OTP for testing:", data.otp);
        alert(`OTP sent! For testing, use: ${data.otp}`);
      } else {
        alert("OTP sent to your email!");
      }

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Pass both user data and token to login function
      login(data.user, data.token);

      if (data.bonusAdded > 0) {
        alert(`Welcome! You've received ₹${data.bonusAdded} bonus!`);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button onClick={() => navigate("/")} className={styles.logoButton}>
            <div className={styles.logoIcon}>
              <span className="text-3xl">🎯</span>
            </div>
            <span className={styles.logoText}>Achie Coins</span>
          </button>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join and get ₹20 instant bonus!</p>
        </div>

        <motion.div
          className={styles.formContainer}
          whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
        >
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={styles.input}
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={styles.input}
                  placeholder="Enter your email"
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.primaryButton}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Enter OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otp: e.target.value.toUpperCase(),
                    })
                  }
                  className={`${styles.input} ${styles.otpInput}`}
                  placeholder="000000"
                />
                <p className={styles.otpHint}>
                  OTP sent to {formData.email}
                  <br />
                  <small style={{ color: "#f59e0b" }}>
                    Check console for OTP in development mode
                  </small>
                </p>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.primaryButton}
              >
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className={styles.secondaryButton}
              >
                Change Email
              </button>
            </form>
          )}

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className={styles.footerLink}
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
