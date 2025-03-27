import React, { useState } from 'react';

interface ExampleBriefProps {
  onUseExample: (example: string) => void;
}

const ExampleBrief: React.FC<ExampleBriefProps> = ({ onUseExample }) => {
  const [isOpen, setIsOpen] = useState(false);

  const example = `Nom du projet: App de réservation de vélos électriques "EcoCycle"

Client: GreenMobility SA

Contexte:
GreenMobility est une entreprise de mobilité durable qui souhaite lancer un service de location de vélos électriques dans 5 grandes villes françaises. Pour répondre à la demande croissante de mobilité verte, l'entreprise souhaite développer une application mobile permettant aux utilisateurs de localiser, réserver et déverrouiller des vélos électriques.

Objectifs:
- Permettre aux utilisateurs de trouver facilement des vélos disponibles près de chez eux
- Simplifier le processus de réservation et de paiement
- Encourager l'utilisation régulière via un programme de fidélité
- Recueillir des données sur l'utilisation pour optimiser la distribution des vélos
- Réduire l'empreinte carbone des déplacements urbains

Public cible:
- Urbains actifs (25-45 ans)
- Étudiants (18-25 ans)
- Professionnels en déplacement
- Touristes

Fonctionnalités requises:
1. Carte interactive montrant les stations et vélos disponibles
2. Système de réservation avec paiement intégré
3. QR code pour déverrouiller le vélo
4. Suivi des trajets (distance, calories, CO2 économisé)
5. Programme de fidélité avec points convertibles
6. Reporting de problèmes techniques
7. Système de notation des vélos et stations

Contraintes techniques:
- Compatibilité iOS et Android
- Développement en React Native
- API REST pour la communication avec le back-end
- Intégration avec des systèmes de paiement (Stripe)
- Déploiement prévu pour mars 2023

Budget: 75 000 € - 90 000 €
Délai: 4 mois`;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 text-sm font-medium flex items-center focus:outline-none"
      >
        <svg
          className={`mr-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {isOpen ? 'Masquer l\'exemple' : 'Voir un exemple de brief'}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-medium text-gray-700">Exemple de brief</h3>
            <button
              onClick={() => onUseExample(example)}
              className="text-xs bg-blue-100 text-blue-700 py-1 px-2 rounded hover:bg-blue-200 transition-colors"
            >
              Utiliser cet exemple
            </button>
          </div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-gray-200 max-h-60 overflow-y-auto">
            {example}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExampleBrief;