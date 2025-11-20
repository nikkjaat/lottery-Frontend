import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./Leaderboard.module.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [recentWinners, setRecentWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Try to fetch real data first
      const [leadersRes, winnersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/leaderboard`).catch(() => null),
        fetch(`${API_BASE_URL}/recent-winners`).catch(() => null),
      ]);

      let leaders = [];
      let winners = [];

      if (leadersRes && leadersRes.ok) {
        const data = await leadersRes.json();
        leaders = data.leaderboard || [];
      }

      if (winnersRes && winnersRes.ok) {
        const data = await winnersRes.json();
        winners = data.recentWinners || [];
      }

      // If no real data, use mock data
      if (leaders.length === 0) {
        leaders = [
          {
            rank: 1,
            name: "Rajesh Kumar",
            totalEarnings: 15420,
            joined: new Date("2024-01-15"),
          },
          {
            rank: 2,
            name: "Priya Sharma",
            totalEarnings: 12850,
            joined: new Date("2024-01-20"),
          },
          {
            rank: 3,
            name: "Amit Singh",
            totalEarnings: 11200,
            joined: new Date("2024-01-18"),
          },
          {
            rank: 4,
            name: "Sneha Patel",
            totalEarnings: 9750,
            joined: new Date("2024-01-22"),
          },
          {
            rank: 5,
            name: "Vikram Gupta",
            totalEarnings: 8900,
            joined: new Date("2024-01-25"),
          },
          {
            rank: 6,
            name: "Anita Verma",
            totalEarnings: 7650,
            joined: new Date("2024-01-28"),
          },
          {
            rank: 7,
            name: "Rohit Jain",
            totalEarnings: 6800,
            joined: new Date("2024-02-01"),
          },
          {
            rank: 8,
            name: "Kavya Reddy",
            totalEarnings: 5950,
            joined: new Date("2024-02-03"),
          },
          {
            rank: 9,
            name: "Arjun Mehta",
            totalEarnings: 5200,
            joined: new Date("2024-02-05"),
          },
          {
            rank: 10,
            name: "Deepika Nair",
            totalEarnings: 4750,
            joined: new Date("2024-02-08"),
          },
        ];
      }

      if (winners.length === 0) {
        winners = [
          {
            userName: "Rajesh Kumar",
            amountWon: 1000,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          },
          {
            userName: "Priya Sharma",
            amountWon: 500,
            wasFreeSpin: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          },
          {
            userName: "Amit Singh",
            amountWon: 750,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          },
          {
            userName: "Sneha Patel",
            amountWon: 250,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
          {
            userName: "Vikram Gupta",
            amountWon: 1000,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
          },
          {
            userName: "Anita Verma",
            amountWon: 500,
            wasFreeSpin: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          },
          {
            userName: "Rohit Jain",
            amountWon: 300,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
          },
          {
            userName: "Kavya Reddy",
            amountWon: 800,
            wasFreeSpin: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
          },
        ];
      }

      setTopUsers(leaders);
      setRecentWinners(winners);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={styles.container}>
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
              onClick={() => navigate("/dashboard")}
              className={styles.navButton}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/faq")}
              className={styles.navButton}
            >
              FAQ
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🏆 Leaderboard
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          See who's winning big and climbing the ranks!
        </motion.p>

        <div className={styles.grid}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={`${styles.cardTitle} ${styles.topEarnersTitle}`}>
              <span className={styles.cardIcon}>🏆</span>
              Top Earners
            </h2>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : topUsers.length === 0 ? (
              <div className={styles.empty}>No users yet. Be the first!</div>
            ) : (
              <div className={styles.userList}>
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.rank || index}
                    className={styles.userCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.userInfo}>
                      <div className={styles.medal}>{getMedalEmoji(index)}</div>
                      <div className={styles.userDetails}>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userJoined}>
                          Joined {new Date(user.joined).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={styles.earnings}>
                      <p className={styles.earningsAmount}>
                        ₹{user.totalEarnings}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={`${styles.cardTitle} ${styles.recentWinnersTitle}`}>
              <span className={styles.cardIcon}>🎰</span>
              Recent Big Wins
            </h2>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : recentWinners.length === 0 ? (
              <div className={styles.empty}>No big wins yet</div>
            ) : (
              <div className={styles.winnersList}>
                {recentWinners.map((winner, index) => (
                  <motion.div
                    key={index}
                    className={styles.winnerCard}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.winnerInfo}>
                      <div className={styles.winnerDetails}>
                        <p className={styles.winnerName}>
                          {winner.userName || "Anonymous"}
                        </p>
                        <p className={styles.winnerTime}>
                          {getTimeAgo(winner.createdAt)}
                          {winner.wasFreeSpin && (
                            <span className={styles.freeSpinBadge}>FREE</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className={styles.winnerAmount}>
                          +₹{winner.amountWon}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.ctaTitle}>Ready to Join the Winners?</h3>
          <p className={styles.ctaText}>
            Start spinning now and climb your way to the top of the leaderboard!
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.ctaButton}
          >
            🎯 Start Spinning Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
