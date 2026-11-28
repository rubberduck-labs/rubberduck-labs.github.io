import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { RubberDuckIcon } from './Icons/RubberDuckIcon';
import { RubberDuckLogo } from './Icons/RubberDuckLogo';
import { useCanary } from '../hooks/useCanary';

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Nydalsveien+28,+0484+Oslo';

const linkClass = 'whitespace-nowrap text-white/70 hover:text-yellow-300 transition-colors';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-white font-medium mb-3">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

export function Footer() {
  const isCanary = useCanary();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#171614] text-sm text-white/70">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Rubberduck, til forsiden">
              <RubberDuckIcon className="h-7 text-yellow-300" />
              <RubberDuckLogo className="h-auto w-[120px] text-white" />
            </Link>
            <div className="mt-4 flex gap-1 -ml-2">
              <a
                href="https://www.linkedin.com/company/rubberduck-dev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 text-white/70 hover:text-yellow-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/rubberduck.no/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 text-white/70 hover:text-yellow-300 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
            <Column title="Selskapet">
              <li><Link to="/team" className={linkClass}>Team</Link></li>
              <li><Link to="/kunder" className={linkClass}>Her er vi</Link></li>
              <li><Link to="/handbook" className={linkClass}>Håndbok</Link></li>
            </Column>
            <Column title="Jobb">
              <li><Link to="/jobs" className={linkClass}>Jobb hos oss</Link></li>
              {isCanary && <li><Link to="/oppdrag" className={linkClass}>Oppdrag</Link></li>}
            </Column>
            <Column title="Kontakt">
              <li><a href="mailto:hei@rubberduck.no" className={linkClass}>hei@rubberduck.no</a></li>
              <li><a href="tel:+4722301010" className={linkClass}>+47 22 30 10 10</a></li>
              <li>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Nydalsveien 28, Oslo
                </a>
              </li>
            </Column>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-white/10 text-white/50">
          © {year} Rubberduck Dev AS · Org.nr. 988 353 612 · Postboks 4814, 0422 Oslo
        </p>
      </div>
    </footer>
  );
}
