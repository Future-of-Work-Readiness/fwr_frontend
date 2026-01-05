// Sector definitions with specializations
export const TECHNOLOGY_TRACKS = [
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "IOS_DEVELOPER",
  "ANDROID_DEVELOPER",
  "MOBILE_DEVELOPMENT_CROSS_PLATFORM",
  "DATA_SCIENTIST",
  "DATA_ANALYST",
  "DATA_ENGINEER",
  "AI_ML_ENGINEER",
  "CYBERSECURITY_ANALYST",
  "QA_AUTOMATION_ENGINEER_SET",
  "DEVOPS_ENGINEER",
  "CLOUD_ENGINEER",
  "DATABASE_ADMINISTRATOR_DBA",
  "NETWORK_ENGINEER",
  "SYSTEMS_ADMINISTRATOR",
  "UX_UI_DESIGNER",
  "TECHNICAL_PRODUCT_MANAGER",
  "TECHNICAL_PROJECT_MANAGER_SCRUM_MASTER",
] as const;

// Technology sector fields with their specializations
export const TECHNOLOGY_FIELDS = {
  web_software_development: {
    label: "Web & Software Development",
    description: "Build applications, websites, and mobile experiences using modern development frameworks.",
    specializations: [
      "FRONTEND_DEVELOPER",
      "BACKEND_DEVELOPER",
      "IOS_DEVELOPER",
      "ANDROID_DEVELOPER",
      "MOBILE_DEVELOPMENT_CROSS_PLATFORM",
    ],
  },
  data_ai: {
    label: "Data & AI",
    description: "Analyse data, build machine learning models, and create intelligent systems.",
    specializations: [
      "DATA_ANALYST",
      "DATA_SCIENTIST",
      "DATA_ENGINEER",
      "AI_ML_ENGINEER",
    ],
  },
  cybersecurity_infrastructure: {
    label: "Cybersecurity & Infrastructure",
    description: "Protect systems from threats and maintain the backbone of technology infrastructure.",
    specializations: [
      "CYBERSECURITY_ANALYST",
      "NETWORK_ENGINEER",
      "SYSTEMS_ADMINISTRATOR",
      "CLOUD_ENGINEER",
      "DEVOPS_ENGINEER",
      "DATABASE_ADMINISTRATOR_DBA",
    ],
  },
  design_product: {
    label: "Design & Product",
    description: "Shape user experiences and guide product development from concept to delivery.",
    specializations: [
      "UX_UI_DESIGNER",
      "TECHNICAL_PRODUCT_MANAGER",
      "TECHNICAL_PROJECT_MANAGER_SCRUM_MASTER",
    ],
  },
  quality_testing: {
    label: "Quality & Testing",
    description: "Ensure software quality through automated testing and quality assurance practices.",
    specializations: [
      "QA_AUTOMATION_ENGINEER_SET",
    ],
  },
} as const;

export type TechnologyFieldType = keyof typeof TECHNOLOGY_FIELDS;

export const SECTORS = {
  technology: {
    label: "Technology",
    description: "Comprehensive technology sector covering software development, data science, cybersecurity, infrastructure, and digital innovation.",
    icon: "Laptop",
  },
  finance: {
    label: "Finance",
    description: "Financial services including banking, accounting, investment, and financial planning.",
    icon: "PoundSterling",
  },
  health_social_care: {
    label: "Health & Social Care",
    description: "Healthcare and social care services covering medical services, patient care, and community support.",
    icon: "Heart",
  },
  education: {
    label: "Education",
    description: "Educational services including teaching, administration, and educational technology.",
    icon: "GraduationCap",
  },
  construction: {
    label: "Construction",
    description: "Construction sector covering engineering, project management, and skilled trades.",
    icon: "HardHat",
  },
} as const;

export type SectorType = keyof typeof SECTORS;

// Sector tracks mapping
export const SECTOR_TRACKS: Record<string, readonly string[]> = {
  technology: TECHNOLOGY_TRACKS,
  finance: [
    "investment_banker",
    "financial_analyst",
    "accountant",
    "risk_manager",
    "portfolio_manager",
    "tax_consultant",
    "auditor",
    "compliance_officer",
    "trader",
    "fund_manager",
    "financial_planner",
    "credit_analyst",
    "insurance_underwriter",
    "budget_analyst",
    "wealth_manager",
  ],
  health_social_care: [
    "nurse",
    "midwife",
    "care_worker",
    "social_worker",
    "occupational_therapist",
    "physiotherapist",
    "healthcare_assistant",
    "mental_health_counselor",
    "public_health_officer",
  ],
  education: [
    "teacher",
    "special_need_educator",
  ],
  construction: [
    "civil_engineer",
    "site_manager",
    "quantity_surveyor",
    "architect",
    "construction_worker",
    "project_manager",
    "structural_engineer",
  ],
} as const;

export const SECTOR_LABELS: Record<string, string> = {
  technology: "Technology",
  finance: "Finance",
  health_social_care: "Health & Social Care",
  healthcare: "Healthcare",
  education: "Education",
  construction: "Construction",
};

export const formatSpecialisation = (spec: string): string => {
  return spec
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Specialisation descriptions for display
export const SPECIALISATION_DESCRIPTIONS: Record<string, string> = {
  FRONTEND_DEVELOPER: "Build user interfaces and experiences for web applications using modern frameworks.",
  BACKEND_DEVELOPER: "Develop server-side logic, APIs, and database systems that power applications.",
  IOS_DEVELOPER: "Create native iOS applications for iPhone and iPad devices using Swift and Objective-C.",
  ANDROID_DEVELOPER: "Build native Android applications using Java or Kotlin for mobile devices.",
  MOBILE_DEVELOPMENT_CROSS_PLATFORM: "Develop mobile apps that work across multiple platforms using frameworks like React Native or Flutter.",
  DATA_SCIENTIST: "Analyse and interpret complex data to help organisations make data-driven decisions.",
  DATA_ANALYST: "Examine datasets to identify trends, patterns, and insights for business intelligence.",
  DATA_ENGINEER: "Build and maintain the infrastructure for data generation, storage, and processing.",
  AI_ML_ENGINEER: "Develop artificial intelligence and machine learning models and systems.",
  CYBERSECURITY_ANALYST: "Monitor and protect systems, networks, and data from security threats.",
  QA_AUTOMATION_ENGINEER_SET: "Create automated testing systems and write code to test software quality.",
  DEVOPS_ENGINEER: "Bridge development and operations to streamline software delivery and deployment.",
  CLOUD_ENGINEER: "Design, implement, and manage cloud computing infrastructure and services.",
  DATABASE_ADMINISTRATOR_DBA: "Manage and maintain database systems, ensuring performance and security.",
  NETWORK_ENGINEER: "Design, implement, and maintain computer networks and communication systems.",
  SYSTEMS_ADMINISTRATOR: "Maintain and configure computer systems, servers, and IT infrastructure.",
  UX_UI_DESIGNER: "Design user experiences and interfaces that are intuitive, accessible, and enjoyable.",
  TECHNICAL_PRODUCT_MANAGER: "Guide product development from a technical perspective, balancing business and technical needs.",
  TECHNICAL_PROJECT_MANAGER_SCRUM_MASTER: "Manage technical projects, coordinate team efforts, and facilitate agile methodologies.",
  // Finance
  investment_banker: "Advise on mergers, acquisitions, and capital raising for corporations and institutions.",
  financial_analyst: "Analyse financial data, create models, and provide investment recommendations.",
  accountant: "Prepare and examine financial records, ensuring accuracy and compliance.",
  risk_manager: "Identify, assess, and mitigate financial and operational risks.",
  portfolio_manager: "Manage investment portfolios to maximise returns for clients.",
  tax_consultant: "Provide tax planning and compliance advice to individuals and businesses.",
  auditor: "Examine financial statements and records to ensure accuracy and compliance.",
  compliance_officer: "Ensure organisations comply with laws, regulations, and internal policies.",
  trader: "Buy and sell financial instruments to generate profits for clients or firms.",
  fund_manager: "Manage investment funds, making decisions on asset allocation and strategy.",
  financial_planner: "Help individuals and families plan for their financial future.",
  credit_analyst: "Assess the creditworthiness of individuals and organisations.",
  insurance_underwriter: "Evaluate and assess insurance applications and risks.",
  budget_analyst: "Develop, analyse, and manage budgets for organisations.",
  wealth_manager: "Provide comprehensive financial advice and services to high-net-worth clients.",
  // Health & Social Care
  nurse: "Provide direct patient care, monitor health, and coordinate with healthcare teams.",
  midwife: "Provide care and support to women during pregnancy, childbirth, and postnatal periods.",
  care_worker: "Support individuals with daily living activities and personal care needs.",
  social_worker: "Help individuals and families navigate challenges and access support services.",
  occupational_therapist: "Help people develop, recover, and maintain daily living and work skills.",
  physiotherapist: "Assess, diagnose, and treat physical conditions using movement and exercise.",
  healthcare_assistant: "Support healthcare professionals in providing patient care.",
  mental_health_counselor: "Provide counselling and support for individuals with mental health challenges.",
  public_health_officer: "Promote and protect community health through education and policy.",
  // Education
  teacher: "Educate and inspire students, creating engaging learning experiences.",
  special_need_educator: "Provide specialised education and support to students with diverse learning needs.",
  // Construction
  civil_engineer: "Design, plan, and oversee construction of infrastructure projects.",
  site_manager: "Coordinate and manage construction site operations and teams.",
  quantity_surveyor: "Manage costs and contracts for construction projects.",
  architect: "Design buildings and structures, balancing aesthetics, function, and safety.",
  construction_worker: "Perform hands-on construction tasks on building sites.",
  project_manager: "Plan, coordinate, and manage construction projects from start to finish.",
  structural_engineer: "Design and analyse structures to ensure safety and stability.",
};

