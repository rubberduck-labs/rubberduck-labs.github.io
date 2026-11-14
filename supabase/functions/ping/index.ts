import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ALLOWED_ORIGINS = ['https://rubberduck.no', 'https://www.rubberduck.no'];
// Korte koder i stedet for lesbare navn. Samme tabell ligger i public/t.js.
const CODES: Record<string, string> = { a: 'pageview', b: 'apply_click', c: 'apply_sent', d: 'contact_sent', e: 'linkedin_click', f: 'message_started', g: 'calc_used', h: 'team_cv_open', i: 'hiku_open', j: 'hiku_play', k: 'terminal_open', l: 'terminal_command' };

// Nyttelasten er base64url av 12 byte IV + AES-GCM-kryptert liste: [kode, etikett, sti, bredde, referrer, kilde, kampanje].
// Nøkkelen ligger også i public/t.js, så dette gjør trafikken uleselig i nettverksfanen, men er ikke hemmelig.
const KEY_B64 = '0NSjKne/Zmqo4kiZqwv88vOHs30JItG6FQQrY7Eeki8=';
const keyPromise = crypto.subtle.importKey('raw', Uint8Array.from(atob(KEY_B64), (c) => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt']);

async function decode(text: string): Promise<{ e: string; l: unknown; p: unknown; w: unknown; r: unknown; u: unknown } | null> {
  try {
    const bytes = Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    if (bytes.length < 13 + 16) return null;
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, await keyPromise, bytes.slice(12));
    const a = JSON.parse(new TextDecoder().decode(plain));
    if (!Array.isArray(a) || !CODES[a[0]]) return null;
    return { e: CODES[a[0]], l: a[1], p: a[2], w: a[3], r: a[4], u: { source: a[5], campaign: a[6] } };
  } catch {
    return null;
  }
}
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|go-http/i;
const MAX_BODY_BYTES = 2000;
const LIMIT_PER_VISITOR_PER_HOUR = 200;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const done = (headers: Record<string, string> = {}) => new Response(null, { status: 204, headers });

// ISO-uke (mandag til søndag) i UTC, for eksempel «2026-W46». Samme kode som i stats/week.ts.
function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((+t - +yearStart) / 86400000 + 1) / 7)).padStart(2, '0')}`;
}

// Samme besøkende får samme id hele uka (ISO-uke) og en ny uka etter, så en kommer tilbake kan sees innenfor uka, men ikke følges lenger.
// IP-adressen og nettleseren er bare med i hashen, og nøkkelen er hemmelig. Ingenting av dette lagres i klartekst.
async function visitorHash(ip: string, ua: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(SUPABASE_SERVICE_ROLE_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const week = isoWeek(new Date());
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ip}|${ua}|${week}`));
  return Array.from(new Uint8Array(mac)).slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? '';
  return fwd.split(',')[0].trim();
}

function browserLabel(ua: string): string | null {
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox\/|FxiOS/.test(ua) ? 'Firefox'
    : /Chrome\/|CriOS/.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : null;
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /CrOS/.test(ua) ? 'ChromeOS' : /Linux/.test(ua) ? 'Linux' : null;
  return [browser, os && (browser ? `på ${os}` : os)].filter(Boolean).join(' ') || null;
}

// Bare vert og sti, aldri søkestreng eller hash. Egne sider og tomme verdier telles som "direkte".
function referrerLabel(value: unknown): string | null {
  if (typeof value !== 'string' || !value || value.length > 500) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'rubberduck.no') return null;
    return (host + (u.pathname === '/' ? '' : u.pathname)).slice(0, 120);
  } catch {
    return null;
  }
}

function campaignLabel(value: unknown): string | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const ok = (x: unknown) => (typeof x === 'string' && /^[a-z0-9_.-]{1,40}$/i.test(x) ? x : null);
  const parts = [ok(v.source), ok(v.campaign)].filter(Boolean);
  return parts.length ? parts.join(' / ') : null;
}

// Kort fritekst-etikett (for eksempel et navn). Bare bokstaver, tall og noen tegnsettingstegn, ingen HTML eller lenker.
function labelText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.normalize('NFC').replace(/[^\p{L}\p{N} .'\-]/gu, '').trim().slice(0, 40);
  return clean || null;
}

function pathLabel(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\/[A-Za-z0-9_\-./]{0,99}$/.test(value)) return null;
  if (value.startsWith('/live')) return null; // intern side, telles aldri
  return value;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', Vary: 'Origin' };
  if (req.method === 'OPTIONS') return done(cors);
  // Svarer alltid 204 og lagrer stille bare det som ser riktig ut; en teller skal aldri gi feil til besøkende.
  if (req.method !== 'POST' || !ALLOWED_ORIGINS.includes(origin)) return done(cors);
  try {
    const ua = req.headers.get('user-agent') ?? '';
    if (!ua || BOT_RE.test(ua)) return done(cors);
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return done(cors);
    const body = await decode(text);
    if (!body) return done(cors);
    const path = pathLabel(body.p);
    if (!path) return done(cors);

    const visitor = await visitorHash(clientIp(req), ua);
    const { count } = await supabase.from('Events').select('id', { count: 'exact', head: true })
      .eq('visitor', visitor).gte('created_at', new Date(Date.now() - 3600_000).toISOString());
    if ((count ?? 0) >= LIMIT_PER_VISITOR_PER_HOUR) return done(cors);

    const w = typeof body.w === 'number' ? body.w : 0;
    await supabase.from('Events').insert({
      event: body.e, path, visitor, label: labelText(body.l),
      referrer: referrerLabel(body.r), campaign: campaignLabel(body.u), browser: browserLabel(ua),
      screen: w ? (w < 640 ? 'mobil' : w < 1024 ? 'nettbrett' : 'pc') : null,
    });
  } catch (e) {
    console.error('t:', e instanceof Error ? e.message : e);
  }
  return done(cors);
});
