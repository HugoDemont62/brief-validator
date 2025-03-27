import { useState, useEffect } from 'react'
import './App.css'
import BriefAnalyzer from './components/BriefAnalyzer'
import ApiSettings from './components/ApiSettings'

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    // Récupère la clé API depuis localStorage ou utilise celle de l'env si disponible
    const savedKey = localStorage.getItem('openai_api_key');
    return savedKey || import.meta.env.VITE_OPENAI_API_KEY || '';
  });

  // Sauvegarde la clé API dans localStorage à chaque changement
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Brief Validator</h1>
            <p className="text-gray-600 mt-1">
              Analysez votre brief client avec l'aide de l'IA
            </p>
          </div>
          <ApiSettings apiKey={apiKey} onApiKeyChange={setApiKey} />
        </div>
      </header>

      <main>
        <BriefAnalyzer apiKey={apiKey} />
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Brief Validator - Tous droits réservés</p>
      </footer>
    </div>
  )
}

export default App