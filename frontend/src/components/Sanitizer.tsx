import { escape } from 'validator';
import { Filter } from 'bad-words';

const filter = new Filter();

export const sanitizeInput = (input: string): string => {
  let sanitizedInput = escape(input);

  sanitizedInput = filter.clean(sanitizedInput);

  return sanitizedInput;
};
