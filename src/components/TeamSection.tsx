import React, { useState, useCallback, useEffect } from 'react';
import { FileText, X, Linkedin } from 'lucide-react';
import { TechIcon } from './TechIcon';
import teamData from '../data/team/members.json';
import projectsData from '../data/team/projects.json';
import { CartoonBox } from "./CartoonBox.tsx";

interface TeamMember {
  name: string;
  image: string;
  role: string;
  linkedin: string;
  description: string;
  expertise: string[];
  technologies: string[];
}

interface Project {
  company: string;
  role: string;
  period: string;
  description: string;
}

// Store session employees
export const sessionEmployees: TeamMember[] = [];

export function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberProjects, setMemberProjects] = useState<Project[]>([]);
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);

  // Combine static and session team members
  useEffect(() => {
    setAllMembers([...teamData.members, ...sessionEmployees]);
  }, [sessionEmployees.length]); // Update when session employees change

  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  useEffect(() => {
    if (selectedMember) {
      setMemberProjects(projectsData.projects[selectedMember.name] || []);
    }
  }, [selectedMember]);

  return (
    <section id="folka"
             className="min-h-screen py-24 bg-gradient-radial from-custom-yellow/30 to-transparent dark:from-custom-dark/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font text-4xl font-bold text-custom-dark dark:text-white mb-6">
            Møt teamet
          </h2>
          <p className="font text-lg text-custom-dark/80 dark:text-white/80 max-w-2xl mx-auto">
            Et dedikert team av eksperter som brenner for teknologi og innovasjon<br /><span className="text-sm"><i>(Illustrasjoner: Flu Hartberg)</i></span>
          </p>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {allMembers.map((member, index) => (


            <div
              key={index}
              className="group relative  rounded-xl overflow-visible  transition-all duration-300 lg:h-[500px] h-[300px]"
            >
              <div className="relative overflow-hidden h-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-300 hover-supported:group-hover:scale-110 z-9 filter drop-shadow-[10px_5px_10px_rgba(0,0,0,0.45)] lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
                  style={{
                    objectPosition: '50% 50%',
                  }}
                />
                <img
                  src={member.image}
                  alt={member.name}
                  className="hidden dark:block absolute inset-0 w-full h-full object-contain object-top transition-all duration-300 hover-supported:group-hover:scale-110 z-9 lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
                  style={{
                    objectPosition: '50% 50%',
                    filter: `
                      drop-shadow(1px 0 white)
                      drop-shadow(-1px 0 white)
                      drop-shadow(0 1px white)
                      drop-shadow(0 -1px white)
                    `
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0  rounded-t-2xl lg:h-[160px] h-[120px] hover-supported:group-hover:h-full transition-all duration-300">
                  <CartoonBox />
                </div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-300 hover-supported:group-hover:scale-110 z-11 lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
                  style={{
                    objectPosition: '50% 50%',
                  }}
                />
                {/* Gradient overlay */}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-custom-dark/90">
                <h3 className="font-fun font-semibold text-base lg:text-2xl md:text-md leading-[1.2rem]">
                  {member.name}
                </h3>
                <p className="font-fun text-sm sm:text-lg text-custom-dark/90">
                  {member.role}
                </p>
              </div>

              {/* Enhanced CV Button */}
              <button
                onClick={() => setSelectedMember(member)}
                className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/0  transition-colors group lg:pt-80"
                aria-label="Se CV"
              >
                <div
                  className="transform translate-y-8 group-hover:translate-y-0 opacity-0 hover-supported:group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-custom-dark text-custom-dark dark:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 shadow-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-semibold">Se CV</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* CV Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-custom-dark dark:text-white">
                      {selectedMember.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg text-custom-dark/70 dark:text-white/70">
                        {selectedMember.role}
                      </p>
                      {selectedMember.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${encodeURIComponent(
                            selectedMember.linkedin
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
                  {selectedMember.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-custom-dark dark:text-white mb-4">
                      Ekspertise
                    </h4>
                    <ul className="space-y-2">
                      {selectedMember.expertise.map((item, index) => (
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
                      {selectedMember.technologies.map((tech, index) => (
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
