import React from 'react';
import { motion } from 'framer-motion';

const Glow = ({ variant = 'top', intensity = 'high', color = 'golden1' }) => {
  // Map intensity prop to a numerical opacity value for the animation
  const intensityValues = {
    low: 0.4,
    medium: 0.6,
    high: 0.8,
  };

  // Color gradients remain the same
  const colorGradients = {
    blue: 'from-blue-500/40 via-purple-500/30 to-cyan-500/40',
    purple: 'from-purple-500/40 via-pink-500/30 to-indigo-500/40',
    green: 'from-green-500/40 via-emerald-500/30 to-teal-500/40',
    orange: 'from-orange-500/40 via-red-500/30 to-pink-500/40',
    white: 'from-white/20 via-gray-300/15 to-white/20',
    golden: 'from-yellow-400/40 via-amber-500/30 to-yellow-600/40',
    golden1: 'from-amber-300/40 via-yellow-600/30 to-amber-900/40',
    golden2: 'from-yellow-400/30 via-amber-700/40 to-stone-900/50',
  };

  // Framer Motion variants for the breathing and floating animation
  const glowAnimation = {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    animate: (i) => ({ // Use custom prop 'i' for staggering
      opacity: [0.1, intensityValues[intensity], 0.1],
      scale: [1, 1.05, 1],
      x: i % 2 === 0 ? ['0%', '2%', '0%'] : ['0%', '-2%', '0%'], // Gentle horizontal drift
      y: i < 2 ? ['0%', '-3%', '0%'] : ['0%', '3%', '0%'],       // Gentle vertical drift
      transition: {
        delay: i * 0.7, // Stagger animations for a more natural feel
        duration: 6 + (i * 2), // Vary duration slightly for each element
        ease: "easeInOut",
        repeat: Infinity,
      },
    }),
  };

  // Gets the base positioning and color styles
  const getBaseGlowStyles = (variant) => {
    const baseStyles = `absolute pointer-events-none ${colorGradients[color]} blur-3xl`;
    switch (variant) {
      case 'top':
        return `${baseStyles} top-0 left-0 w-full h-full bg-gradient-to-b rounded-b-[100%] transform -translate-y-1/2`;
      case 'center':
        return `${baseStyles} top-1/2 left-1/2 w-96 h-96 bg-gradient-radial rounded-full transform -translate-x-1/2 -translate-y-1/2`;
      case 'bottom':
        return `${baseStyles} bottom-0 left-0 w-full h-96 bg-gradient-to-t transform translate-y-1/2`;
      default:
        return `${baseStyles} top-0 left-0 w-full h-96 bg-gradient-to-b`;
    }
  };

  // The 'corners' variant needs special handling as it renders multiple elements
  if (variant === 'corners') {
    const cornerBaseStyles = `absolute pointer-events-none w-72 h-72 ${colorGradients[color]} blur-3xl rounded-full`;
    const corners = [
      `${cornerBaseStyles} top-0 left-0 bg-gradient-to-br transform -translate-x-1/2 -translate-y-1/2`,
      `${cornerBaseStyles} top-0 right-0 bg-gradient-to-bl transform translate-x-1/2 -translate-y-1/2`,
      `${cornerBaseStyles} bottom-0 left-0 bg-gradient-to-tr transform -translate-x-1/2 translate-y-1/2`,
      `${cornerBaseStyles} bottom-0 right-0 bg-gradient-to-tl transform translate-x-1/2 translate-y-1/2`,
    ];

    return (
      <div className="absolute inset-0 overflow-hidden -z-10">
        {corners.map((style, i) => (
          <motion.div
            key={i}
            className={style}
            custom={i} // Pass index to stagger and vary animations
            variants={glowAnimation}
            initial="initial"
            animate="animate"
          />
        ))}
      </div>
    );
  }

  // Render a single glow element for all other variants
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className={getBaseGlowStyles(variant)}
        custom={0} // Pass 0 as the index for single elements
        variants={glowAnimation}
        initial="initial"
        animate="animate"
      />
    </div>
  );
};

export default Glow;
