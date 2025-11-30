// Hierarchical industry structure
import { 
  Monitor, Briefcase, Heart, HardHat, GraduationCap,
  Code, Database, Shield, Smartphone, Globe, Brain,
  BarChart, TrendingUp, DollarSign, Users, Target, Presentation,
  Stethoscope, Pill, Activity, Microscope, UserCheck,
  Hammer, Building, Truck, HardHat as Construction, Wrench,
  BookOpen, PenTool, GraduationCap as Teaching, Calculator, FlaskConical,
  Zap, CheckCircle
} from 'lucide-react';

export const industryHierarchy = {
  technology: {
    id: 'technology',
    name: 'Technology',
    icon: Monitor,
    bgColor: 'bg-blue-500',
    branches: {
      'web-development': {
        id: 'web-development',
        name: 'Web Development',
        icon: Code,
        bgColor: 'bg-blue-600',
        specializations: [
          { id: 'frontend', name: 'Frontend Development', icon: Globe },
          { id: 'backend', name: 'Backend Development', icon: Database },
          { id: 'fullstack', name: 'Full-Stack Development', icon: Code },
          { id: 'mobile', name: 'Mobile Development', icon: Smartphone }
        ]
      },
      'data': {
        id: 'data',
        name: 'Data & Analytics',
        icon: Database,
        bgColor: 'bg-purple-600',
        specializations: [
          { id: 'data-engineering', name: 'Data Engineering', icon: Database },
          { id: 'data-analytics', name: 'Data Analytics', icon: BarChart },
          { id: 'data-science', name: 'Data Science', icon: Brain },
          { id: 'machine-learning', name: 'Machine Learning/AI', icon: Brain }
        ]
      },
      'cybersecurity': {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        icon: Shield,
        bgColor: 'bg-red-600',
        specializations: [
          { id: 'network-security', name: 'Network Security', icon: Shield },
          { id: 'ethical-hacking', name: 'Ethical Hacking', icon: Shield },
          { id: 'security-analysis', name: 'Security Analysis', icon: Shield },
          { id: 'compliance', name: 'Compliance & Risk', icon: Shield }
        ]
      }
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    bgColor: 'bg-green-500',
    branches: {
      'management': {
        id: 'management',
        name: 'Management',
        icon: Users,
        bgColor: 'bg-green-600',
        specializations: [
          { id: 'project-management', name: 'Project Management', icon: Target },
          { id: 'operations', name: 'Operations Management', icon: TrendingUp },
          { id: 'team-leadership', name: 'Team Leadership', icon: Users },
          { id: 'strategic-planning', name: 'Strategic Planning', icon: Target }
        ]
      },
      'finance': {
        id: 'finance',
        name: 'Finance',
        icon: DollarSign,
        bgColor: 'bg-emerald-600',
        specializations: [
          { id: 'financial-analysis', name: 'Financial Analysis', icon: BarChart },
          { id: 'investment', name: 'Investment Banking', icon: TrendingUp },
          { id: 'accounting', name: 'Accounting', icon: Calculator },
          { id: 'risk-management', name: 'Risk Management', icon: Shield }
        ]
      },
      'marketing': {
        id: 'marketing',
        name: 'Marketing',
        icon: Presentation,
        bgColor: 'bg-pink-600',
        specializations: [
          { id: 'digital-marketing', name: 'Digital Marketing', icon: Globe },
          { id: 'content-marketing', name: 'Content Marketing', icon: PenTool },
          { id: 'brand-management', name: 'Brand Management', icon: Target },
          { id: 'social-media', name: 'Social Media Marketing', icon: Users }
        ]
      }
    }
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    bgColor: 'bg-red-500',
    branches: {
      'clinical': {
        id: 'clinical',
        name: 'Clinical Practice',
        icon: Stethoscope,
        bgColor: 'bg-red-600',
        specializations: [
          { id: 'nursing', name: 'Nursing', icon: UserCheck },
          { id: 'medicine', name: 'General Medicine', icon: Stethoscope },
          { id: 'surgery', name: 'Surgery', icon: Activity },
          { id: 'emergency', name: 'Emergency Medicine', icon: Activity }
        ]
      },
      'research': {
        id: 'research',
        name: 'Medical Research',
        icon: Microscope,
        bgColor: 'bg-rose-600',
        specializations: [
          { id: 'clinical-research', name: 'Clinical Research', icon: FlaskConical },
          { id: 'pharmaceutical', name: 'Pharmaceutical Research', icon: Pill },
          { id: 'biotech', name: 'Biotechnology', icon: Microscope },
          { id: 'public-health', name: 'Public Health', icon: Users }
        ]
      },
      'health-tech': {
        id: 'health-tech',
        name: 'Health Technology',
        icon: Monitor,
        bgColor: 'bg-cyan-600',
        specializations: [
          { id: 'health-informatics', name: 'Health Informatics', icon: Database },
          { id: 'telemedicine', name: 'Telemedicine', icon: Monitor },
          { id: 'medical-devices', name: 'Medical Devices', icon: Activity },
          { id: 'health-ai', name: 'Healthcare AI', icon: Brain }
        ]
      }
    }
  },
  construction: {
    id: 'construction',
    name: 'Construction',
    icon: HardHat,
    bgColor: 'bg-orange-500',
    branches: {
      'engineering': {
        id: 'engineering',
        name: 'Engineering',
        icon: Building,
        bgColor: 'bg-orange-600',
        specializations: [
          { id: 'civil', name: 'Civil Engineering', icon: Building },
          { id: 'structural', name: 'Structural Engineering', icon: Building },
          { id: 'mechanical', name: 'Mechanical Engineering', icon: Wrench },
          { id: 'electrical', name: 'Electrical Engineering', icon: Zap }
        ]
      },
      'management': {
        id: 'construction-management',
        name: 'Construction Management',
        icon: HardHat,
        bgColor: 'bg-amber-600',
        specializations: [
          { id: 'project-management', name: 'Project Management', icon: Target },
          { id: 'site-management', name: 'Site Management', icon: HardHat },
          { id: 'quality-control', name: 'Quality Control', icon: CheckCircle },
          { id: 'safety-management', name: 'Safety Management', icon: Shield }
        ]
      },
      'trades': {
        id: 'trades',
        name: 'Skilled Trades',
        icon: Hammer,
        bgColor: 'bg-yellow-600',
        specializations: [
          { id: 'carpentry', name: 'Carpentry', icon: Hammer },
          { id: 'plumbing', name: 'Plumbing', icon: Wrench },
          { id: 'electrical-work', name: 'Electrical Work', icon: Zap },
          { id: 'masonry', name: 'Masonry', icon: Building }
        ]
      }
    }
  },
  education: {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    bgColor: 'bg-purple-500',
    branches: {
      'teaching': {
        id: 'teaching',
        name: 'Teaching',
        icon: Teaching,
        bgColor: 'bg-purple-600',
        specializations: [
          { id: 'elementary', name: 'Elementary Education', icon: BookOpen },
          { id: 'secondary', name: 'Secondary Education', icon: Teaching },
          { id: 'higher-ed', name: 'Higher Education', icon: GraduationCap },
          { id: 'special-education', name: 'Special Education', icon: Heart }
        ]
      },
      'administration': {
        id: 'education-admin',
        name: 'Educational Administration',
        icon: Users,
        bgColor: 'bg-indigo-600',
        specializations: [
          { id: 'school-admin', name: 'School Administration', icon: Building },
          { id: 'curriculum', name: 'Curriculum Development', icon: BookOpen },
          { id: 'student-services', name: 'Student Services', icon: UserCheck },
          { id: 'educational-policy', name: 'Educational Policy', icon: Target }
        ]
      },
      'edtech': {
        id: 'edtech',
        name: 'Educational Technology',
        icon: Monitor,
        bgColor: 'bg-violet-600',
        specializations: [
          { id: 'instructional-design', name: 'Instructional Design', icon: PenTool },
          { id: 'elearning', name: 'E-Learning Development', icon: Monitor },
          { id: 'educational-software', name: 'Educational Software', icon: Code },
          { id: 'learning-analytics', name: 'Learning Analytics', icon: BarChart }
        ]
      }
    }
  }
};

// Helper function to get industry recommendations based on specialization
export const getSpecializationRecommendations = (
  industryId: string,
  branchId: string,
  specializationId: string
): { title: string; description: string; category: string } => {
  const recommendations: Record<string, { title: string; description: string; category: string }> = {
    'technology-data-data-science': {
      title: 'Python for Data Science Fundamentals',
      description: 'Master Python libraries like pandas, numpy, and scikit-learn for data analysis.',
      category: 'Technical'
    },
    'technology-web-development-frontend': {
      title: 'Modern Frontend Development',
      description: 'Learn React, Vue, or Angular for building interactive web applications.',
      category: 'Technical'
    },
    'technology-cybersecurity-ethical-hacking': {
      title: 'Ethical Hacking Fundamentals',
      description: 'Learn penetration testing and vulnerability assessment techniques.',
      category: 'Technical'
    },
    'business-management-project-management': {
      title: 'Agile Project Management',
      description: 'Master Scrum, Kanban, and modern project management methodologies.',
      category: 'Leadership'
    },
    'healthcare-clinical-nursing': {
      title: 'Digital Health in Nursing',
      description: 'Understand how technology is transforming patient care and nursing practice.',
      category: 'Technical'
    },
    // Add more specific recommendations as needed
  };

  const key = `${industryId}-${branchId}-${specializationId}`;
  return recommendations[key] || {
    title: `Advanced ${specializationId.replace('-', ' ')} Skills`,
    description: `Develop specialized expertise in ${specializationId.replace('-', ' ')} to advance your career.`,
    category: 'Technical'
  };
};

// Helper function to get all specializations for a user's path
export const getUserSpecializationPath = (
  industryId: string,
  branchId: string,
  specializationId: string
): { industry: string; branch: string; specialization: string; fullPath: string } | null => {
  const industry = (industryHierarchy as Record<string, any>)[industryId];
  if (!industry) return null;
  
  const branch = (industry.branches as Record<string, any>)[branchId];
  if (!branch) return null;
  
  const specialization = branch.specializations.find((s: { id: string }) => s.id === specializationId);
  if (!specialization) return null;
  
  return {
    industry: industry.name,
    branch: branch.name,
    specialization: specialization.name,
    fullPath: `${industry.name} > ${branch.name} > ${specialization.name}`
  };
};
