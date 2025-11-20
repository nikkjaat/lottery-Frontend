import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./AddAmount.module.css";

const AddAmount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddAmount = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const amount = selectedAmount || parseInt(customAmount);

    if (!amount || amount < 100) {
      setError("Minimum deposit amount is ₹100");
      return;
    }

    if (amount > 50000) {
      setError("Maximum deposit amount is ₹50,000");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Create order
      const token = localStorage.getItem("token");
      const orderResponse = await fetch(
        `${API_BASE_URL}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.order.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Achie Coins",
        description: "Add money to wallet",
        order_id: orderData.order.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6",
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              `${API_BASE_URL}/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed"
              );
            }

            alert(`₹${amount} added successfully to your wallet!`);
            navigate("/dashboard");
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getDisplayAmount = () => {
    return selectedAmount || customAmount || 0;
  };

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
          <h1 className={styles.title}>Add Money to Wallet</h1>
          <p className={styles.subtitle}>
            Add money to your wallet and keep spinning!
          </p>

          <div className={styles.mainCard}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Select Amount</h2>
              <div className={styles.amountGrid}>
                {presetAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`${styles.amountButton} ${
                      selectedAmount === amount
                        ? styles.amountButtonSelected
                        : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ₹{amount}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Custom Amount</h2>
              <div className={styles.customAmountContainer}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter amount (Min ₹100)"
                  className={styles.customInput}
                />
              </div>
              <p className={styles.minimumText}>
                💰 Minimum: ₹100 • Maximum: ₹50,000
              </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Amount to Add:</span>
                <span className={styles.summaryAmount}>
                  ₹{getDisplayAmount()}
                </span>
              </div>
              <div className={styles.paymentMethod}>
                <span className={styles.methodLabel}>Payment Method:</span>
                <span className={styles.methodValue}>
                  Razorpay (Cards, UPI, Net Banking)
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleAddAmount}
              disabled={loading || (!selectedAmount && !customAmount)}
              className={`${styles.primaryButton} ${
                loading ? styles.pulse : ""
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span>Processing... 🔄</span>
              ) : (
                <span>Pay ₹{getDisplayAmount()} 💳</span>
              )}
            </motion.button>

            <div className={styles.securityBadge}>
              <span className={styles.securityIcon}>🔒</span>
              <div className={styles.securityText}>
                <strong>100% Secure Payment</strong>
                <p>Powered by Razorpay • SSL Encrypted</p>
              </div>
            </div>
          </div>

          <motion.div
            className={styles.infoCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.infoHeader}>
              <span className={styles.infoIcon}>💡</span>
              <div>
                <h3 className={styles.infoTitle}>Payment Information</h3>
                <p className={styles.infoText}>
                  • Deposited amounts are added to your wallet balance
                  <br />
                  • Only winnings from spins can be withdrawn
                  <br />
                  • All payments are processed securely via Razorpay
                  <br />• Instant credit to your wallet after successful payment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddAmount;
