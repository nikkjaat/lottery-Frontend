import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import styles from "./Rewards.module.css";

const Rewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [userRewards, setUserRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRewards();
  }, [user, navigate]);

  const fetchRewards = async () => {
    try {
      // Mock rewards data since backend doesn't exist yet
      const mockRewards = [
        {
          id: 1,
          title: "First Spin Bonus",
          description: "Complete your first spin to earn bonus coins",
          reward: 50,
          type: "coins",
          icon: "🎯",
          completed: true,
          progress: 100,
          requirement: "Complete 1 spin",
        },
        {
          id: 2,
          title: "Lucky Streak",
          description: "Win 5 spins in a row",
          reward: 200,
          type: "coins",
          icon: "🔥",
          completed: false,
          progress: 60,
          requirement: "Win 5 consecutive spins",
        },
        {
          id: 3,
          title: "High Roller",
          description: "Spend ₹500 on spins",
          reward: 100,
          type: "coins",
          icon: "💎",
          completed: false,
          progress: 75,
          requirement: "Spend ₹500 total",
        },
        {
          id: 4,
          title: "Daily Player",
          description: "Play for 7 consecutive days",
          reward: 300,
          type: "coins",
          icon: "📅",
          completed: false,
          progress: 42,
          requirement: "Play 7 days in a row",
        },
        {
          id: 5,
          title: "Big Winner",
          description: "Win ₹1000 in a single spin",
          reward: 500,
          type: "coins",
          icon: "🏆",
          completed: false,
          progress: 0,
          requirement: "Win ₹1000+ in one spin",
        },
        {
          id: 6,
          title: "Spin Master",
          description: "Complete 100 spins",
          reward: 250,
          type: "coins",
          icon: "⚡",
          completed: false,
          progress: 23,
          requirement: "Complete 100 total spins",
        },
      ];

      setRewards(mockRewards);
      setUserRewards(mockRewards.filter((r) => r.completed));
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId) => {
    try {
      // Mock claim functionality
      alert("Reward claimed successfully! 🎉");
      fetchRewards();
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading Rewards...</div>
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
          <h1 className={styles.title}>Rewards & Achievements</h1>
          <p className={styles.subtitle}>
            Complete challenges and earn amazing rewards!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className={styles.statsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{userRewards.length}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {rewards.length - userRewards.length}
              </div>
              <div className={styles.statLabel}>Available</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {userRewards.reduce((sum, r) => sum + r.reward, 0)}
              </div>
              <div className={styles.statLabel}>Coins Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Available Rewards */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>Available Rewards</h2>
          <div className={styles.rewardsGrid}>
            {rewards
              .filter((r) => !r.completed)
              .map((reward, index) => (
                <motion.div
                  key={reward.id}
                  className={styles.rewardCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.rewardIcon}>{reward.icon}</div>
                  <div className={styles.rewardContent}>
                    <h3 className={styles.rewardTitle}>{reward.title}</h3>
                    <p className={styles.rewardDescription}>
                      {reward.description}
                    </p>
                    <div className={styles.rewardRequirement}>
                      {reward.requirement}
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${reward.progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>
                        {reward.progress}%
                      </span>
                    </div>

                    <div className={styles.rewardFooter}>
                      <div className={styles.rewardValue}>
                        +{reward.reward} coins
                      </div>
                      <button
                        className={styles.claimButton}
                        disabled={reward.progress < 100}
                        onClick={() => claimReward(reward.id)}
                      >
                        {reward.progress >= 100 ? "Claim" : "In Progress"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Completed Rewards */}
        {userRewards.length > 0 && (
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>Completed Rewards</h2>
            <div className={styles.completedGrid}>
              {userRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  className={styles.completedCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={styles.completedIcon}>{reward.icon}</div>
                  <div className={styles.completedInfo}>
                    <h4 className={styles.completedTitle}>{reward.title}</h4>
                    <div className={styles.completedReward}>
                      +{reward.reward} coins
                    </div>
                  </div>
                  <div className={styles.completedBadge}>✅</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Daily Challenges */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>Daily Challenges</h2>
          <div className={styles.challengesContainer}>
            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>🎯</div>
              <div className={styles.challengeContent}>
                <h3>Daily Spin</h3>
                <p>Complete 3 spins today</p>
                <div className={styles.challengeProgress}>2/3 completed</div>
              </div>
              <div className={styles.challengeReward}>+25 coins</div>
            </div>

            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>💰</div>
              <div className={styles.challengeContent}>
                <h3>Lucky Winner</h3>
                <p>Win at least ₹100 today</p>
                <div className={styles.challengeProgress}>₹75/₹100</div>
              </div>
              <div className={styles.challengeReward}>+50 coins</div>
            </div>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div
          className={styles.backContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            <span>🎯</span>
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
    