export interface JsonResponse {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    missing_information: string[];
    coherence_score: number;
    completeness_score: number;
  };
  clarification_questions: Array<{
    question: string;
    category: string;
    importance: string;
    reason: string;
  }>;
  alternative_views: {
    functional_approaches: Array<{
      title: string;
      description: string;
      benefits: string[];
      considerations: string[];
    }>;
    technical_approaches: Array<{
      title: string;
      description: string;
      benefits: string[];
      considerations: string[];
    }>;
  };
  project_structure: {
    phases: Array<{
      name: string;
      objectives: string[];
      deliverables: string[];
      tasks: Array<{
        name: string;
        estimated_hours: number;
        priority: string;
        dependencies: string[];
      }>;
    }>;
    estimated_total_hours: number;
    recommended_team_size: number;
  };
}