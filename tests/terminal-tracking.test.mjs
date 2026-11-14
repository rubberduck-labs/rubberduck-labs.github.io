import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { trackTerminalCommand } from '../src/utils/terminalTracking.ts';

const known = ['help', 'ls', 'cat', 'cd', 'add-employee'];

test('terminal commands record only registered names', () => {
  const original = globalThis.window;
  const events = [];
  globalThis.window = { rdTrack: (...args) => events.push(args) };
  try {
    trackTerminalCommand('help', known);
    trackTerminalCommand('./help.sh', known, 'help');
    trackTerminalCommand('someone@example.com', known);
    trackTerminalCommand('unknown', known, 'private-input');
    trackTerminalCommand('', known);
    assert.deepEqual(events, [
      ['terminal_command', 'help'],
      ['terminal_command', 'help'],
      ['terminal_command', 'unknown'],
      ['terminal_command', 'unknown'],
    ]);
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});

test('tracking is optional when the statistics script is unavailable', () => {
  const original = globalThis.window;
  globalThis.window = {};
  try {
    assert.doesNotThrow(() => trackTerminalCommand('ls', known));
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});

test('encrypted terminal events match the receiver protocol', async () => {
  const sent = [];
  const context = {
    navigator: { sendBeacon: (_url, blob) => { sent.push(blob); return true; } },
    location: { pathname: '/', hash: '', search: '' },
    localStorage: { getItem: () => null },
    document: { referrer: '' },
    crypto: webcrypto, TextEncoder, Uint8Array, Blob, URLSearchParams, atob, btoa,
    window: { crypto: webcrypto, innerWidth: 1200, addEventListener() {} },
  };
  vm.runInNewContext(readFileSync(new URL('../public/t.js', import.meta.url), 'utf8'), context);
  context.window.rdTrack('terminal_open');
  context.window.rdTrack('terminal_command', 'help');
  const deadline = Date.now() + 2000;
  while (sent.length < 3 && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(sent.length, 3);
  const key = await webcrypto.subtle.importKey('raw', Buffer.from('0NSjKne/Zmqo4kiZqwv88vOHs30JItG6FQQrY7Eeki8=', 'base64'), 'AES-GCM', false, ['decrypt']);
  const payloads = await Promise.all(sent.map(async blob => {
    const bytes = Buffer.from(await blob.text(), 'base64url');
    const plain = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.subarray(0, 12) }, key, bytes.subarray(12));
    return JSON.parse(new TextDecoder().decode(plain));
  }));
  const receiver = readFileSync(new URL('../supabase/functions/ping/index.ts', import.meta.url), 'utf8');
  const codeSource = /const CODES[^=]*= (\{[^;]+\});/.exec(receiver)[1];
  const codes = vm.runInNewContext('(' + codeSource + ')');
  assert.ok(payloads.some(p => codes[p[0]] === 'terminal_open' && p[1] === null));
  assert.ok(payloads.some(p => codes[p[0]] === 'terminal_command' && p[1] === 'help'));
});
