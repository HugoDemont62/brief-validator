import { useState } from 'react';
import { JsonResponse } from '../types';
import BriefInput from './BriefInput';
import AnalysisResults from './AnalysisResults';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import UserGuide from './UserGuide';

interface BriefAnalyzerProps {
  apiKey: string;
}

const BriefAnalyzer: React.FC<BriefAnalyzerProps> = ({ apiKey }) => {
  const [brief, setBrief] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<JsonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBriefChange = (value: string) => {
    setBrief(value);
  };

  const analyzebrief = async () => {
    if (!brief.trim()) {
      setError('Veuillez entrer un brief à analyser');
      return;
    }

    if (!apiKey) {
      setError('Veuillez configurer votre clé API OpenAI dans les paramètres');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Tu es un expert en gestion de projets digitaux. Ton rôle est d'analyser des briefs clients et de produire un JSON structuré contenant une analyse, des questions de clarification, des alternatives créatives, et une structure projet. Sois rigoureux, pertinent, et professionnel."
            },
            {
              role: "user",
              content: `Voici le brief client à analyser :\n\n${brief}\n\nVoici la structure de réponse attendue en français :\n\n${JSON.stringify(emptyResponseTemplate, null, 2)}`
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Clé API invalide ou expirée. Veuillez vérifier vos paramètres API.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      try {
        // Tenter d'extraire le JSON de la réponse
        const contentString = data.choices[0].message.content;
        const jsonResponse = JSON.parse(contentString);
        setAnalysisResult(jsonResponse);
      } catch (parseError) {
        console.error("Erreur lors du parsing de la réponse:", parseError);
        setError("Le format de la réponse n'est pas valide. Veuillez réessayer.");
      }
    } catch (apiError) {
      console.error("Erreur lors de l'appel API:", apiError);
      setError(`Erreur lors de l'analyse: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <UserGuide />

      <BriefInput
        value={brief}
        onChange={handleBriefChange}
        onAnalyze={analyzebrief}
        isLoading={isLoading}
      />

      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {isLoading && (
        <div className="my-8 py-12 flex justify-center">
          <LoadingSpinner size="large" text="Analyse du brief en cours..." />
        </div>
      )}

      {analysisResult && (
        <AnalysisResults result={analysisResult} />
      )}
    </div>
  );
};

// Template de réponse vide qui correspond à la structure attendue
const emptyResponseTemplate = {
  "analysis": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "missing_information": ["..."],
    "coherence_score": 0.0,
    "completeness_score": 0.0
  },
  "clarification_questions": [
    {
      "question": "...",
      "category": "...",
      "importance": "...",
      "reason": "..."
    }
  ],
  "alternative_views": {
    "functional_approaches": [
      {
        "title": "...",
        "description": "...",
        "benefits": ["..."],
        "considerations": ["..."]
      }
    ],
    "technical_approaches": [
      {
        "title": "...",
        "description": "...",
        "benefits": ["..."],
        "considerations": ["..."]
      }
    ]
  },
  "project_structure": {
    "phases": [
      {
        "name": "...",
        "objectives": ["..."],
        "deliverables": ["..."],
        "tasks": [
          {
            "estimated_hours": 0,
            "priority": "...",
            "dependencies": ["..."]
          }
        ]
      }
    ],
    "estimated_total_hours": 0,
    "recommended_team_size": 0
  }
};

export default BriefAnalyzer;