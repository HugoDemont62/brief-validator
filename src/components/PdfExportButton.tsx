import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { JsonResponse } from '../types';
// @ts-ignore
import Chart from 'chart.js/auto';

interface PdfExportButtonProps {
  result: JsonResponse;
  fileName?: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ result, fileName = 'brief-analysis' }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Fonction utilitaire pour normaliser les scores
  const normalizeScore = (score: number): number => {
    // Si le score est déjà entre 0 et 10, on le garde tel quel
    if (score >= 0 && score <= 10) return score;
    // Si le score est entre 0 et 100, on le divise par 10
    if (score > 10 && score <= 100) return score / 10;
    // Si le score est supérieur à 100, on le divise par 100
    return score / 100;
  };

  const generateScoresChart = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const coherenceScore = normalizeScore(result.analysis.coherence_score);
          const completenessScore = normalizeScore(result.analysis.completeness_score);

          const chart = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['Cohérence', 'Complétude'],
              datasets: [{
                label: 'Scores',
                data: [
                  coherenceScore,
                  completenessScore
                ],
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                borderColor: 'rgba(41, 128, 185, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(41, 128, 185, 1)'
              }]
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: 'Évaluation globale du brief',
                  font: {
                    size: 16
                  }
                },
                legend: {
                  display: false
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 10,
                  ticks: {
                    stepSize: 2
                  }
                }
              }
            }
          });

          setTimeout(() => {
            const imageData = canvas.toDataURL('image/png');
            document.body.removeChild(canvas);
            chart.destroy();
            resolve(imageData);
          }, 100);
        } else {
          reject(new Error('Impossible de créer le contexte 2D'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const generatePhasesChart = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 300;
        document.body.appendChild(canvas); // Ajouter temporairement au DOM
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: result.project_structure.phases.map(phase => phase.name),
              datasets: [{
                label: 'Heures estimées par phase',
                data: result.project_structure.phases.map(phase => 
                  phase.tasks.reduce((acc, task) => acc + task.estimated_hours, 0)
                ),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Heures'
                  }
                }
              }
            }
          });

          // Attendre que le graphique soit rendu
          setTimeout(() => {
            const imageData = canvas.toDataURL('image/png');
            document.body.removeChild(canvas); // Nettoyer
            chart.destroy(); // Nettoyer le graphique
            resolve(imageData);
          }, 100);
        } else {
          reject(new Error('Impossible de créer le contexte 2D'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const exportToPdf = async () => {
    setIsExporting(true);

    try {
      const scoresChartImage = await generateScoresChart();
      const phasesChartImage = await generatePhasesChart();
      
      // Créer un nouveau document PDF avec support des caractères spéciaux
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Utiliser la police par défaut qui supporte mieux les caractères spéciaux
      pdf.setFont("helvetica");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Fonction utilitaire pour nettoyer le texte des caractères spéciaux
      const cleanText = (text: string): string => {
        return text
          .replace(/Ø=ßà/g, '•') // Remplacer les caractères problématiques par des puces
          .replace(/[^\x00-\x7F]/g, (char) => {
            // Remplacer les caractères non-ASCII par leurs équivalents
            const specialChars: { [key: string]: string } = {
              'é': 'e',
              'è': 'e',
              'à': 'a',
              'ù': 'u',
              'â': 'a',
              'ê': 'e',
              'î': 'i',
              'ô': 'o',
              'û': 'u',
              'ë': 'e',
              'ï': 'i',
              'ü': 'u',
              'ç': 'c'
            };
            return specialChars[char] || char;
          });
      };

      // Fonction utilitaire pour gérer le texte long
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        let totalHeight = 0;
        
        // Vérifier si on a besoin d'une nouvelle page
        if (y + (lines.length * (fontSize * 0.5)) > 270) {
          pdf.addPage();
          addPageHeader(pdf.getCurrentPageInfo().pageNumber > 2 ? 'Structure du projet' : 'Analyse détaillée');
          y = 30;
        }

        lines.forEach((line: string, index: number) => {
          pdf.text(line, x, y + (index * (fontSize * 0.5)));
          totalHeight = index * (fontSize * 0.5);
        });
        return totalHeight; // Retourne la hauteur totale utilisée
      };

      // Style de page
      const addPageHeader = (title: string, yPosition = 10) => {
        pdf.setFillColor(41, 128, 185);
        pdf.rect(0, 0, width, 15, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.text(title, width / 2, yPosition, { align: 'center' });
      };

      // Première page - Page de garde
      addPageHeader('Analyse de Brief Client');
      
      pdf.setFontSize(24);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Analyse de Brief Client', width / 2, height / 3, { align: 'center' });

      // Ajouter la date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Généré le ${date}`, width / 2, height / 3 + 10, { align: 'center' });

      // Page des scores et métriques
      pdf.addPage();
      addPageHeader('Scores et Métriques');
      let yPos = 30;

      // Ajouter les statistiques clés
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Statistiques clés:', 20, yPos);
      yPos += 10;

      const stats = [
        `Durée totale estimée: ${result.project_structure.estimated_total_hours}h`,
        `Taille d'équipe recommandée: ${result.project_structure.recommended_team_size} personnes`,
        `Nombre de phases: ${result.project_structure.phases.length}`,
        `Points forts identifiés: ${result.analysis.strengths.length}`,
        `Points d'attention: ${result.analysis.weaknesses.length}`
      ];

      stats.forEach(stat => {
        pdf.setFontSize(12);
        pdf.text(`• ${stat}`, 25, yPos);
        yPos += 8;
      });

      yPos += 10;

      // Scores textuels avec normalisation
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Scores d\'analyse:', 20, yPos);
      yPos += 8;

      const coherenceScore = normalizeScore(result.analysis.coherence_score);
      const completenessScore = normalizeScore(result.analysis.completeness_score);

      pdf.setFontSize(12);
      pdf.text(`Score de coherence: ${coherenceScore.toFixed(1)}/10`, 25, yPos);
      yPos += 7;
      pdf.text(`Score de completude: ${completenessScore.toFixed(1)}/10`, 25, yPos);
      yPos += 15;

      // Graphique des scores radar
      const chartWidth = 120;
      const chartHeight = 60;
      pdf.addImage(scoresChartImage, 'PNG', (width - chartWidth) / 2, yPos, chartWidth, chartHeight);
      yPos += chartHeight + 20;

      // Graphique des phases
      pdf.setFontSize(14);
      pdf.text('Répartition des heures par phase:', 20, yPos);
      yPos += 10;
      
      const phasesChartWidth = 160;
      const phasesChartHeight = 80;
      pdf.addImage(phasesChartImage, 'PNG', (width - phasesChartWidth) / 2, yPos, phasesChartWidth, phasesChartHeight);
      yPos = phasesChartHeight + yPos + 20;

      // Nouvelle page pour l'analyse
      pdf.addPage();
      addPageHeader('Analyse détaillée');
      yPos = 30;

      // Forces
      pdf.setFontSize(16);
      pdf.setTextColor(46, 204, 113);
      pdf.text('Forces:', 20, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.strengths.forEach(strength => {
        if (yPos > 250) {
          pdf.addPage();
          addPageHeader('Analyse détaillée');
          yPos = 30;
        }
        pdf.text(`• ${strength}`, 25, yPos);
        yPos += 7;
      });

      yPos += 10;

      // Faiblesses
      pdf.setFontSize(16);
      pdf.setTextColor(231, 76, 60);
      pdf.text('Faiblesses:', 20, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.weaknesses.forEach(weakness => {
        if (yPos > 250) {
          pdf.addPage();
          addPageHeader('Analyse détaillée');
          yPos = 30;
        }
        pdf.text(`• ${weakness}`, 25, yPos);
        yPos += 7;
      });

      yPos += 10;

      // Informations manquantes
      pdf.setFontSize(16);
      pdf.setTextColor(243, 156, 18);
      pdf.text('Informations manquantes:', 20, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.missing_information.forEach(info => {
        if (yPos > 250) {
          pdf.addPage();
          addPageHeader('Analyse détaillée');
          yPos = 30;
        }
        pdf.text(`• ${info}`, 25, yPos);
        yPos += 7;
      });

      // Questions de clarification
      pdf.addPage();
      addPageHeader('Questions de clarification');
      yPos = 30;

      result.clarification_questions.forEach((question, index) => {
        if (yPos > 250) {
          pdf.addPage();
          addPageHeader('Questions de clarification');
          yPos = 30;
        }

        // Priorité (avec couleur)
        let priorityColor: [number, number, number];
        switch (question.importance) {
          case 'high':
            priorityColor = [231, 76, 60];
            break;
          case 'medium':
            priorityColor = [243, 156, 18];
            break;
          default:
            priorityColor = [46, 204, 113];
        }

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${question.question}`, 20, yPos);
        yPos += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(...priorityColor);
        pdf.text(`Importance: ${question.importance} | Catégorie: ${question.category}`, 25, yPos);
        yPos += 7;

        pdf.setTextColor(100, 100, 100);
        const maxWidth = width - 50;
        const splitText = pdf.splitTextToSize(question.reason, maxWidth);

        splitText.forEach((line: string) => {
          if (yPos > 250) {
            pdf.addPage();
            addPageHeader('Questions de clarification');
            yPos = 30;
          }
          pdf.text(line, 25, yPos);
          yPos += 5;
        });

        yPos += 10;
      });

      // Structure du projet
      const totalPhases = result.project_structure.phases.length;

      const renderPhase = (phase: any, phaseIndex: number) => {
        if (yPos > 250) {
          pdf.addPage();
          addPageHeader('Structure du projet');
          yPos = 30;
        }

        // Titre de la phase
        pdf.setFontSize(14);
        pdf.setTextColor(41, 128, 185);
        const phaseTitle = `Phase ${phaseIndex + 1}: ${phase.name}`;
        const phaseTitleHeight = addWrappedText(phaseTitle, 20, yPos, width - 40, 14);
        yPos += 10 + phaseTitleHeight;

        // Objectifs
        pdf.setFontSize(12);
        pdf.setTextColor(44, 62, 80);
        pdf.text('Objectifs:', 25, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        for (const obj of phase.objectives) {
          if (yPos > 250) {
            pdf.addPage();
            addPageHeader('Structure du projet');
            yPos = 30;
          }
          const objHeight = addWrappedText(`• ${obj}`, 30, yPos, width - 60, 11);
          yPos += 6 + objHeight;
        }

        yPos += 5;

        // Livrables
        if (yPos > 240) {
          pdf.addPage();
          addPageHeader('Structure du projet');
          yPos = 30;
        }
        pdf.setFontSize(12);
        pdf.text('Livrables:', 25, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        for (const deliv of phase.deliverables) {
          if (yPos > 250) {
            pdf.addPage();
            addPageHeader('Structure du projet');
            yPos = 30;
          }
          const delivHeight = addWrappedText(`• ${deliv}`, 30, yPos, width - 60, 11);
          yPos += 6 + delivHeight;
        }

        yPos += 5;

        // Tâches
        if (yPos > 240) {
          pdf.addPage();
          addPageHeader('Structure du projet');
          yPos = 30;
        }
        pdf.setFontSize(12);
        pdf.text('Tâches principales:', 25, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        for (const task of phase.tasks) {
          if (yPos > 250) {
            pdf.addPage();
            addPageHeader('Structure du projet');
            yPos = 30;
          }

          let prioritySymbol = "•";
          if (task.priority === 'high') prioritySymbol = "!";
          else if (task.priority === 'medium') prioritySymbol = "+";
          else prioritySymbol = "-";

          const taskText = `${prioritySymbol} ${task.name} (${task.estimated_hours}h)`;
          const taskHeight = addWrappedText(taskText, 30, yPos, width - 60, 11);
          yPos += 6 + taskHeight;
        }

        yPos += 15;

        // Si ce n'est pas la dernière phase, vérifier si on a besoin d'une nouvelle page
        if (phaseIndex < totalPhases - 1 && yPos > 240) {
          pdf.addPage();
          addPageHeader('Structure du projet');
          yPos = 30;
        }
      };

      // Rendre toutes les phases
      result.project_structure.phases.forEach((phase, index) => {
        renderPhase(phase, index);
      });

      // Vérifier si on est à la fin d'une page avant de sauvegarder
      if (yPos > 250) {
        pdf.addPage();
        addPageHeader('Structure du projet');
      }

      // Sauvegarder le PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la création du PDF:', error);
      alert('Une erreur est survenue lors de la création du PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPdf}
      disabled={isExporting}
      className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
        isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exportation en cours...
        </>
      ) : (
        <>
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger en PDF
        </>
      )}
    </button>
  );
};

export default PdfExportButton;