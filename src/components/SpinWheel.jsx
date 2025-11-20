import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SpinWheel.module.css";

// REWARDS must match backend exactly
const REWARDS = ["Better luck next time", "₹10", "₹50", "2X"];
const COLORS = ["#6b7280", "#10b981", "#3b82f6", "#fbbf24"];

const SpinWheel = ({ user, onSpinComplete, spinning, setSpinning }) => {
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleSpin = async () => {
    if (spinning) return;

    const isFreeSpin = user?.hasFreeSpin;
    const currentBalance = user?.totalEarnings || 0;

    if (!isFreeSpin && currentBalance < 50) {
      alert("Insufficient balance. You need at least ₹50 to spin.");
      return;
    }

    setSpinning(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/spin/spin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to spin");
      }

      console.log("Backend result:", data);

      // Get the segment index from backend
      const segmentIndex = data.segmentIndex;

      if (segmentIndex === undefined || segmentIndex === -1) {
        throw new Error(`Invalid reward received: ${data.rewardResult}`);
      }

      // Calculate rotation for exact segment positioning
      const totalSegments = REWARDS.length;
      const segmentAngle = 360 / totalSegments; // 90 degrees per segment

      // Calculate minimum rotations (at least 5 full spins for better effect)
      const minRotations = 5;
      const baseRotation = minRotations * 360;

      // Calculate target angle for the winning segment
      // The pointer is at the top (0°), so we need to align the segment center with it
      const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;

      // Calculate final rotation to land on the exact segment
      const finalRotation = rotation + baseRotation + (360 - targetAngle);

      console.log(
        `Spinning to segment ${segmentIndex} (${REWARDS[segmentIndex]}) with rotation: ${finalRotation}°`
      );

      // Start spinning
      setTimeout(() => {
        setRotation(finalRotation);
      }, 100);

      // Show result after spin animation completes
      setTimeout(() => {
        setResult(data);
        setSpinning(false);
        onSpinComplete();
      }, 4000);
    } catch (error) {
      console.error("Spin error:", error);
      alert(error.message);
      setSpinning(false);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className={styles.title}>🎰 SPIN TO WIN! 🎰</h2>

      <div className={styles.wheelContainer}>
        {/* Glow effect */}
        <div className={styles.glowEffect}></div>

        {/* Pointer */}
        <div className={styles.pointer}>
          <div className={styles.pointerArrow} />
        </div>

        {/* Wheel */}
        <motion.div
          className={styles.wheel}
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.25, 0.1, 0.25, 1], // Better easing for smooth stop
          }}
          style={{ transformOrigin: "center" }}
        >
          <svg viewBox="0 0 200 200" className={styles.wheelSvg}>
            {REWARDS.map((reward, index) => {
              const startAngle = (360 / REWARDS.length) * index;
              const endAngle = startAngle + 360 / REWARDS.length;

              // Convert to radians for calculations
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const textAngle = startAngle + 360 / REWARDS.length / 2;
              const textX = 100 + 60 * Math.cos((textAngle * Math.PI) / 180);
              const textY = 100 + 60 * Math.sin((textAngle * Math.PI) / 180);

              return (
                <g key={index}>
                  <path
                    d={`M 100 100 L ${100 + 90 * Math.cos(startRad)} ${
                      100 + 90 * Math.sin(startRad)
                    } A 90 90 0 0 1 ${100 + 90 * Math.cos(endRad)} ${
                      100 + 90 * Math.sin(endRad)
                    } Z`}
                    fill={COLORS[index]}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={reward === "Better luck next time" ? "8" : "12"}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    className={styles.wheelText}
                  >
                    {reward === "Better luck next time"
                      ? "Better Luck"
                      : reward}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx="100" cy="100" r="20" fill="rgba(15, 23, 42, 0.9)" />
            <circle cx="100" cy="100" r="15" fill="rgba(59, 130, 246, 0.8)" />
            <text
              x="100"
              y="105"
              fill="white"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              SPIN
            </text>
          </svg>
        </motion.div>
      </div>

      <div className={styles.spinInfo}>
        <motion.button
          onClick={handleSpin}
          disabled={spinning}
          className={styles.spinButton}
          whileHover={{ scale: spinning ? 1 : 1.05 }}
          whileTap={{ scale: spinning ? 1 : 0.95 }}
        >
          {spinning ? (
            <div className={styles.spinningText}>
              <div className={styles.spinner}></div>
              SPINNING...
            </div>
          ) : user?.hasFreeSpin ? (
            "🎁 FREE SPIN! 🎁"
          ) : (
            "💰 SPIN (₹50) 💰"
          )}
        </motion.button>

        {!user?.hasFreeSpin && (
          <p className={styles.costText}>
            💎 Each spin costs ₹50. Win cash or 2X multiplier! 💎
          </p>
        )}

        <div className={styles.wheelLegend}>
          <div className={styles.legendTitle}>PRIZES & CHANCES:</div>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <span className={styles.legendText}>Better Luck (30%)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: COLORS[1] }}
              ></div>
              <span className={styles.legendText}>₹10 (40%)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: COLORS[2] }}
              ></div>
              <span className={styles.legendText}>₹50 (25%)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: COLORS[3] }}
              ></div>
              <span className={styles.legendText}>2X Multiplier (5%)</span>
            </div>
          </div>
        </div>

        <div className={styles.balanceInfo}>
          <div className={styles.balanceItem}>
            <span>Your Balance:</span>
            <span className={styles.balanceAmount}>
              ₹{user?.totalEarnings || 0}
            </span>
          </div>
          <div className={styles.balanceItem}>
            <span>Free Spins:</span>
            <span className={styles.freeSpinStatus}>
              {user?.hasFreeSpin ? "AVAILABLE 🎁" : "USED"}
            </span>
          </div>
          {user?.hasMultiplier && user?.multiplierValue > 1 && (
            <div className={styles.balanceItem}>
              <span>Next Spin:</span>
              <span className={styles.multiplierStatus}>
                {user.multiplierValue}X MULTIPLIER 🚀
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {result && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setResult(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti for wins */}
              {(result.amountWon > 0 || result.hasMultiplier) && (
                <div className={styles.confetti}>
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.confettiPiece}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        background:
                          COLORS[Math.floor(Math.random() * COLORS.length)],
                      }}
                    />
                  ))}
                </div>
              )}

              <motion.div
                className={styles.celebrationEmoji}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              >
                {result.amountWon === 0 && !result.hasMultiplier
                  ? "😢"
                  : result.hasMultiplier
                  ? "🚀"
                  : "🎉"}
              </motion.div>

              <h2 className={styles.modalTitle}>
                {result.amountWon === 0 && !result.hasMultiplier
                  ? "BETTER LUCK NEXT TIME!"
                  : result.hasMultiplier
                  ? "2X MULTIPLIER ACTIVATED!"
                  : "CONGRATULATIONS! 🏆"}
              </h2>

              {result.amountWon > 0 && (
                <motion.p
                  className={styles.wonAmount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  ₹{result.amountWon}
                </motion.p>
              )}

              <p className={styles.winMessage}>
                {result.amountWon === 0 && !result.hasMultiplier
                  ? "Don't worry! Try again for better luck! 🍀"
                  : result.hasMultiplier
                  ? "Your next cash win will be doubled! 🔥"
                  : result.amountWon >= 50
                  ? "GREAT WIN! ⭐"
                  : "NICE WIN! 💫"}
              </p>

              <div className={styles.balanceUpdate}>
                <p className={styles.newBalance}>
                  New Balance: <span>₹{result.newBalance}</span>
                </p>
                {result.wasFreeSpin && (
                  <p className={styles.freeSpinNote}>🎁 Free Spin Used!</p>
                )}
                {result.hasMultiplier && (
                  <p className={styles.multiplierNote}>
                    🎯 2X Multiplier Active for Next Cash Win!
                  </p>
                )}
              </div>

              <motion.button
                onClick={() => setResult(null)}
                className={styles.continueButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {result.hasMultiplier ? "🚀 SPIN WITH 2X!" : "🎰 SPIN AGAIN!"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpinWheel;
