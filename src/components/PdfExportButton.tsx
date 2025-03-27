import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { JsonResponse } from '../types';

interface PdfExportButtonProps {
  result: JsonResponse;
  fileName?: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ result, fileName = 'brief-analysis' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    setIsExporting(true);

    try {
      // Créer un nouveau document PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();

      // Ajouter le titre
      pdf.setFontSize(20);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Analyse de Brief Client', width / 2, 20, { align: 'center' });

      // Ajouter la date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Généré le ${date}`, width / 2, 27, { align: 'center' });

      let yPos = 35;

      // Section Analyse
      pdf.setFontSize(16);
      pdf.setTextColor(41, 128, 185);
      pdf.text('Analyse du brief', 10, yPos);
      yPos += 10;

      // Scores
      pdf.setFontSize(12);
      pdf.setTextColor(44, 62, 80);
      pdf.text(`Score de cohérence: ${(result.analysis.coherence_score * 10).toFixed(1)}/10`, 15, yPos);
      yPos += 7;
      pdf.text(`Score de complétude: ${(result.analysis.completeness_score * 10).toFixed(1)}/10`, 15, yPos);
      yPos += 10;

      // Forces
      pdf.setFontSize(14);
      pdf.setTextColor(46, 204, 113);
      pdf.text('Forces:', 10, yPos);
      yPos += 7;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.strengths.forEach(strength => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${strength}`, 15, yPos);
        yPos += 7;
      });

      yPos += 3;

      // Faiblesses
      pdf.setFontSize(14);
      pdf.setTextColor(231, 76, 60);
      pdf.text('Faiblesses:', 10, yPos);
      yPos += 7;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.weaknesses.forEach(weakness => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${weakness}`, 15, yPos);
        yPos += 7;
      });

      yPos += 3;

      // Informations manquantes
      pdf.setFontSize(14);
      pdf.setTextColor(243, 156, 18);
      pdf.text('Informations manquantes:', 10, yPos);
      yPos += 7;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);

      result.analysis.missing_information.forEach(info => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${info}`, 15, yPos);
        yPos += 7;
      });

      // Nouvelle page pour les questions
      pdf.addPage();
      yPos = 20;

      // Section Questions
      pdf.setFontSize(16);
      pdf.setTextColor(41, 128, 185);
      pdf.text('Questions de clarification', 10, yPos);
      yPos += 10;

      pdf.setFontSize(11);

      result.clarification_questions.forEach((question, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }

        // Priorité (avec couleur)
        let priorityColor: [number, number, number];
        switch (question.importance) {
          case 'high':
            priorityColor = [231, 76, 60]; // rouge
            break;
          case 'medium':
            priorityColor = [243, 156, 18]; // orange
            break;
          default:
            priorityColor = [46, 204, 113]; // vert
        }

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${question.question}`, 15, yPos);
        yPos += 5;

        pdf.setFontSize(10);
        pdf.setTextColor(...priorityColor);
        pdf.text(`Importance: ${question.importance} | Catégorie: ${question.category}`, 20, yPos);
        yPos += 5;

        pdf.setTextColor(100, 100, 100);

        // Gérer le texte long avec des sauts de ligne automatiques
        const maxWidth = width - 40; // marges des deux côtés
        const splitText = pdf.splitTextToSize(question.reason, maxWidth);

        splitText.forEach((line: string) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 5;
        });

        yPos += 5;
      });

      // Ajouter une page pour la structure du projet
      pdf.addPage();
      yPos = 20;

      // Section Structure du projet
      pdf.setFontSize(16);
      pdf.setTextColor(41, 128, 185);
      pdf.text('Structure du projet', 10, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(44, 62, 80);
      pdf.text(`Heures estimées: ${result.project_structure.estimated_total_hours}h`, 15, yPos);
      yPos += 7;
      pdf.text(`Équipe recommandée: ${result.project_structure.recommended_team_size} personnes`, 15, yPos);
      yPos += 10;

      // Phases du projet
      result.project_structure.phases.forEach((phase, phaseIndex) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(41, 128, 185);
        pdf.text(`Phase ${phaseIndex + 1}: ${phase.name}`, 10, yPos);
        yPos += 7;

        // Objectifs
        pdf.setFontSize(12);
        pdf.setTextColor(44, 62, 80);
        pdf.text('Objectifs:', 15, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        phase.objectives.forEach(obj => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(`• ${obj}`, 20, yPos);
          yPos += 6;
        });

        yPos += 3;

        // Livrables
        pdf.setFontSize(12);
        pdf.setTextColor(44, 62, 80);
        pdf.text('Livrables:', 15, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        phase.deliverables.forEach(deliv => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(`• ${deliv}`, 20, yPos);
          yPos += 6;
        });

        yPos += 3;

        // Tâches principales (simplifiées pour le PDF)
        pdf.setFontSize(12);
        pdf.setTextColor(44, 62, 80);
        pdf.text('Tâches principales:', 15, yPos);
        yPos += 7;

        pdf.setFontSize(11);
        phase.tasks.forEach(task => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }

          let prioritySymbol = "⚪";
          if (task.priority === 'high') prioritySymbol = "🔴";
          else if (task.priority === 'medium') prioritySymbol = "🟠";
          else prioritySymbol = "🟢";

          pdf.text(`${prioritySymbol} ${task.name} (${task.estimated_hours}h)`, 20, yPos);
          yPos += 6;
        });

        yPos += 10;
      });

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