import React, { useState } from 'react';
import { JsonResponse } from '../types';

interface AnalysisResultsProps {
  result: JsonResponse;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<string>('analysis');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const tabs = [
    { id: 'analysis', label: 'Analyse' },
    { id: 'questions', label: 'Questions' },
    { id: 'alternatives', label: 'Alternatives' },
    { id: 'structure', label: 'Structure projet' },
    { id: 'json', label: 'JSON complet' },
  ];

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Forces</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Faiblesses</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Informations manquantes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.analysis.missing_information.map((info, index) => (
                  <li key={index} className="text-gray-700">{info}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-700">Score de cohérence</h4>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {(result.analysis.coherence_score * 10).toFixed(1)}/10
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-700">Score de complétude</h4>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {(result.analysis.completeness_score * 10).toFixed(1)}/10
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Questions de clarification</h3>

            <div className="space-y-4">
              {result.clarification_questions.map((question, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium">{question.question}</h4>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      question.importance === 'high' ? 'bg-red-100 text-red-800' :
                        question.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                    }`}>
                      {question.importance}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {question.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{question.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alternatives' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Approches fonctionnelles</h3>

              <div className="space-y-6">
                {result.alternative_views.functional_approaches.map((approach, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">{approach.title}</h4>
                    <p className="text-gray-700 mb-3">{approach.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Avantages</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {approach.benefits.map((benefit, bIndex) => (
                            <li key={bIndex} className="text-gray-700">{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Considérations</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {approach.considerations.map((consideration, cIndex) => (
                            <li key={cIndex} className="text-gray-700">{consideration}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Approches techniques</h3>

              <div className="space-y-6">
                {result.alternative_views.technical_approaches.map((approach, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">{approach.title}</h4>
                    <p className="text-gray-700 mb-3">{approach.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Avantages</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {approach.benefits.map((benefit, bIndex) => (
                            <li key={bIndex} className="text-gray-700">{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Considérations</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {approach.considerations.map((consideration, cIndex) => (
                            <li key={cIndex} className="text-gray-700">{consideration}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Structure du projet</h3>

              <div className="flex space-x-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Heures estimées:</span>
                  <span className="ml-1 font-semibold">{result.project_structure.estimated_total_hours}h</span>
                </div>

                <div className="text-sm">
                  <span className="font-medium text-gray-600">Taille d'équipe recommandée:</span>
                  <span className="ml-1 font-semibold">{result.project_structure.recommended_team_size} personnes</span>
                </div>
              </div>
            </div>

            <div className="space-y-8 mt-4">
              {result.project_structure.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h4 className="font-medium">Phase {phaseIndex + 1}: {phase.name}</h4>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Objectifs</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {phase.objectives.map((objective, oIndex) => (
                            <li key={oIndex} className="text-gray-700">{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Livrables</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {phase.deliverables.map((deliverable, dIndex) => (
                            <li key={dIndex} className="text-gray-700">{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <h5 className="font-medium text-sm mb-2">Tâches</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dépendances</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {phase.tasks.map((task, tIndex) => (
                          <tr key={tIndex}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{task.estimated_hours}h</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority}
                                </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {task.dependencies.join(', ')}
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">JSON Complet</h3>
              <button
                onClick={copyJsonToClipboard}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {isCopied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <div className="bg-gray-800 rounded-md p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;