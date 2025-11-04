export interface Topic {
  id: number;
  title: string;
  description: string;
  fileKey: string; // used for identifying which question set to load
}

export const topics: Topic[] = [
  {
    id: 1,
    title: "Software",
    description: "Covers general software principles, programs, and development concepts.",
    fileKey: "software",
  },
  {
    id: 2,
    title: "Hardware",
    description: "Covers computer components, devices, and physical computing fundamentals.",
    fileKey: "hardware",
  },
  {
    id: 3,
    title: "Networking",
    description: "Networking basics, protocols, and communication models.",
    fileKey: "networking",
  },
  {
    id: 4,
    title: "Programming",
    description: "Covers syntax, logic, algorithms, and programming concepts.",
    fileKey: "programming",
  },
  {
    id: 5,
    title: "Database",
    description: "Focuses on SQL, relational design, and database management systems.",
    fileKey: "database",
  },
  {
    id: 6,
    title: "AI & Machine Learning",
    description: "Artificial intelligence, data models, and learning algorithms.",
    fileKey: "ai",
  },
  {
    id: 7,
    title: "Cybersecurity",
    description: "Security, encryption, and safe computing practices.",
    fileKey: "cybersecurity",
  },
  {
    id: 8,
    title: "Cloud Computing",
    description: "Virtualization, cloud services, and distributed infrastructure.",
    fileKey: "cloud",
  },
  {
    id: 9,
    title: "Internet of Things (IoT)",
    description: "Smart devices, sensors, and connected environments.",
    fileKey: "iot",
  },
  {
    id: 10,
    title: "Data Science",
    description: "Data analysis, visualization, and machine learning fundamentals.",
    fileKey: "dataScience",
  },
  {
    id: 11,
    title: "Operating Systems",
    description: "OS concepts, scheduling, memory management, and system calls.",
    fileKey: "osConcepts",
  },
  {
    id: 12,
    title: "Web Development",
    description: "Frontend and backend web technologies and frameworks.",
    fileKey: "webDev",
  },
  {
    id: 13,
    title: "Mobile Development",
    description: "Building Android and iOS apps and understanding mobile architecture.",
    fileKey: "mobileDev",
  },
  {
    id: 14,
    title: "Digital Logic",
    description: "Logic gates, combinational circuits, and digital electronics.",
    fileKey: "digitalLogic",
  },
  {
    id: 15,
    title: "UI/UX Design",
    description: "Interface design principles, usability, and user experience.",
    fileKey: "uiux",
  },
  {
    id: 16,
    title: "E-Commerce",
    description: "Online business systems, digital payments, and marketplaces.",
    fileKey: "ecommerce",
  },
  {
    id: 17,
    title: "System Analysis",
    description: "Requirement gathering, modeling, and system evaluation.",
    fileKey: "systemAnalysis",
  },
  {
    id: 18,
    title: "IT Project Management",
    description: "Project life cycle, agile methodology, and delivery control.",
    fileKey: "projectManagement",
  },
  {
    id: 19,
    title: "IT Ethics",
    description: "Legal, ethical, and social issues in technology.",
    fileKey: "itEthics",
  },
  {
    id: 20,
    title: "IT History",
    description: "Evolution and milestones of computing and technology.",
    fileKey: "itHistory",
  },
];
