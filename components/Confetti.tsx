import React from 'react';

const Confetti: React.FC = () => {
  const confettiPieces = Array.from({ length: 150 }).map((_, index) => {
    const style = {
      left: `${Math.random() * 100}vw`,
      width: `${Math.random() * 8 + 8}px`,
      height: `${Math.random() * 5 + 5}px`,
      backgroundColor: [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
        '#009688', '#4caf50', '#8bc34a', '#cddc39', 
        '#ffeb3b', '#ffc107', '#ff9800'
      ][Math.floor(Math.random() * 15)],
      animationDuration: `${Math.random() * 3 + 5}s`, // 5-8 seconds
      animationDelay: `${Math.random() * 4}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    };
    return <div key={index} className="fixed top-0 animate-fall" style={style}></div>;
  });

  return (
    <div aria-hidden="true" className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {confettiPieces}
    </div>
  );
};

export default Confetti;
