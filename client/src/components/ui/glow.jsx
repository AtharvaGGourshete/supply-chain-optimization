import React from 'react';

const Glow = ({ variant = 'top', intensity = 'high', color = 'golden1' }) => {

  const getGlowStyles = () => {
    const baseStyles = "absolute pointer-events-none";
    
    const intensityClasses = {
      low: 'opacity-30',
      medium: 'opacity-50',
      high: 'opacity-70'
    };
    
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

    
    switch (variant) {
      case 'top':
        return `${baseStyles} top-0 left-0 w-full h-full bg-gradient-to-b ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl transform -translate-y-1/2 rounded-b-[100%]`;

      
      case 'center':
        return `${baseStyles} top-1/2 left-1/2 w-96 h-96 bg-gradient-radial ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl transform -translate-x-1/2 -translate-y-1/2 rounded-full`;
      
      case 'bottom':
        return `${baseStyles} bottom-0 left-0 w-full h-96 bg-gradient-to-t ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl transform translate-y-1/2`;
      
      case 'corners':
        return (
          <>
            <div className={`${baseStyles} top-0 left-0 w-72 h-72 bg-gradient-to-br ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2`} />
            <div className={`${baseStyles} top-0 right-0 w-72 h-72 bg-gradient-to-bl ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2`} />
            <div className={`${baseStyles} bottom-0 left-0 w-72 h-72 bg-gradient-to-tr ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2`} />
            <div className={`${baseStyles} bottom-0 right-0 w-72 h-72 bg-gradient-to-tl ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl rounded-full transform translate-x-1/2 translate-y-1/2`} />
          </>
        );

      
      default:
        return `${baseStyles} top-0 left-0 w-full h-96 bg-gradient-to-b ${colorGradients[color]} ${intensityClasses[intensity]} blur-3xl`;
    }
  };

  const styles = getGlowStyles();

  // For variants that return JSX elements directly
  if (variant === 'corners' || variant === 'orbs') {
    return <div className="absolute inset-0 overflow-hidden">{styles}</div>;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={styles} />
      {/* Add animated floating particles for extra effect */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-purple-400/25 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/20 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '3.5s' }} />
      </div> */}
    </div>
  );
};

export default Glow;