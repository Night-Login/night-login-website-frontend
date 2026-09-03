import type { Member, Skill } from "./TalentData";

// Mock data (replace with actual data from API/database)
export const SKILLS: Skill[] = [
  { id: 1, name: "React", category: "frontend" },
  { id: 2, name: "Next.js", category: "frontend" },
  { id: 3, name: "Node.js", category: "backend" },
  { id: 4, name: "Express", category: "backend" },
  { id: 5, name: "Flutter", category: "mobile" },
  { id: 6, name: "React Native", category: "mobile" },
  { id: 7, name: "TensorFlow", category: "ai-ml" },
  { id: 8, name: "PyTorch", category: "ai-ml" },
  { id: 9, name: "Figma", category: "design" },
  { id: 10, name: "UI/UX Design", category: "design" },
];

export const MEMBERS: Member[] = [
  {
    id: 998,
    name: "Sigma Dev",
    photo: "/assets/images/photos/Giga.jpg",
    role: "AI/ML Specialist",
    batch: "2022",
    educationLevel: "bachelors",
    isCertified: true,
    skills: [
      { id: 7, name: "TensorFlow", category: "ai-ml" },
      { id: 8, name: "PyTorch", category: "ai-ml" },
    ],
    description:
      "Focused on developing cutting-edge machine learning models and AI solutions for real-world problems.",
    email: "sigma.dev@mail.ugm.ac.id",
    github: "https://github.com/sigmadev",
  },
  {
    id: 999,
    name: "Giga Chad",
    photo: "/assets/images/photos/Giga.jpg",
    role: "Full Stack Developer",
    batch: "2023",
    educationLevel: "masters",
    isCertified: false,
    skills: [
      { id: 1, name: "React", category: "frontend" },
      { id: 2, name: "Next.js", category: "frontend" },
      { id: 3, name: "Node.js", category: "backend" },
    ],
    description:
      "A versatile developer with expertise in both frontend and backend technologies. Known for creating efficient, scalable solutions.",
    email: "giga.chad@mail.ugm.ac.id",
    linkedin: "https://linkedin.com/in/gigachad",
    github: "https://github.com/gigachad",
    portfolio: "https://gigachad.dev",
  },
  {
    id: 1000,
    name: "Alpha Dev",
    photo: "/assets/images/photos/Arif.jpg",
    role: "Frontend Developer",
    batch: "2021",
    skills: [
      { id: 1, name: "React", category: "frontend" },
      { id: 2, name: "Next.js", category: "frontend" },
    ],
    description:
      "Passionate about creating beautiful, user-friendly interfaces using modern frontend technologies.",
    email: "arif@mail.ugm.ac.id",
    linkedin: "https://linkedin.com/in/arif",
    github: "github.com/arif",
    portfolio: "https://arif.dev",
  },
  {
    id: 1001,
    name: "Beta Dev",
    photo: "/assets/images/photos/Zakong.jpg",
    role: "Backend Developer",
    batch: "2021",
    skills: [
      { id: 3, name: "Node.js", category: "backend" },
      { id: 4, name: "Express", category: "backend" },
    ],
    description:
      "Experienced in building robust, scalable backend systems using Node.js and Express.",
    email: "zakong@mail.ugm.ac.id",
    linkedin: "https://linkedin.com/in/zakong",
    github: "github.com/zakong",
  },
];
