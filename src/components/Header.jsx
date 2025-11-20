import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
  });
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    setFormData({
      name: user?.name || "",
      mobile: user?.mobile || "",
    });
    setShowEditModal(true);
    setShowProfileMenu(false);
    setOtpStep(1);
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      updateUser(data.user);
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMobileOTP = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/send-mobile-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile: formData.mobile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpStep(2);
      if (data.otp) {
        console.log("Mobile OTP for testing:", data.otp);
        alert(`OTP sent! For testing, use: ${data.otp}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/verify-mobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      updateUser(data.user);
      setShowEditModal(false);
      alert("Mobile number verified successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <button onClick={() => navigate("/")} className={styles.logoButton}>
            <div className={styles.logoIcon}>
              <span>🎯</span>
            </div>
            <span className={styles.logoText}>Achie Coins</span>
          </button>

          <div className={styles.navLinks}>
            <button
              onClick={() => navigate("/leaderboard")}
              className={styles.navLink}
            >
              Leaderboard
            </button>
            <button onClick={() => navigate("/faq")} className={styles.navLink}>
              FAQ
            </button>

            {/* User Profile Dropdown */}
            <div className={styles.profileContainer}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={styles.profileButton}
              >
                <div className={styles.avatar}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.dropdownArrow}>▼</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className={styles.profileMenu}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className={styles.menuHeader}>
                      <div className={styles.menuAvatar}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className={styles.menuUserInfo}>
                        <p className={styles.menuUserName}>{user?.name}</p>
                        <p className={styles.menuUserEmail}>{user?.email}</p>
                        {user?.mobile && (
                          <p className={styles.menuUserMobile}>
                            📱 {user.mobile}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleEditProfile}
                      className={styles.menuItem}
                    >
                      ✏️ Edit Profile
                    </button>

                    <button
                      onClick={() => navigate("/transactions")}
                      className={styles.menuItem}
                    >
                      💰 Transaction History
                    </button>

                    <hr className={styles.menuDivider} />

                    <button
                      onClick={handleLogout}
                      className={styles.menuItemLogout}
                    >
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {otpStep === 1 ? "Edit Profile" : "Verify Mobile Number"}
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className={styles.modalForm}>
                {otpStep === 1 ? (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={styles.input}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Mobile Number {user?.mobile && "✓"}
                      </label>
                      <div className={styles.mobileInputContainer}>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobile: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          className={styles.input}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          disabled={!!user?.mobile}
                        />
                        {!user?.mobile && formData.mobile.length === 10 && (
                          <button
                            type="button"
                            onClick={handleSendMobileOTP}
                            className={styles.verifyButton}
                            disabled={loading}
                          >
                            {loading ? "Sending..." : "Verify"}
                          </button>
                        )}
                      </div>
                      {user?.mobile && (
                        <p className={styles.verifiedText}>
                          ✅ Mobile number verified
                        </p>
                      )}
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className={styles.secondaryButton}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={styles.primaryButton}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        className={`${styles.input} ${styles.otpInput}`}
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className={styles.otpHint}>
                        OTP sent to your mobile ending with{" "}
                        {formData.mobile.slice(-4)}
                      </p>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        onClick={() => setOtpStep(1)}
                        className={styles.secondaryButton}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyMobileOTP}
                        disabled={loading || otp.length !== 6}
                        className={styles.primaryButton}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
