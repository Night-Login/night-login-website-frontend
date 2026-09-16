import type { AdminDatabase } from "../types";

export const initialAdminData: AdminDatabase = {
  users: [
    {
      id: "usr_01",
      name: "Admin User",
      email: "admin@example.com",
      password_hash: "$2b$10$somehashedpasswordstring",
      role: "admin",
      createdAt: "2023-10-01T12:00:00Z",
    },
  ],
  talents: [
    {
      id: 999,
      name: "Giga Chad",
      photo: "/assets/images/photos/Giga.jpg",
      role: "Full Stack Developer",
      batch: "2023",
      educationLevel: "masters",
      isCertified: false,
      description:
        "A versatile developer with expertise in both frontend and backend technologies. Known for creating efficient, scalable solutions.",
      email: "giga.chad@mail.ugm.ac.id",
      linkedin: "https://linkedin.com/in/gigachad",
      github: "https://github.com/gigachad",
      portfolio: "https://gigachad.dev",
    },
  ],
  skills: [
    {
      id: 1,
      name: "React",
      category: "frontend",
    },
    {
      "id": 2,
      name: "Next.js",
      category: "frontend",
    },
    {
      id: 3,
      name: "Node.js",
      category: "backend",
    },
  ],
  talentSkills: [
    {
      talentId: 999,
      skillId: 1,
    },
    {
      talentId: 999,
      skillId: 2,
    },
    {
      talentId: 999,
      skillId: 3,
    },
  ],
  projects: [
    {
      id: 1,
      talentId: 999,
      title: "Night Login Website",
      description:
        "Developed the main organization website using Next.js and Tailwind CSS.",
      link: "https://nightlogin.org",
      image: "/assets/images/projects/FindIT2023.jpg",
    },
  ],
  organizations: [
    {
      id: 1,
      talentId: 999,
      name: "Night Login",
      role: "Web Developer",
      period: "2023 - Present",
    },
  ],
  grades: [
    {
      talentId: 999,
      subject: "Data Structures & Algorithms",
      grade: "A",
      semester: "Fall 2023",
    },
  ],
};

export function getMockAdminData(): AdminDatabase {
  return initialAdminData;
}
