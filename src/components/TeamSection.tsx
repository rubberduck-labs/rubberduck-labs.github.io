import React, { useState, useCallback } from 'react';
import { FileText, X, Linkedin } from 'lucide-react';
import { TechIcon } from './TechIcon';

interface TeamMember {
  name: string;
  image: string;
  role: string;
  description: string;
  expertise: string[];
  technologies: string[];
  projects: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
}

// Reordered team members according to specified order:
// Cato, Kenneth, Espen, Arild, Bjørn arve, arne olaf, johannes
const teamMembers: TeamMember[] = [
  {
    name: 'Cato Hauge',
    image: 'https://static.wixstatic.com/media/d42034_7a7a2305a8ae4be9b38389b106e5c953~mv2.jpeg/v1/fill/w_323,h_679,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_7a7a2305a8ae4be9b38389b106e5c953~mv2.jpeg',
    role: 'Daglig leder',
    description: 'Cato er en allsidig og erfaren systemutvikler som har hatt roller som utvikler, løsningsarkitekt, Scrum Master, Tech Lead og prosjektleder. Han har jobbet med utvikling og teknisk ledelse i store prosjekter, ofte med komplekse integrasjoner og tverrfaglige team.',
    expertise: [
      'Systemutvikling',
      'Prosjektledelse',
      'Arkitektur',
      'Scrum Master',
      'Tech Lead'
    ],
    technologies: ['Java', 'Spring', 'AngularJS', 'React', 'Hibernate', 'OpenShift', 'SQL'],
    projects: [
      {
        company: 'Posten Norge',
        role: 'Seniorutvikler',
        period: '2020 - nå',
        description: 'Checkout-løsning for e-handel'
      },
      {
        company: 'Posten Norge',
        role: 'Tech Lead',
        period: '2019 - 2020',
        description: 'Migrering av systemer til Azure'
      },
      {
        company: 'Telenor',
        role: 'Systemutvikler',
        period: '2017 - 2019',
        description: 'Modernisering av selvbetjeningsplattformen'
      }
    ]
  },
  {
    name: 'Kenneth Leine Schulstad',
    image: 'https://static.wixstatic.com/media/d42034_96e154b6bde2419e83aca8e040f0ebce~mv2.png/v1/fill/w_323,h_823,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_96e154b6bde2419e83aca8e040f0ebce~mv2.png',
    role: 'Seniorkonsulent',
    description: 'Kenneth er en senior fullstack-utvikler med over 20 års erfaring og spisskompetanse innen skyplattformer, mikrotjenester og sikkerhet. Han har jobbet med store offentlige systemer og har erfaring som utvikler, arkitekt og tech lead i en rekke komplekse prosjekter.',
    expertise: [
      'Skyplattformer',
      'Mikrotjenester',
      'Sikkerhet',
      'API-utvikling',
      'Domenedrevet design'
    ],
    technologies: ['Kotlin', 'Java', 'Python', 'Go', 'Kubernetes', 'Docker', 'Spring Boot', 'REST', 'OAuth'],
    projects: [
      {
        company: 'SSB',
        role: 'Tech Lead',
        period: '2021 - nå',
        description: 'Tech Lead for Dapla, skybasert dataplattform for statistikkproduksjon'
      },
      {
        company: 'DNB',
        role: 'API-utvikler',
        period: '2019 - 2021',
        description: 'API-utvikler for PSD2-implementasjon i banksektoren'
      },
      {
        company: 'Mimiro/OpenFarm',
        role: 'Arkitekt',
        period: '2017 - 2019',
        description: 'Arkitektur og sikkerhetsløsning for landbruksplattform'
      }
    ]
  },
  {
    name: 'Espen Schulstad',
    image: 'https://static.wixstatic.com/media/d42034_18dc54d8dc8642b88d91f5747e02d288~mv2.jpeg/v1/fill/w_323,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_18dc54d8dc8642b88d91f5747e02d288~mv2.jpeg',
    role: 'Seniorkonsulent',
    description: 'Espen er en allsidig og erfaren fullstack-utvikler med solid bakgrunn innen arkitektur, integrasjon og utvikling av webapplikasjoner og API-er. Han har lang erfaring med store prosjekter innen logistikk, telekom og offentlig sektor.',
    expertise: [
      'Fullstack-utvikling',
      'Arkitektur',
      'API-utvikling',
      'Cloud',
      'DevOps'
    ],
    technologies: ['Kotlin', 'React', 'Node.js', 'Azure', 'Terraform', 'PostgreSQL'],
    projects: [
      {
        company: 'Posten Norge',
        role: 'Seniorutvikler',
        period: '2020 - nå',
        description: 'Checkout-løsning for e-handel'
      },
      {
        company: 'Posten Norge',
        role: 'Tech Lead',
        period: '2019 - 2020',
        description: 'Migrering av systemer til Azure'
      },
      {
        company: 'Telenor',
        role: 'Systemutvikler',
        period: '2017 - 2019',
        description: 'Modernisering av selvbetjeningsplattformen'
      }
    ]
  },
  {
    name: 'Arild Greni',
    image: 'https://static.wixstatic.com/media/d42034_bc9ddc45e73b4c3a890e2afbeb293c4e~mv2.png/v1/fill/w_323,h_384,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_bc9ddc45e73b4c3a890e2afbeb293c4e~mv2.png',
    role: 'Seniorkonsulent',
    description: 'Arild er en erfaren fullstack-utvikler med over 15 års erfaring innen utvikling av frontend, backend og mobilapplikasjoner. Han har jobbet som konsulent siden 2010 og har en sterk evne til å forstå kundenes behov og finne tekniske løsninger som gir verdi. Arild har hatt ledende roller som Tech Lead og mentor for yngre utviklere, og han trives i et hektisk miljø hvor samarbeid og teknisk innsikt er avgjørende.',
    expertise: [
      'Fullstack-utvikling',
      'Frontend-utvikling',
      'Backend-utvikling',
      'Mobilutvikling',
      'Tech Lead',
      'Mentoring'
    ],
    technologies: ['React', 'Redux', 'TypeScript', 'Kotlin', 'Java', 'OpenShift', 'Spring', 'SQL'],
    projects: [
      {
        company: 'Eika Gruppen',
        role: 'Tech Lead',
        period: '2020 - nå',
        description: 'Tech Lead for onboarding-løsning'
      },
      {
        company: 'Telenor',
        role: 'Seniorutvikler',
        period: '2018 - 2020',
        description: 'CRM-system basert på Vue.js og Node.js'
      },
      {
        company: 'Statens Pensjonskasse',
        role: 'Utvikler',
        period: '2016 - 2018',
        description: 'Saksbehandlingssystem for offentlig sektor'
      }
    ]
  },
  {
    name: 'Bjørn Arve Lagim',
    image: 'https://static.wixstatic.com/media/d42034_b0410f0d384a4735a06feb39e1b24500~mv2.png/v1/fill/w_323,h_662,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_b0410f0d384a4735a06feb39e1b24500~mv2.png',
    role: 'Seniorkonsulent',
    description: 'Bjørn Arve er en frontend-spesialist med over 15 års erfaring innen utvikling av skalerbare og brukervennlige web- og mobilapplikasjoner. Han har jobbet med selskaper som Telenor, Kahoot! og Telia, hvor han har hatt en sentral rolle i å bygge komplekse brukergrensesnitt med fokus på ytelse, design og responsivitet.',
    expertise: [
      'Frontend-utvikling',
      'Mobilutvikling',
      'DevOps',
      'CI/CD',
      'UX/UI'
    ],
    technologies: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Ionic', 'Cordova', 'OpenShift', 'Docker', 'MaterialUI'],
    projects: [
      {
        company: 'Tolletaten',
        role: 'Frontend Lead',
        period: '2020 - nå',
        description: 'Frontendutvikler for Kontroll & E-rapport-systemer'
      },
      {
        company: 'Kahoot!',
        role: 'Seniorutvikler',
        period: '2018 - 2020',
        description: 'Frontendutvikler for den kommersielle plattformen'
      },
      {
        company: 'OneCall',
        role: 'Utvikler',
        period: '2016 - 2018',
        description: 'Hybrid-apputvikling for mobiladministrasjon'
      }
    ]
  },
  {
    name: 'Arne Olaf Godtland',
    image: 'https://static.wixstatic.com/media/d42034_00133bb2cf18438b924fce1afe68d5d5~mv2.jpg/v1/fill/w_323,h_624,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d42034_00133bb2cf18438b924fce1afe68d5d5~mv2.jpg',
    role: 'Arkitekt | Tech Lead | Utvikler',
    description: 'Arne Olaf er en erfaren systemarkitekt og utvikler med en mastergrad i informatikk fra Universitetet i Oslo. Han har jobbet innen bank, finans og offentlig sektor i en rekke komplekse prosjekter med fokus på arkitektur, tjenesteutvikling og integrasjoner. Han har flere års erfaring som løsningsarkitekt, der han har hatt ansvar for tekniske løsningsbeskrivelser, kravspesifisering og systemdesign.',
    expertise: [
      'Systemarkitektur',
      'Løsningsarkitektur',
      'Cloud-teknologier',
      'Mikrotjenester',
      'Mentoring'
    ],
    technologies: ['Java', 'Kotlin', 'Spring Boot', 'OpenShift', 'React', 'Microsoft SQL Server', 'OAuth', 'Azure'],
    projects: [
      {
        company: 'Forbrukerrådet',
        role: 'Systemarkitekt',
        period: '2021 - nå',
        description: 'Migrering og modernisering av Strømpris.no'
      },
      {
        company: 'Eika Kapitalforvaltning',
        role: 'Tech Lead',
        period: '2019 - 2021',
        description: 'Arkitektur og utvikling av Smartspar-appen'
      },
      {
        company: 'Eika Gruppen',
        role: 'Seniorutvikler',
        period: '2017 - 2019',
        description: 'Implementering av BankID-signering og systemmodernisering'
      }
    ]
  },
  {
    name: 'Johannes Moskvil',
    image: 'https://static.wixstatic.com/media/d42034_2e4bbb0c71dc4202aa2269e47e7a261c~mv2.jpeg/v1/fill/w_196,h_198,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1572784626796.jpeg',
    role: 'Senior Fullstack-utvikler',
    description: 'Johannes er en fullstack-utvikler med spesiell lidenskap for frontend. Han har et sterkt fokus på testbar og lettlest kode og leverer brukervennlige og elegante løsninger. Han har erfaring som faggruppeleder for webutvikling og trives med å jobbe i team hvor kodekvalitet og arkitektur står i sentrum.',
    expertise: [
      'Frontend-utvikling',
      'Backend-utvikling',
      'Mikrotjenester',
      'Event-drevne systemer',
      'Kodekvalitet'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Kotlin', 'Spring Boot', 'GraphQL'],
    projects: [
      {
        company: 'NAV IT',
        role: 'Tech Lead',
        period: '2020 - nå',
        description: 'Tech Lead for ny frontendløsning for pensjonsbrev'
      },
      {
        company: 'NAV IT',
        role: 'Seniorutvikler',
        period: '2019 - 2020',
        description: 'Backendutvikling for arbeidsgivers inntektsmeldingssystem'
      },
      {
        company: 'Entur',
        role: 'Frontendutvikler',
        period: '2017 - 2019',
        description: 'Frontendutvikler for billett- og betalingssystemer'
      }
    ]
  }
];

export function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  return (
    <section id="folka" className="min-h-screen py-24 bg-gradient-radial from-custom-yellow/30 to-transparent dark:from-custom-dark/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-custom-dark dark:text-white mb-6">
            Møt teamet
          </h2>
          <p className="text-lg text-custom-dark/80 dark:text-white/80 max-w-2xl mx-auto">
            Et dedikert team av eksperter som brenner for teknologi og innovasjon
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-custom-dark/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative pb-[125%] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  style={{
                    objectPosition: '50% 15%'
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 group-hover:to-black/70 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold">
                  {member.name}
                </h3>
                <p className="text-sm text-white/80">
                  {member.role}
                </p>
              </div>
              
              {/* Enhanced CV Button */}
              <button 
                onClick={() => setSelectedMember(member)}
                className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group"
                aria-label="Se CV"
              >
                <div className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-custom-dark text-custom-dark dark:text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">Se CV</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* CV Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
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
                      <a
                        href={`https://linkedin.com/in/search?q=${encodeURIComponent(selectedMember.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
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
                    {selectedMember.projects.map((project, index) => (
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