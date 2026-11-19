// Validation and payload building for the Criminal Dossier survey. Pure functions over
// plain answers, so the browser script and the Node tests (scripts/tests/criminal-dossier.mjs)
// share them. Client validation is UX only: normalize exported rows before analysis.
import { FIELDS, SURVEY_VERSION, type Field } from '../data/criminal-dossier.ts';

/** Raw answers read from the form: checkbox groups as arrays, everything else as strings. */
export type Answers = Record<string, string | readonly string[] | undefined>;

export interface Validation {
  /** Error message per control or group name, in form order. */
  errors: Record<string, string>;
  /** The Formspree payload: every field, multi-selects pipe-delimited in option order. */
  payload: Record<string, string>;
}

const text = (value: Answers[string]) => (typeof value === 'string' ? value.trim() : '');
const list = (value: Answers[string]) => (Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : []);
const length = (value: string) => [...value].length;

export function validate(answers: Answers, fields: readonly Field[] = FIELDS): Validation {
  const errors: Record<string, string> = {};
  const payload: Record<string, string> = { survey_version: SURVEY_VERSION };

  for (const field of fields) {
    if (field.kind === 'text' || field.kind === 'textarea') {
      const value = text(answers[field.name]);
      if (field.required && !value) errors[field.name] = 'Please fill this in.';
      else if (length(value) > field.maxLength) errors[field.name] = `Please keep this to ${field.maxLength} characters or fewer.`;
      payload[field.name] = value;
    } else if (field.kind === 'radio') {
      const value = text(answers[field.name]);
      const valid = !value || field.options.some(option => option.value === value);
      if (!valid) errors[field.name] = 'Please choose one of the listed options.';
      else if (field.required && !value) errors[field.name] = 'Please choose one.';
      payload[field.name] = valid ? value : '';
    } else if (field.kind === 'checkbox') {
      const chosen = new Set(list(answers[field.name]));
      const ordered = field.options.filter(option => chosen.has(option.value));
      const exclusive = ordered.find(option => option.exclusive);
      if (ordered.length !== chosen.size) errors[field.name] = 'Please choose from the listed options.';
      else if (field.required && ordered.length === 0) errors[field.name] = `Please choose at least one (up to ${field.max}).`;
      else if (ordered.length > field.max) errors[field.name] = `Please choose no more than ${field.max}; you have ${ordered.length}.`;
      else if (exclusive && ordered.length > 1) errors[field.name] = `“${exclusive.label}” can’t be combined with other choices. Uncheck it or the others.`;
      payload[field.name] = ordered.map(option => option.value).join('|');

      if (field.companion) {
        // Companion text only counts while its option is selected; stale text is dropped.
        const companion = chosen.has(field.companion.option) ? text(answers[field.companion.name]) : '';
        if (length(companion) > field.companion.maxLength) {
          errors[field.companion.name] = `Please keep this to ${field.companion.maxLength} characters or fewer.`;
        }
        payload[field.companion.name] = companion;
      }
    } else {
      const values = field.names.map(name => text(answers[name]));
      field.names.forEach((name, index) => {
        const value = values[index];
        const label = field.rankLabels[index].toLowerCase();
        if (value && !field.options.some(option => option.value === value)) {
          errors[name] = 'Please choose one of the listed playbooks.';
        } else if (index === 0 && field.required && !value) {
          errors[name] = 'Please choose your first choice.';
        } else if (value && index > 0 && !values[index - 1]) {
          errors[name] = `Please choose a ${field.rankLabels[index - 1].toLowerCase()} before a ${label}, or clear this one.`;
        } else if (value && values.slice(0, index).includes(value)) {
          errors[name] = `You’ve already picked this playbook above. Choose a different ${label}, or leave it blank.`;
        }
        payload[name] = value;
      });
    }
  }

  return { errors, payload };
}

export type SubmitOutcome =
  | { ok: true }
  | { ok: false; kind: 'rate-limit' | 'rejected' | 'server' | 'network'; message: string };

/** Turn a Formspree AJAX response (or a thrown fetch) into what the player should be told. */
export async function interpretResponse(response: Response | Error): Promise<SubmitOutcome> {
  const keep = 'Your answers are still here.';
  if (response instanceof Error) {
    return { ok: false, kind: 'network', message: `We couldn’t reach the form service. ${keep} Check your connection, then press Seal Dossier again.` };
  }
  let body: { ok?: boolean; errors?: { message?: string }[] } = {};
  try { body = await response.json(); } catch { /* non-JSON body: fall back on the status */ }
  if (response.ok && body.ok !== false && !body.errors?.length) return { ok: true };
  if (response.status === 429) {
    return { ok: false, kind: 'rate-limit', message: `Too many attempts in a short time. ${keep} Wait a minute, then press Seal Dossier again.` };
  }
  if (response.status >= 500) {
    return { ok: false, kind: 'server', message: `The form service had a problem (error ${response.status}). ${keep} Try again in a few minutes, or let Kat know if it keeps happening.` };
  }
  const detail = body.errors?.map(error => error.message).filter(Boolean).join(' ');
  return {
    ok: false,
    kind: 'rejected',
    message: `The form service didn’t accept the dossier${detail ? `: ${detail}` : ` (error ${response.status})`}. ${keep} Try again, or let Kat know.`,
  };
}
