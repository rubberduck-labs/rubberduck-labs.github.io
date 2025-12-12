export type TeamMember = {
  name: string;
  image: string;
  role: string;
  linkedin?: string;
  description: string;
  expertise: string[];
  technologies: string[];
}

export type Project = {
  company: string;
  role: string;
  period: string;
  description: string;
}
