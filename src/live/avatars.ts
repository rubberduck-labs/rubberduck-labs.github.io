import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/open-peeps.json' with { type: 'json' };

// Open Peeps by Pablo Stanley (CC0), rendered locally with DiceBear (MIT).
const style = new Style(definition);
const avatars = new Map<string, string>();

export function avatarFor(id: string): string | null {
  if (!/^[0-9a-f]{6}$/.test(id)) return null;

  let uri = avatars.get(id);
  if (!uri) {
    // Keep SVGs in separate image documents so their internal IDs cannot clash.
    uri = new Avatar(style, { seed: id }).toDataUri();
    avatars.set(id, uri);
  }
  return uri;
}
