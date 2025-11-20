import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NumberGuess.module.css";

const NumberGuess = ({ user, onGameComplete }) => {
  const [selectedMode, setSelectedMode] = useState("2x");
  const [userGuess, setUserGuess] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showRules, setShowRules] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const GAME_MODES = {
    "2x": {
      range: 5,
      payout: 2,
      cost: 50,
      color: "#10b981",
      name: "2X MULTIPLIER",
      description: "Guess 1-5 to double your money!",
    },
    "1.5x": {
      range: 3,
      payout: 1.5,
      cost: 50,
      color: "#3b82f6",
      name: "1.5X MULTIPLIER",
      description: "Guess 1-3 for 1.5X return!",
    },
    100: {
      range: 10,
      payout: 8,
      cost: 50,
      color: "#f59e0b",
      name: "₹100 WIN",
      description: "Win ₹100 (8X payout)",
    },
    200: {
      range: 20,
      payout: 16,
      cost: 50,
      color: "#ef4444",
      name: "₹200 WIN",
      description: "Win ₹200 (16X payout)",
    },
    500: {
      range: 50,
      payout: 40,
      cost: 50,
      color: "#8b5cf6",
      name: "₹500 WIN",
      description: "Win ₹500 (40X payout)",
    },
    1000: {
      range: 100,
      payout: 80,
      cost: 50,
      color: "#ec4899",
      name: "₹1000 WIN",
      description: "Win ₹1000 (80X payout)",
    },
  };

  const handlePlay = async () => {
    if (playing) return;

    const guess = parseInt(userGuess);
    const modeConfig = GAME_MODES[selectedMode];

    if (isNaN(guess) || guess < 1 || guess > modeConfig.range) {
      alert(`Please enter a number between 1 and ${modeConfig.range}`);
      return;
    }

    setPlaying(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/number-guess/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode: selectedMode,
          userGuess: guess,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to play game");
      }

      setGameResult(data);
      onGameComplete(); // Refresh user data
    } catch (error) {
      console.error("Game error:", error);
      alert(error.message);
    } finally {
      setPlaying(false);
    }
  };

  const resetGame = () => {
    setGameResult(null);
    setUserGuess("");
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "2x":
        return "🚀";
      case "1.5x":
        return "⚡";
      case "100":
        return "💰";
      case "200":
        return "💵";
      case "500":
        return "💎";
      case "1000":
        return "🏆";
      default:
        return "🎯";
    }
  };

  const getWinAmount = (mode) => {
    const config = GAME_MODES[mode];
    return config.cost * config.payout;
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className={styles.title}>🎯 NUMBER GUESSING GAME 🎯</h2>

      {/* Game Rules */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            className={styles.rulesCard}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.rulesHeader}>
              <h3>📋 HOW TO PLAY</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowRules(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.rulesList}>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>💰</span>
                <span>All games cost ₹50 to play</span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>🎯</span>
                <span>Guess the correct number to win</span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>⚡</span>
                <span>Higher risk = Higher rewards!</span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>🔥</span>
                <span>Quick games, instant results!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modes Selection */}
      <div className={styles.modesSection}>
        <h3 className={styles.sectionTitle}>Choose Your Challenge</h3>
        <div className={styles.modesGrid}>
          {Object.entries(GAME_MODES).map(([mode, config]) => (
            <motion.button
              key={mode}
              className={`${styles.modeButton} ${
                selectedMode === mode ? styles.modeButtonActive : ""
              }`}
              style={{
                borderColor: config.color,
                background:
                  selectedMode === mode
                    ? `linear-gradient(135deg, ${config.color}, ${config.color}dd)`
                    : "rgba(255, 255, 255, 0.05)",
              }}
              onClick={() => setSelectedMode(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.modeHeader}>
                <div className={styles.modeTitle}>
                  <span className={styles.modeIcon}>{getModeIcon(mode)}</span>
                  <span className={styles.modeName}>{config.name}</span>
                </div>
                <span className={styles.modeCost}>₹{config.cost}</span>
              </div>

              <div className={styles.modeDescription}>{config.description}</div>

              <div className={styles.modeStats}>
                <div className={styles.modeStat}>
                  <span>Range:</span>
                  <span>1-{config.range}</span>
                </div>
                <div className={styles.modeStat}>
                  <span>Payout:</span>
                  <span>{config.payout}X</span>
                </div>
                <div className={styles.modeStat}>
                  <span>Win Chance:</span>
                  <span>1 in {config.range}</span>
                </div>
              </div>

              <div className={styles.winInfo}>
                <div className={styles.winAmount}>
                  Win: ₹{getWinAmount(mode)}
                </div>
                <div className={styles.winProbability}>
                  {((1 / config.range) * 100).toFixed(1)}% chance
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Input */}
      {!gameResult && (
        <motion.div
          className={styles.gameInputSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles.selectedModeInfo}>
            <div className={styles.modeDisplay}>
              <span className={styles.modeIcon}>
                {getModeIcon(selectedMode)}
              </span>
              <div className={styles.modeDetails}>
                <div className={styles.modeName}>
                  {GAME_MODES[selectedMode].name}
                </div>
                <div className={styles.modeDescription}>
                  {GAME_MODES[selectedMode].description}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Enter your guess (1-{GAME_MODES[selectedMode].range})
            </label>
            <input
              type="number"
              min="1"
              max={GAME_MODES[selectedMode].range}
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              className={styles.numberInput}
              placeholder={`1-${GAME_MODES[selectedMode].range}`}
              disabled={playing}
            />
          </div>

          <motion.button
            onClick={handlePlay}
            disabled={playing || !userGuess}
            className={styles.playButton}
            whileHover={{ scale: playing ? 1 : 1.05 }}
            whileTap={{ scale: playing ? 1 : 0.95 }}
          >
            {playing ? (
              <div className={styles.playingText}>
                <div className={styles.spinner}></div>
                PLAYING...
              </div>
            ) : (
              `🎯 PLAY FOR ₹${GAME_MODES[selectedMode].cost}`
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Game Result */}
      <AnimatePresence>
        {gameResult && (
          <motion.div
            className={styles.resultSection}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className={`${styles.resultCard} ${
                gameResult.gameResult.isWinner
                  ? styles.winCard
                  : styles.loseCard
              }`}
            >
              {/* Confetti for wins */}
              {gameResult.gameResult.isWinner && (
                <div className={styles.confetti}>
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.confettiPiece}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        background: [
                          "#ff0080",
                          "#ff8c00",
                          "#00ff88",
                          "#0080ff",
                          "#ffd700",
                        ][Math.floor(Math.random() * 5)],
                      }}
                    />
                  ))}
                </div>
              )}

              <motion.div
                className={styles.resultEmoji}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                {gameResult.gameResult.isWinner ? "🎉" : "😢"}
              </motion.div>

              <h3 className={styles.resultTitle}>
                {gameResult.gameResult.isWinner
                  ? "CONGRATULATIONS! 🏆"
                  : "BETTER LUCK NEXT TIME!"}
              </h3>

              <div className={styles.resultDetails}>
                <div className={styles.resultRow}>
                  <span>Game Mode:</span>
                  <span className={styles.modeName}>
                    {GAME_MODES[gameResult.gameResult.mode]?.name}
                  </span>
                </div>
                <div className={styles.resultRow}>
                  <span>Your Guess:</span>
                  <span className={styles.guessNumber}>
                    {gameResult.gameResult.userGuess}
                  </span>
                </div>
                <div className={styles.resultRow}>
                  <span>Correct Number:</span>
                  <span className={styles.correctNumber}>
                    {gameResult.gameResult.correctNumber}
                  </span>
                </div>
                <div className={styles.resultRow}>
                  <span>Game Cost:</span>
                  <span>₹{gameResult.gameResult.gameCost}</span>
                </div>
                {gameResult.gameResult.isWinner && (
                  <div className={styles.winAmount}>
                    <span>You Won:</span>
                    <span className={styles.amount}>
                      ₹{gameResult.gameResult.amountWon}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.balanceUpdate}>
                <p>
                  New Balance: <strong>₹{gameResult.newBalance}</strong>
                </p>
              </div>

              <motion.button
                onClick={resetGame}
                className={styles.playAgainButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 PLAY AGAIN
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balance Info */}
      <div className={styles.balanceInfo}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceItem}>
            <span>Your Balance:</span>
            <span className={styles.balanceAmount}>
              ₹{user?.totalEarnings || 0}
            </span>
          </div>
          <div className={styles.balanceItem}>
            <span>Selected Mode:</span>
            <span
              className={styles.modeBadge}
              style={{
                background: `linear-gradient(135deg, ${GAME_MODES[selectedMode].color}, ${GAME_MODES[selectedMode].color}dd)`,
              }}
            >
              {getModeIcon(selectedMode)} {GAME_MODES[selectedMode].name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Current Game Stats</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                1 in {GAME_MODES[selectedMode].range}
              </div>
              <div className={styles.statLabel}>Win Chance</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {GAME_MODES[selectedMode].payout}X
              </div>
              <div className={styles.statLabel}>Payout</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                ₹{getWinAmount(selectedMode)}
              </div>
              <div className={styles.statLabel}>Potential Win</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NumberGuess;
