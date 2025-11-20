import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import NumberGuess from "../components/NumberGuess";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Memoized calculations for better performance
  const stats = useMemo(() => {
    const totalWins = gameHistory.reduce(
      (sum, game) => sum + game.amountWon,
      0
    );
    const totalGames = gameHistory.length;
    const gamesWon = gameHistory.filter((game) => game.isWinner).length;
    const biggestWin =
      gameHistory.length > 0
        ? Math.max(...gameHistory.map((game) => game.amountWon))
        : 0;

    return { totalWins, totalGames, gamesWon, biggestWin };
  }, [gameHistory]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserData();
    checkDailyBonus();
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
      setGameHistory(data.gameHistory || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkDailyBonus = () => {
    const lastClaimed = localStorage.getItem("lastDailyBonus");
    const today = new Date().toDateString();
    setDailyBonusClaimed(lastClaimed === today);
  };

  const handleDailyBonus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/daily-bonus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Daily bonus claimed! You received ₹${data.bonusAmount}`);
        localStorage.setItem("lastDailyBonus", new Date().toDateString());
        setDailyBonusClaimed(true);
        fetchUserData();
      }
    } catch (error) {
      console.error("Daily bonus error:", error);
    }
  };

  const handleAddAmount = () => {
    navigate("/add-amount");
  };

  const handleWithdraw = () => {
    navigate("/withdraw");
  };

  const handleTransactionHistory = () => {
    navigate("/transactions");
  };

  const handleRewards = () => {
    navigate("/rewards");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading Your Fortune...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.mainContainer}>
        {/* Welcome Section */}
        <motion.div
          className={styles.welcomeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.welcomeTitle}>
            Welcome back, {userData?.name}! 🎯
          </h1>
          <p className={styles.welcomeSubtitle}>
            Ready to spin and win? Your fortune awaits!
          </p>
        </motion.div>

        {/* Balance Cards */}
        <div className={styles.balanceGrid}>
          <motion.div
            className={styles.balanceCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.balanceIcon}>💰</div>
            <div className={styles.balanceInfo}>
              <div className={styles.balanceLabel}>Total Balance</div>
              <div className={styles.balanceAmount}>
                ₹{userData?.totalEarnings || 0}
              </div>
            </div>
            {userData?.hasFreeSpin && (
              <div className={styles.freeSpinBadge}>FREE SPIN 🎁</div>
            )}
          </motion.div>

          <motion.div
            className={styles.balanceCard}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.balanceIcon}>🎁</div>
            <div className={styles.balanceInfo}>
              <div className={styles.balanceLabel}>Bonus Balance</div>
              <div className={styles.bonusAmount}>
                ₹{userData?.bonusBalance || 0}
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.balanceCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.balanceIcon}>🏆</div>
            <div className={styles.balanceInfo}>
              <div className={styles.balanceLabel}>Winning Balance</div>
              <div className={styles.winningAmount}>
                ₹{userData?.winningBalance || 0}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Number Guess Section */}
          <section className={styles.gameSection}>
            <NumberGuess
              user={userData}
              onGameComplete={fetchUserData}
              playing={playing}
              setPlaying={setPlaying}
            />
          </section>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <motion.div
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.totalGames}</div>
                  <div className={styles.statLabel}>Total Games</div>
                </div>
              </motion.div>

              <motion.div
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={styles.statIcon}>🔥</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>₹{stats.biggestWin}</div>
                  <div className={styles.statLabel}>Biggest Win</div>
                </div>
              </motion.div>

              <motion.div
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={styles.statIcon}>💎</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>₹{stats.totalWins}</div>
                  <div className={styles.statLabel}>Total Winnings</div>
                </div>
              </motion.div>

              <motion.div
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className={styles.statIcon}>🎁</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.gamesWon}</div>
                  <div className={styles.statLabel}>Games Won</div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              className={styles.actionsCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className={styles.cardTitle}>Quick Actions</h3>
              <div className={styles.actionsGrid}>
                <button
                  className={`${styles.actionButton} ${styles.addAmountButton}`}
                  onClick={handleAddAmount}
                >
                  <span className={styles.actionIcon}>💰</span>
                  <span>Add Money</span>
                </button>
                <button
                  className={`${styles.actionButton} ${styles.withdrawButton}`}
                  onClick={handleWithdraw}
                  disabled={
                    !userData?.winningBalance || userData.winningBalance < 1000
                  }
                >
                  <span className={styles.actionIcon}>💸</span>
                  <span>Withdraw</span>
                </button>
                <button
                  className={`${styles.actionButton} ${styles.leaderboardButton}`}
                  onClick={() => navigate("/leaderboard")}
                >
                  <span className={styles.actionIcon}>🏆</span>
                  <span>Leaderboard</span>
                </button>
                <button
                  className={`${styles.actionButton} ${styles.dailyBonusButton}`}
                  onClick={handleDailyBonus}
                  disabled={dailyBonusClaimed}
                >
                  <span className={styles.actionIcon}>🎯</span>
                  <span>{dailyBonusClaimed ? "Claimed" : "Daily Bonus"}</span>
                </button>
                <button
                  className={`${styles.actionButton} ${styles.rewardsButton}`}
                  onClick={handleRewards}
                >
                  <span className={styles.actionIcon}>⚡</span>
                  <span>Rewards</span>
                </button>
                <button
                  className={`${styles.actionButton} ${styles.transactionButton}`}
                  onClick={handleTransactionHistory}
                >
                  <span className={styles.actionIcon}>📊</span>
                  <span>Transactions</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className={styles.activityCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className={styles.cardTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                {gameHistory.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <p>No games yet</p>
                    <span>Start playing to see your history!</span>
                  </div>
                ) : (
                  gameHistory.slice(0, 5).map((game, index) => (
                    <motion.div
                      key={game._id || game.id}
                      className={styles.activityItem}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={styles.activityIcon}>
                        {game.amountWon > 0 ? "💰" : "😊"}
                      </div>
                      <div className={styles.activityDetails}>
                        <div className={styles.activityText}>
                          {game.amountWon > 0
                            ? `Won ₹${game.amountWon}`
                            : "Better luck next time"}
                        </div>
                        <div className={styles.activityTime}>
                          {new Date(game.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {game.gameMode && (
                        <div className={styles.modeTag}>
                          {game.gameMode.toUpperCase()}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
