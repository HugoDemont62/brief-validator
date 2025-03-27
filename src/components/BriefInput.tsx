import React from 'react';
import ExampleBrief from './ExampleBrief';

interface BriefInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const BriefInput: React.FC<BriefInputProps> = ({ value, onChange, onAnalyze, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Entrez votre brief client</h2>

      <textarea
        className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Collez ou rédigez votre brief client ici..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
      />

      <div className="mt-4 flex justify-between items-center">
        <ExampleBrief onUseExample={onChange} />

        <button
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={onAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyse en cours...
            </span>
          ) : (
            'Générer l\'analyse'
          )}
        </button>
      </div>
    </div>
  );
};

export default BriefInput;