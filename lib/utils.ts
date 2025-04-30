import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Errors aren't part of TS type system (yet?).
// I was looking for the simplest way to handle errors in a type-safe way.
// https://x.com/MichaelArnaldi/status/1917558039638327509
// Felt that Effect TS was too heavy for this project.
// Neverthrow as well: https://github.com/supermacro/neverthrow
// So I decided to go for this simpler approach.
// Inspired by @theo (on X) gist:
// https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
// And confirmed by this Google repo:
// https://github.com/google/wireit/blob/bfa315c565350cd8cf8f685477fc87356ab32d68/src/error.ts#L13
export type Result<T, E extends Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
