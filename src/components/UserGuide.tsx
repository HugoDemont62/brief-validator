import React, { useState } from 'react';

const UserGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 mb-12 border border-blue-100 rounded-lg bg-blue-50 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-blue-700 font-medium focus:outline-none"
      >
        <span className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Guide d'utilisation
        </span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 text-gray-700 text-sm">
          <h3 className="font-medium text-blue-800 mb-2">Comment utiliser Brief Validator ?</h3>

          <ol className="list-decimal ml-5 space-y-3">
            <li>
              <span className="font-medium">Configurer votre clé API :</span> Avant de commencer, cliquez sur "API Settings" dans le coin supérieur droit pour configurer votre clé API OpenAI. Vous pouvez obtenir une clé sur le site d'OpenAI.
            </li>

            <li>
              <span className="font-medium">Entrer votre brief :</span> Collez ou rédigez votre brief client dans la zone de texte. Vous pouvez également utiliser l'exemple fourni en cliquant sur "Voir un exemple de brief".
            </li>

            <li>
              <span className="font-medium">Générer l'analyse :</span> Cliquez sur le bouton "Générer l'analyse" pour lancer le processus d'analyse. L'opération peut prendre jusqu'à 30 secondes selon la complexité du brief.
            </li>

            <li>
              <span className="font-medium">Explorer les résultats :</span> Naviguez entre les différents onglets pour découvrir :
              <ul className="list-disc ml-5 mt-1">
                <li><span className="italic">Analyse</span> - Forces, faiblesses et informations manquantes</li>
                <li><span className="italic">Questions</span> - Questions de clarification à poser au client</li>
                <li><span className="italic">Alternatives</span> - Approches fonctionnelles et techniques alternatives</li>
                <li><span className="italic">Structure projet</span> - Découpage en phases et tâches</li>
                <li><span className="italic">JSON</span> - Données brutes au format JSON</li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Copier les résultats :</span> Dans l'onglet JSON, vous pouvez copier l'intégralité des résultats pour les utiliser dans d'autres applications.
            </li>
          </ol>

          <div className="mt-4 bg-blue-100 p-3 rounded-md">
            <p className="text-blue-800 font-medium">⚠️ Note importante :</p>
            <p>Cette application utilise l'API OpenAI, qui entraîne des coûts selon l'utilisation. Vérifiez la tarification sur le site d'OpenAI.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuide;