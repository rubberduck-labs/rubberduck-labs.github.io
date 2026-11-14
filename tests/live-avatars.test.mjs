import assert from 'node:assert/strict';
import test from 'node:test';
import { avatarFor } from '../src/live/avatars.ts';

test('a visitor keeps the same generated avatar', () => {
  const uri = avatarFor('abcdef');
  assert.match(uri, /^data:image\/svg\+xml/);
  assert.equal(avatarFor('abcdef'), uri);
});

test('avatars are generated beyond the old set of 40 characters', () => {
  const avatars = Array.from({ length: 500 }, (_, i) =>
    avatarFor(i.toString(16).padStart(6, '0')),
  );
  assert.equal(new Set(avatars).size, 500);
  assert.notEqual(avatarFor('000001'), avatarFor('000029'));
});

test('only valid visitor IDs generate avatars', () => {
  for (const id of ['', '../foo', '12345', '1234567', '<svg/>']) {
    assert.equal(avatarFor(id), null);
  }
});
