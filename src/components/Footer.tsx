import React from 'react';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white/80 py-16 font-extralight">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-4">
              E-post
            </h3>
            <a 
              href="mailto:hei@rubberduck.no" 
              className="hover:text-white transition-colors"
            >
              hei@rubberduck.no
            </a>
          </div>

          {/* Phone */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Telefon
            </h3>
            <a 
              href="tel:+4721520196" 
              className="hover:text-white transition-colors"
            >
              +47 21 52 01 96
            </a>
          </div>

          {/* Postal Address */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Postadresse
            </h3>
            <p>Postboks 4814</p>
            <p>0422 Oslo</p>
          </div>

          {/* Visiting Address */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Besøksadresse
            </h3>
            <p>Nydalsveien 28</p>
            <p>Oslo</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>© 2025 Rubberduck AS. Org.nr 988 353 612</p>
        </div>
      </div>
    </footer>
  );
}