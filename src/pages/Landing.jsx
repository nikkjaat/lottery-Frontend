import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

const Landing = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const pulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={styles.pageContainer}>
      {/* Floating Particles */}
      <div className={styles.floatingParticles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              background: `rgba(${Math.random() * 255}, ${
                Math.random() * 255
              }, ${Math.random() * 255}, 0.6)`,
            }}
          />
        ))}
      </div>

      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <motion.div
              className={styles.logoIcon}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>🎰</span>
            </motion.div>
            <span className={styles.logoText}>LUCKY SPIN</span>
          </div>
          <div className={styles.navButtons}>
            <motion.button
              onClick={() => navigate("/login")}
              className={styles.navButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 PLAY NOW
            </motion.button>
            <motion.button
              onClick={() => navigate("/signup")}
              className={styles.signUpButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 GET STARTED
            </motion.button>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <motion.div
          className={styles.heroContainer}
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
            SPIN & WIN BIG!
          </motion.h1>

          <motion.p className={styles.heroSubtitle} variants={fadeInUp}>
            Test your luck with our number guessing game! Choose your
            difficulty, make your guess, and win big rewards instantly. Your
            fortune awaits!
          </motion.p>

          <motion.div className={styles.heroButtons} variants={fadeInUp}>
            <motion.button
              onClick={() => navigate("/signup")}
              className={styles.primaryButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 START GUESSING
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              className={styles.secondaryButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔥 QUICK PLAY
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.bonusBadge}
            variants={fadeInUp}
            animate="animate"
            variants={pulse}
          >
            <p className={styles.bonusText}>
              💰 INSTANT ₹500 BONUS + FREE SPINS! 💰
            </p>
          </motion.div>

          <motion.div className={styles.wheelDemo} variants={fadeInUp}>
            <div className={styles.wheelContainer}>
              <motion.div
                className={styles.glowEffect}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className={styles.wheel}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className={styles.wheelInner}>
                  <span
                    style={{
                      fontSize: "4rem",
                      filter: "drop-shadow(0 0 20px #ff0080)",
                    }}
                  >
                    🎯
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            HOW TO WIN BIG
          </motion.h2>

          <div className={styles.stepsGrid}>
            {[
              {
                icon: "👑",
                title: "SIGN UP",
                desc: "Create your account in 30 seconds and get instant access",
              },
              {
                icon: "💰",
                title: "CLAIM BONUS",
                desc: "Get ₹500 welcome bonus + 5 free spins immediately",
              },
              {
                icon: "🎰",
                title: "GUESS TO WIN",
                desc: "Choose your number and watch your rewards multiply",
              },
              {
                icon: "💎",
                title: "CASH OUT",
                desc: "Withdraw your winnings instantly to your bank",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            MASSIVE JACKPOTS AWAIT
          </motion.h2>

          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Every guess brings you closer to life-changing wins. With multiple
            difficulty levels and massive payouts, your next guess could be the
            one!
          </motion.p>

          <div className={styles.rewardsGrid}>
            {[
              { amount: "₹10K", color: styles.rewardGreen, desc: "MEGA WIN" },
              {
                amount: "₹25K",
                color: styles.rewardBlue,
                desc: "EPIC JACKPOT",
              },
              {
                amount: "₹50K",
                color: styles.rewardPurple,
                desc: "SUPER PRIZE",
              },
              {
                amount: "₹1 LAKH",
                color: styles.rewardGold,
                desc: "GRAND SLAM",
              },
            ].map((reward, idx) => (
              <motion.div
                key={idx}
                className={`${styles.rewardCard} ${reward.color}`}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  💎
                </div>
                <div>{reward.amount}</div>
                <div
                  style={{
                    fontSize: "1rem",
                    opacity: 0.9,
                    marginTop: "0.5rem",
                  }}
                >
                  {reward.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.ctaContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            READY TO BECOME A WINNER?
          </motion.h2>

          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of players who've already hit big wins. Your lucky
            guess is just one click away!
          </motion.p>

          <motion.button
            onClick={() => navigate("/signup")}
            className={styles.ctaButton}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            🚀 START WINNING NOW!
          </motion.button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.sectionContainer}>
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerTitle}>LUCKY SPIN</h3>
              <p className={styles.stepDescription}>
                Your ultimate destination for thrilling spins and massive wins.
                Trusted by millions of players worldwide.
              </p>
            </div>
            <div>
              <h4 className={styles.footerTitle}>QUICK LINKS</h4>
              <div className={styles.footerLinks}>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className={styles.footerLink}
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={() => navigate("/faq")}
                  className={styles.footerLink}
                >
                  ❓ Help Center
                </button>
                <button className={styles.footerLink}>📱 Download App</button>
              </div>
            </div>
            <div>
              <h4 className={styles.footerTitle}>PLAY RESPONSIBLY</h4>
              <p className={styles.stepDescription}>
                Must be 18+ to participate. Gambling can be addictive. Play
                responsibly and set limits.
              </p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>
              © 2024 LUCKY SPIN CASINO. All rights reserved. | Licensed and
              Regulated
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
