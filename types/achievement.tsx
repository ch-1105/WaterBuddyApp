export interface Achievement {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    icon: string;
    requiredValue: number;
    type: 'daily' | 'streak' | 'total';
  }
  
  export interface UserProgress {
    level: number;
    experience: number;
    totalConsumed: number;
    streak: number;
    achievements: Achievement[];
  }