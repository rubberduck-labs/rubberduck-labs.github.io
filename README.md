# rubberduck.no

The live dashboard generates Open Peeps avatars locally using DiceBear, seeded
by visitor ID. Vite builds the generator as `/live-avatars.js`; `npm run dev`
serves the same module from source. Run `npm run test:avatars` with Node.js 22.18+
to check deterministic generation and variation. Artwork and library licenses
are included in `public/avatar-licenses.txt`.

