import { Linkedin } from "lucide-react";
import { TechIcon } from "../TechIcon";
import { Project, TeamMember } from "./types";

interface MemberCvDialogProps {
  member: TeamMember;
  memberProjects: Project[];
}

export const MemberCvDialogContent = ({ member, memberProjects }: MemberCvDialogProps) => {
  return (

    <div className="px-4 py-4">
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-custom-dark dark:text-white">
            {member.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg text-custom-dark/70 dark:text-white/70">
              {member.role}
            </p>
            {member.linkedin && (
              <a
                href={`https://linkedin.com/in/${encodeURIComponent(
                  member.linkedin
                )}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <p className="text-custom-dark/80 dark:text-white/80 mb-8">
        {member.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-custom-dark dark:text-white mb-4">
            Ekspertise
          </h4>
          <ul className="space-y-2">
            {member.expertise.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-custom-dark/80 dark:text-white/80"
              >
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-custom-dark dark:text-white mb-4">
            Teknologier
          </h4>
          <div className="flex flex-wrap gap-3">
            {member.technologies.map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-sm text-custom-dark/80 dark:text-white/80"
              >
                <TechIcon name={tech} className="w-4 h-4" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-custom-dark dark:text-white mb-4">
          Noen utvalgte prosjekter
        </h4>
        <div className="space-y-6">
          {memberProjects.map((project, index) => (
            <div key={index} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-custom-dark dark:text-white">
                    {project.company}
                  </p>
                  <p className="text-custom-dark/70 dark:text-white/70">
                    {project.role}
                  </p>
                </div>
                <p className="text-sm text-custom-dark/60 dark:text-white/60">
                  {project.period}
                </p>
              </div>
              <p className="text-sm text-custom-dark/70 dark:text-white/70 mt-2">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
