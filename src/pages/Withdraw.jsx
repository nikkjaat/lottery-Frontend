import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Withdraw.module.css";

const Withdraw = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (!amount || amount < 100) {
      setError("Minimum withdrawal amount is ₹100");
      return;
    }

    if (amount > (userData?.winningBalance || 0)) {
      setError("Insufficient winning balance");
      return;
    }

    if (amount > 50000) {
      setError("Maximum withdrawal amount is ₹50,000 per day");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/withdrawal/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          bankName: formData.bankName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process withdrawal");
      }

      setSuccess(
        data.message ||
          "Withdrawal request submitted successfully! Amount will be processed within 24-48 hours."
      );
      setFormData({
        amount: "",
        accountHolderName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        bankName: "",
      });

      // Refresh user data
      fetchUserData();

      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const winningBalance = userData?.winningBalance || 0;

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.logoButton}
          >
            <div className={styles.logoIcon}>
              <span>🎯</span>
            </div>
            <span className={styles.logoText}>Achie Coins</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.backButton}
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>Withdraw Winnings</h1>
          <p className={styles.subtitle}>
            Transfer your winning amount securely to your bank account
          </p>

          <div className={styles.grid}>
            <div>
              <div className={styles.mainCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Withdrawal Amount</label>
                    <div className={styles.amountContainer}>
                      <span className={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        required
                        min="100"
                        max={winningBalance}
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className={`${styles.input} ${styles.amountInput}`}
                        placeholder="Enter amount"
                      />
                    </div>
                    <p className={styles.hint}>
                      💰 Available: ₹{winningBalance} | Min: ₹100 | Max: ₹50,000
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Account Holder Name</label>
                    <input
                      type="text"
                      required
                      value={formData.accountHolderName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountHolderName: e.target.value,
                        })
                      }
                      className={styles.input}
                      placeholder="Enter full name as per bank records"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData({ ...formData, bankName: e.target.value })
                      }
                      className={styles.input}
                      placeholder="Enter your bank name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Account Number</label>
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className={styles.input}
                      placeholder="Enter account number"
                      maxLength={18}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.confirmAccountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmAccountNumber: e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                        })
                      }
                      className={styles.input}
                      placeholder="Re-enter account number"
                      maxLength={18}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>IFSC Code</label>
                    <input
                      type="text"
                      required
                      value={formData.ifscCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ifscCode: e.target.value.toUpperCase(),
                        })
                      }
                      className={`${styles.input} ${styles.ifscInput}`}
                      placeholder="Enter IFSC code"
                      maxLength={11}
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                    />
                  </div>

                  {error && <div className={styles.error}>{error}</div>}

                  {success && <div className={styles.success}>{success}</div>}

                  <motion.button
                    type="submit"
                    disabled={loading || winningBalance < 100}
                    className={`${styles.primaryButton} ${
                      loading ? styles.pulse : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <span>Processing...</span>
                        <span>🔄</span>
                      </>
                    ) : (
                      <>
                        <span>Withdraw ₹{formData.amount || "0"}</span>
                        <span>💸</span>
                      </>
                    )}
                  </motion.button>

                  <div className={styles.secureBadge}>
                    🔒 Bank-grade security • SSL Encrypted
                  </div>
                </form>
              </div>
            </div>

            <div className={styles.sidebar}>
              <motion.div
                className={styles.balanceCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={styles.balanceTitle}>Available Balance</h3>
                <div className={styles.balanceItem}>
                  <p className={styles.balanceLabel}>
                    Winning Balance (Withdrawable)
                  </p>
                  <p className={styles.winningAmount}>₹{winningBalance}</p>
                </div>
                <div className={styles.balanceItem}>
                  <p className={styles.balanceLabel}>Deposit Balance</p>
                  <p className={styles.depositAmount}>
                    ₹{userData?.depositBalance || 0}
                  </p>
                  <p className={styles.depositNote}>
                    Not available for withdrawal
                  </p>
                </div>
              </motion.div>

              <motion.div
                className={styles.infoCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={styles.infoHeader}>
                  <span className={styles.infoIcon}>📋</span>
                  <div>
                    <h3 className={styles.infoTitle}>Withdrawal Guidelines</h3>
                  </div>
                </div>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    Only winning balance can be withdrawn
                  </li>
                  <li className={styles.infoItem}>
                    Minimum withdrawal: <strong>₹100</strong>
                  </li>
                  <li className={styles.infoItem}>
                    Maximum withdrawal: <strong>₹50,000 per day</strong>
                  </li>
                  <li className={styles.infoItem}>
                    Processing time:{" "}
                    <span className={styles.processingTime}>24-48 hours</span>
                  </li>
                  <li className={styles.infoItem}>
                    Ensure all bank details are accurate
                  </li>
                  <li className={styles.infoItem}>
                    Withdrawal fee: <strong>₹0</strong> (Free)
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Withdraw;
