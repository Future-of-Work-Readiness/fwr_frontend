export const SKILL_LEVELS = [
  "Beginner",
  "Intermediate",
  "Proficient",
  "Master",
  "Expert"
] as const;

export type SkillLevel = typeof SKILL_LEVELS[number];

export const getLevelNumber = (level: string): number => {
  const levelLower = level.toLowerCase();
  const levelIndex = SKILL_LEVELS.findIndex(l => l.toLowerCase() === levelLower);
  return levelIndex >= 0 ? levelIndex + 1 : 1;
};

export const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-primary/10 text-primary border-primary/20";
    case "intermediate":
      return "bg-orange/10 text-orange border-orange/20";
    case "proficient":
      return "bg-cyan/10 text-cyan border-cyan/20";
    case "master":
      return "bg-navy/10 text-navy border-navy/20";
    case "expert":
      return "bg-secondary/10 text-secondary border-secondary/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Soft skills categories
export const SOFT_SKILLS = [
  {
    id: "communication",
    name: "Communication",
    description: "Develop your ability to convey ideas clearly, listen actively, and engage effectively with others",
    color: "blue",
  },
  {
    id: "teamwork",
    name: "Teamwork",
    description: "Learn to collaborate effectively, build trust, and contribute to shared goals",
    color: "green",
  },
  {
    id: "problem_solving",
    name: "Problem Solving",
    description: "Master analytical thinking, creative solutions, and systematic approaches to challenges",
    color: "orange",
  },
  {
    id: "time_management",
    name: "Time Management",
    description: "Enhance your ability to prioritise tasks, manage deadlines, and maximise productivity",
    color: "purple",
  },
  {
    id: "adaptability",
    name: "Adaptability",
    description: "Build resilience and flexibility to thrive in changing environments",
    color: "cyan",
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Develop skills to inspire, guide, and empower teams towards success",
    color: "indigo",
  },
  {
    id: "handling_feedback",
    name: "Handling Feedback",
    description: "Learn to receive, process, and act on constructive feedback effectively",
    color: "yellow",
  },
  {
    id: "dealing_with_conflict",
    name: "Dealing with Conflict",
    description: "Master conflict resolution strategies and maintain positive relationships",
    color: "red",
  },
  {
    id: "professionalism",
    name: "Professionalism",
    description: "Cultivate workplace etiquette, integrity, and a strong professional presence",
    color: "slate",
  },
  {
    id: "ethical_judgment",
    name: "Ethical Judgment",
    description: "Develop sound ethical reasoning and decision-making in complex situations",
    color: "teal",
  },
] as const;

export type SoftSkillId = typeof SOFT_SKILLS[number]["id"];

