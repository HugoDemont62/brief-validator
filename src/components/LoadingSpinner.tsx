import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const texts = [
  "Analyse du brief en cours...",
  "Veuillez patienter, analyse en cours...",
  "Nous préparons l'analyse de votre brief...",
  "Analyse détaillée en cours...",
  "Traitement du brief en cours..."
];

const getRandomText = () => {
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                         size = 'medium',
                                                         color = 'currentColor'
                                                       }) => {
  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    setRandomText(getRandomText());
    const interval = setInterval(() => {
      setRandomText(getRandomText());
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeMap[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="mt-2 text-sm text-gray-600">{randomText}</span>
    </div>
  );
};

export default LoadingSpinner;