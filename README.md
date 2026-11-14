# rubberduck.no

The live dashboard generates Open Peeps avatars locally using DiceBear, seeded
by visitor ID. Vite builds the generator as `/live-avatars.js`; `npm run dev`
serves the same module from source. Run `npm run test:avatars` with Node.js 22.18+
to check deterministic generation and variation. Artwork and library licenses
are included in `public/avatar-licenses.txt`.


Terminal usage is recorded as `terminal_open` and `terminal_command`. Command
labels contain only registered command names, never arguments or unknown input.
Run `npm run test:tracking` with Node.js 22.18+. The receiver is tracked in
`supabase/functions/ping/index.ts`; its matching event codes must be deployed
to the existing Supabase `ping` function before publishing the frontend.
