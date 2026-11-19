// Survey Two validation, payload and response handling. Run: pnpm survey:check
// Synthetic answers only; no real player data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, interpretResponse } from '../../src/scripts/criminal-dossier.ts';
import { FIELDS } from '../../src/data/criminal-dossier.ts';

const valid = {
  player_name: '  Test Player ',
  playbook_first: 'leech', playbook_second: 'whisper', playbook_third: '',
  talents: ['attune', 'tinker'],
  score_preferences: ['occult_job', 'grand_heist'],
  operating_preference: 'mixed',
  customization: 'collaborate',
};
const run = overrides => validate({ ...valid, ...overrides });

test('valid answers build a complete payload in option order', () => {
  const { errors, payload } = run({});
  assert.deepEqual(errors, {});
  assert.equal(payload.survey_version, '2.0');
  assert.equal(payload.player_name, 'Test Player');
  assert.equal(payload.talents, 'tinker|attune');
  assert.equal(payload.score_preferences, 'grand_heist|occult_job');
  // Every defined field is present, unanswered optional ones as empty strings.
  const keys = FIELDS.flatMap(f => f.kind === 'rank' ? f.names : [f.name, ...(f.kind === 'checkbox' && f.companion ? [f.companion.name] : [])]);
  for (const key of keys) assert.ok(key in payload, key);
  for (const key of ['personality', 'personality_other', 'background', 'settings', 'complications', 'motivations', 'story_elements', 'vice', 'character_concept', 'character_notes', 'playbook_third']) assert.equal(payload[key], '', key);
  assert.ok(Object.values(payload).every(v => typeof v === 'string'));
});

test('blank required fields are reported', () => {
  const { errors } = validate({});
  assert.deepEqual(Object.keys(errors).sort(), ['customization', 'operating_preference', 'playbook_first', 'player_name', 'score_preferences', 'talents']);
  assert.ok(run({ player_name: '    ' }).errors.player_name);
});

test('rankings: duplicates and a skipped second choice are errors, never rewritten', () => {
  const dup = run({ playbook_second: 'leech' });
  assert.match(dup.errors.playbook_second, /already picked/);
  assert.equal(dup.payload.playbook_second, 'leech');
  assert.match(run({ playbook_second: 'whisper', playbook_third: 'whisper' }).errors.playbook_third, /already picked/);
  assert.match(run({ playbook_second: 'leech', playbook_third: 'leech' }).errors.playbook_third, /already picked/);
  const skipped = run({ playbook_second: '', playbook_third: 'lurk' });
  assert.match(skipped.errors.playbook_third, /second choice before/);
  assert.equal(skipped.payload.playbook_third, 'lurk');
  assert.ok(run({ playbook_first: 'airship' }).errors.playbook_first);
  assert.deepEqual(run({ playbook_second: '', playbook_third: '' }).errors, {});
});

test('checkbox limits are upper bounds', () => {
  const limits = { talents: 4, personality: 3, score_preferences: 3, settings: 3, complications: 3, background: 2, motivations: 2, story_elements: 3 };
  for (const [name, max] of Object.entries(limits)) {
    const field = FIELDS.find(f => f.name === name);
    const options = field.options.filter(o => !o.exclusive && o.value !== 'other').map(o => o.value);
    assert.equal(run({ [name]: options.slice(0, max) }).errors[name], undefined, `${name} at max`);
    assert.match(run({ [name]: options.slice(0, max + 1) }).errors[name], /no more than/, `${name} over max`);
  }
});

test('exclusive options stand alone', () => {
  assert.deepEqual(run({ background: ['surprise'] }).errors, {});
  assert.match(run({ background: ['artist', 'surprise'] }).errors.background, /Surprise me/);
  assert.deepEqual(run({ motivations: ['surprise'] }).errors, {});
  assert.match(run({ motivations: ['wealth', 'surprise'] }).errors.motivations, /Surprise me/);
  assert.deepEqual(run({ story_elements: ['minimal'] }).errors, {});
  assert.match(run({ story_elements: ['rival', 'minimal'] }).errors.story_elements, /minimal personal drama/);
});

test('Other companion text is kept only while Other is selected', () => {
  assert.equal(run({ personality: ['other', 'loyal'], personality_other: ' Grumpy | gentle ' }).payload.personality_other, 'Grumpy | gentle');
  assert.equal(run({ personality: ['loyal'], personality_other: 'stale text' }).payload.personality_other, '');
  assert.ok(run({ personality: ['other'], personality_other: 'x'.repeat(301) }).errors.personality_other);
});

test('enums and text limits are enforced; Unicode counts by character', () => {
  assert.ok(run({ talents: ['tinker', 'flying'] }).errors.talents);
  assert.ok(run({ vice: 'airship' }).errors.vice);
  assert.equal(run({ vice: 'airship' }).payload.vice, '');
  assert.ok(run({ player_name: 'a'.repeat(101) }).errors.player_name);
  assert.equal(run({ character_notes: '🎭'.repeat(2000) }).errors.character_notes, undefined);
  assert.ok(run({ character_concept: 'b'.repeat(2001) }).errors.character_concept);
});

const respond = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), { status });

test('only a confirmed Formspree success counts as success', async () => {
  assert.deepEqual(await interpretResponse(respond(200, { ok: true, next: '/thanks' })), { ok: true });
  assert.equal((await interpretResponse(respond(200, { errors: [{ message: 'Form not found' }] }))).ok, false);
  const rejected = await interpretResponse(respond(422, { errors: [{ message: 'Invalid email' }] }));
  assert.equal(rejected.kind, 'rejected'); assert.match(rejected.message, /Invalid email/);
  assert.equal((await interpretResponse(respond(429))).kind, 'rate-limit');
  assert.equal((await interpretResponse(respond(503))).kind, 'server');
  assert.equal((await interpretResponse(respond(404))).kind, 'rejected');
  const offline = await interpretResponse(new TypeError('Failed to fetch'));
  assert.equal(offline.kind, 'network'); assert.match(offline.message, /still here/);
});
