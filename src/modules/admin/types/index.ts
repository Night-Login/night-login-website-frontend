export type UserRole = "admin" | "leader" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole | string;
  createdAt: string;
}

export type EducationLevel = "bachelors" | "masters" | "doctorate" | "high_school" | "other" | string;

export interface Talent {
  id: number;
  name: string;
  photo: string;
  role: string;
  batch: string;
  educationLevel: EducationLevel;
  isCertified: boolean;
  description: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "fullstack" | "mobile" | "design" | "devops" | string;
}

export interface TalentSkill {
  talentId: number;
  skillId: number;
}

export interface Project {
  id: number;
  talentId: number;
  title: string;
  description: string;
  link: string;
  image: string;
}

export interface Organization {
  id: number;
  talentId: number;
  name: string;
  role: string;
  period: string;
}

export interface Grade {
  talentId: number;
  subject: string;
  grade: string;
  semester: string;
}

export interface AdminDatabase {
  users: User[];
  talents: Talent[];
  skills: Skill[];
  talentSkills: TalentSkill[];
  projects: Project[];
  organizations: Organization[];
  grades: Grade[];
}
