import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import styles from "./Transactions.module.css";

const Transactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTransactions();
  }, [user, navigate]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch all transaction types
      const [paymentsRes, withdrawalsRes, spinsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/payment/payment-history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/withdrawal/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/number-guess/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payments = paymentsRes.ok
        ? (await paymentsRes.json()).payments || []
        : [];
      const withdrawals = withdrawalsRes.ok
        ? (await withdrawalsRes.json()).withdrawals || []
        : [];
      const games = spinsRes.ok
        ? (await spinsRes.json()).gameHistory || []
        : [];

      // Combine and format all transactions
      const allTransactions = [
        ...payments.map((p) => ({
          id: p._id,
          type: "deposit",
          amount: p.amount,
          status: p.status,
          date: p.createdAt,
          description: "Wallet Recharge",
          icon: "💰",
          color: "green",
        })),
        ...withdrawals.map((w) => ({
          id: w._id,
          type: "withdrawal",
          amount: w.amount,
          status: w.status,
          date: w.createdAt,
          description: "Withdrawal Request",
          icon: "💸",
          color: "blue",
        })),
        ...games.map((g) => ({
          id: g._id,
          type: "game",
          amount: g.amountWon,
          status: "completed",
          date: g.createdAt,
          description: `Number Guess (${g.gameMode || 'Unknown'})`,
          icon: g.amountWon > 0 ? "🎉" : "🎯",
          color: g.amountWon > 0 ? "yellow" : "gray",
        })),
      ];

      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted;
      case "pending":
        return styles.statusPending;
      case "failed":
      case "rejected":
        return styles.statusFailed;
      default:
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading Transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.mainContainer}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>Transaction History</h1>
          <p className={styles.subtitle}>
            Track all your deposits, withdrawals, and spin activities
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className={styles.tabsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.tabs}>
            {[
              { key: "all", label: "All Transactions", icon: "📊" },
              { key: "deposit", label: "Deposits", icon: "💰" },
              { key: "withdrawal", label: "Withdrawals", icon: "💸" },
              { key: "game", label: "Games", icon: "🎯" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${
                  activeTab === tab.key ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          className={styles.transactionsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTransactions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3>No transactions found</h3>
              <p>Start playing to see your transaction history!</p>
              <button
                className={styles.startButton}
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className={styles.transactionsList}>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className={styles.transactionCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={styles.transactionIcon}>
                    {transaction.icon}
                  </div>
                  <div className={styles.transactionDetails}>
                    <div className={styles.transactionHeader}>
                      <h4 className={styles.transactionDescription}>
                        {transaction.description}
                      </h4>
                      <div className={styles.transactionAmount}>
                        {transaction.type === "withdrawal" ? "-" : "+"}₹
                        {transaction.amount}
                      </div>
                    </div>
                    <div className={styles.transactionMeta}>
                      <span className={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                      <span
                        className={`${
                          styles.transactionStatus
                        } ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className={styles.quickActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={styles.actionButton}
            onClick={() => navigate("/add-amount")}
          >
            <span>💰</span>
            Add Money
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/withdraw")}
          >
            <span>💸</span>
            Withdraw
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/dashboard")}
          >
            <span>🎯</span>
            Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Transactions;
