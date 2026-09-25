/**
 * English ↔ Polish jewelry terminology, sourced from the team's own
 * reference dictionary (a real file the user shared, not invented).
 *
 * Unlike Customer Knowledge terminology (which is per-customer — one
 * customer's "Ref" can mean something different from another's), a
 * language is a language: Polish jewelry vocabulary means the same thing
 * regardless of which customer sends it. So this translation step runs
 * for every request, independent of the customer selected in intake.
 */

export interface GlossaryEntry {
  english: string;
  polish: string;
}

export const POLISH_JEWELRY_GLOSSARY: GlossaryEntry[] = [
  { english: "earring", polish: "kolczyki" },
  { english: "ring", polish: "pierścionek" },
  { english: "bracelet", polish: "bransoletka" },
  { english: "necklace", polish: "naszyjnik" },
  { english: "brooch", polish: "broszka" },
  { english: "pendant", polish: "zawieszka" },
  { english: "silver", polish: "srebro pr 925" },
  { english: "gold 8K", polish: "złoto pr 333" },
  { english: "gold 9K", polish: "złoto pr 375" },
  { english: "gold 14K", polish: "złoto pr 585" },
  { english: "steel", polish: "stal" },
  { english: "brass", polish: "mosiądz" },
  { english: "gold plated", polish: "pozłacany" },
  { english: "white zircon", polish: "biała cyrkonia" },
  { english: "black zircon", polish: "czarna cyrkonia" },
  { english: "green zircon", polish: "zielona cyrkonia" },
  { english: "blue enamel", polish: "niebieska emalia" },
  { english: "pink enamel", polish: "różowa emalia" },
  { english: "black enamel", polish: "czarna emalia" },
  { english: "white enamel", polish: "biała emalia" },
  { english: "enamel", polish: "emalia" },
  { english: "emerald", polish: "szmaragd" },
  { english: "pink sapphire", polish: "różowy szafir" },
  { english: "sapphire", polish: "szafir" },
  { english: "black diamond", polish: "czarny diament" },
  { english: "rubies", polish: "rubiny" },
  { english: "london blue topaz", polish: "london blue topaz" },
  { english: "sky blue topaz", polish: "sky blue topaz" },
  { english: "white topaz", polish: "biały topaz" },
  { english: "pink topaz", polish: "różowy topaz" },
  { english: "green topaz", polish: "zielony topaz" },
  { english: "topaz", polish: "topaz" },
  { english: "white pearl", polish: "perła biała słodkowodna" },
  { english: "pink pearl", polish: "perła różowa słodkowodna" },
  { english: "white diamond", polish: "diament" },
  { english: "black onyx", polish: "czarny onyks" },
  { english: "morganite", polish: "morganit" },
  { english: "smoky quartz", polish: "kwarc dymny" },
  { english: "pink quartz", polish: "różowy kwarc" },
  { english: "rhodolite garnet", polish: "rodolit" },
  { english: "green garnet", polish: "zielony granat" },
  { english: "multi color stone", polish: "kamienie różnokolorowe" },
];

// Longest Polish phrase first, so e.g. "różowy topaz" matches whole before
// the bare "topaz" entry would otherwise claim part of it.
const BY_PHRASE_LENGTH = [...POLISH_JEWELRY_GLOSSARY].sort((a, b) => b.polish.length - a.polish.length);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function translatePolish(text: string): { text: string; matches: GlossaryEntry[] } {
  let result = text;
  // A separate copy used only to decide whether a term is present. Once a
  // longer phrase matches (e.g. "różowy topaz"), its span is blanked out
  // here so a shorter entry contained within it (bare "topaz") doesn't
  // also register as its own match — including where the phrase happens
  // to translate into English text that itself contains the shorter word
  // ("różowy topaz" → "pink topaz" still contains "topaz").
  let scratch = text;
  const matches: GlossaryEntry[] = [];

  for (const entry of BY_PHRASE_LENGTH) {
    const pattern = escapeRegExp(entry.polish);
    if (new RegExp(pattern, "i").test(scratch)) {
      matches.push(entry);
      result = result.replace(new RegExp(pattern, "gi"), entry.english);
      scratch = scratch.replace(new RegExp(pattern, "gi"), (m) => " ".repeat(m.length));
    }
  }

  return { text: result, matches };
}
