import { Command } from './types';
import { sessionEmployees } from '../components/TeamSection';

export const addEmployeeCommand: Command = {
  name: 'add-employee',
  description: 'Add a new employee to the team (session only)',
  execute: async (args, { setLines }) => {
    if (args.length < 2) {
      setLines(prev => [
        ...prev,
        { content: 'Usage: add-employee <firstname> <lastname>', type: 'output' },
        { content: 'Example: add-employee John Doe', type: 'output' }
      ]);
      return;
    }

    const firstName = args[0];
    const lastName = args.slice(1).join(' ');
    const fullName = `${firstName} ${lastName}`;

    // Create new team member
    const newMember = {
      name: fullName,
      image: "/employee.webp",
      role: "Seniorkonsulent",
      description: `${fullName} er en erfaren utvikler med bred kompetanse innen systemutvikling og arkitektur.`,
      expertise: [
        "Systemutvikling",
        "Arkitektur",
        "Frontend-utvikling",
        "Backend-utvikling"
      ],
      technologies: ["TypeScript", "React", "Node.js", "Java"]
    };

    // Add to shared session array
    sessionEmployees.push(newMember);

    setLines(prev => [
      ...prev,
      { content: `✅ Successfully added ${fullName} to the team (session only - this is not real). <a href="/team" onclick="event.preventDefault(); window.history.pushState({}, '', '/team'); window.dispatchEvent(new PopStateEvent('popstate'));" style="color: #fde047; text-decoration: underline">Check out the team page</a>. If you like what you see, maybe you should apply for a real position!`, type: 'output' }]);
  }
};