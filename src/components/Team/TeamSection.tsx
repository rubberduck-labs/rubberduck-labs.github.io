import { useState, useCallback, useEffect } from 'react';
import teamData from '../../data/team/members.json';
import projectsData from '../../data/team/projects.json';
import { Project, TeamMember } from "./types";
import { MemberCvDialogContent } from "./MemberCvDialogContent";
import { MemberCard } from "./MemberCard";
import { CustomDialog } from "../CustomDialog";

// Store session employees
const sessionEmployees: TeamMember[] = [];

export function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberProjects, setMemberProjects] = useState<Project[]>([]);
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);

  // Combine static and session team members
  useEffect(() => {
    setAllMembers([...teamData.members, ...sessionEmployees]);
  }, []); // Update when session employees change

  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  useEffect(() => {
    if (selectedMember) {
      setMemberProjects(projectsData.projects[selectedMember.name as keyof typeof projectsData.projects] || []);
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
            <MemberCard member={member} setSelectedMember={setSelectedMember} key={member.name + index} />
          ))}
        </div>

        {/* CV Modal */}
        <CustomDialog open={!!selectedMember} onClose={handleCloseModal}>
          {selectedMember && <MemberCvDialogContent member={selectedMember} memberProjects={memberProjects} />}
        </CustomDialog>
      </div>
    </section>
  );
}
