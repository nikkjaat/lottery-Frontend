import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./FAQ.module.css";

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started?",
      answer:
        "Simply sign up with your email, verify with the OTP sent to you, and get an instant ₹20 bonus to start spinning!",
    },
    {
      question: "What is the login bonus?",
      answer:
        "New users receive ₹20 instantly upon their first successful login. This bonus is automatically added to your wallet.",
    },
    {
      question: "How does the spin wheel work?",
      answer:
        "Choose a difficulty level (Easy: 1-10, Medium: 1-50, Hard: 1-100) and guess the correct number! Win big with higher payouts for harder difficulties.",
    },
    {
      question: "What are the game modes?",
      answer:
        "Easy mode (₹10): Guess 1-10 for 8X payout. Medium mode (₹25): Guess 1-50 for 25X payout. Hard mode (₹50): Guess 1-100 for 50X payout!",
    },
    {
      question: "What are the possible prizes?",
      answer:
        "Easy mode can win up to ₹80, Medium mode up to ₹625, and Hard mode up to ₹2500! The harder the difficulty, the bigger the reward!",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "The withdrawal feature is coming soon! You will be able to cash out your earnings directly to your bank account or preferred payment method.",
    },
    {
      question: "Is my information secure?",
      answer:
        "Yes! We use industry-standard security measures including OTP verification and encrypted data storage to keep your information safe.",
    },
    {
      question: "Can I see other players' winnings?",
      answer:
        "Yes! Check out the Leaderboard page to see top earners and recent winners. Compete with other players to reach the top!",
    },
    {
      question: "What if I run out of coins?",
      answer:
        "You can earn more coins by participating in special promotions, daily bonuses (coming soon), or by winning big on your spins!",
    },
    {
      question: "Is there a limit to how much I can win?",
      answer:
        "There is no limit! Keep spinning and keep winning. The more you play, the more you can earn!",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
              onClick={() => navigate("/leaderboard")}
              className={styles.navButton}
            >
              Leaderboard
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
          Frequently Asked Questions
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Find answers to common questions about Achie Coins
        </motion.p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={styles.faqButton}
              >
                <span className={styles.faqQuestion}>{faq.question}</span>
                <motion.span
                  className={styles.chevron}
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={styles.faqAnswer}>{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={styles.ctaTitle}>Still have questions?</h2>
          <p className={styles.ctaText}>
            Ready to start spinning and winning real coins?
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.ctaButton}
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
