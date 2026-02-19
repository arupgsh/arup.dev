export type Publication = {
  title: string;
  authors: string[];
  journal: string;
  year: string;
};

const stripOuterDelimiters = (value: string) => {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const decodeLatexEscapes = (value: string) => {
  const accentCombiningMarks: Record<string, string> = {
    "`": "\u0300",
    "'": "\u0301",
    "^": "\u0302",
    "~": "\u0303",
    "=": "\u0304",
    "u": "\u0306",
    ".": "\u0307",
    '"': "\u0308",
    "r": "\u030A",
    "H": "\u030B",
    "v": "\u030C",
    "c": "\u0327",
    "k": "\u0328",
    "b": "\u0331",
  };

  const accentLiteral: Record<string, string> = {
    "`": "`",
    "'": "'",
    "^": "^",
    "~": "~",
    "=": "=",
    "u": "",
    ".": ".",
    '"': '"',
    "r": "",
    "H": "",
    "v": "",
    "c": "",
    "k": "",
    "b": "",
  };

  return value
    .replace(
      /\\([`'^~=.u"rHvcbk])\s*\{\s*\}/g,
      (_, accent: string) => accentLiteral[accent] ?? ""
    )
    .replace(
      /\\([`'^~=.u"rHvcbk])\s*\{?\s*([A-Za-z])\s*\}?/g,
      (_, accent: string, letter: string) =>
        `${letter}${accentCombiningMarks[accent] ?? ""}`
    )
    .replace(/\\ae/g, "æ")
    .replace(/\\AE/g, "Æ")
    .replace(/\\oe/g, "œ")
    .replace(/\\OE/g, "Œ")
    .replace(/\\aa/g, "å")
    .replace(/\\AA/g, "Å")
    .replace(/\\o/g, "ø")
    .replace(/\\O/g, "Ø")
    .replace(/\\ss/g, "ß")
    .replace(/\\l/g, "ł")
    .replace(/\\L/g, "Ł")
    .replace(/\\i/g, "i")
    .replace(/\\j/g, "j")
    .replace(/\\([{}$%&_#])/g, "$1")
    .replace(/\\\\/g, " ")
    .replace(/\\/g, "")
    .normalize("NFC");
};

const normalizeValue = (value: string) => {
  let normalized = stripOuterDelimiters(value);

  while (normalized !== stripOuterDelimiters(normalized)) {
    normalized = stripOuterDelimiters(normalized);
  }

  return decodeLatexEscapes(normalized).replace(/\s+/g, " ").trim();
};

const splitAuthors = (authorValue: string) =>
  normalizeValue(authorValue)
    .split(/\sand\s/i)
    .map(author => author.trim())
    .filter(Boolean);

const parseFields = (entryBody: string) => {
  const fields: Record<string, string> = {};
  const bodyLength = entryBody.length;
  let index = 0;

  while (index < bodyLength) {
    while (index < bodyLength && /\s|,/.test(entryBody[index]!)) {
      index += 1;
    }

    if (index >= bodyLength) {
      break;
    }

    const keyStart = index;
    while (index < bodyLength && /[a-zA-Z0-9_-]/.test(entryBody[index]!)) {
      index += 1;
    }

    const key = entryBody.slice(keyStart, index).trim().toLowerCase();

    while (index < bodyLength && /\s/.test(entryBody[index]!)) {
      index += 1;
    }

    if (entryBody[index] !== "=") {
      while (index < bodyLength && entryBody[index] !== ",") {
        index += 1;
      }
      continue;
    }

    index += 1;

    while (index < bodyLength && /\s/.test(entryBody[index]!)) {
      index += 1;
    }

    let value = "";

    if (entryBody[index] === "{") {
      let depth = 0;
      const valueStart = index;

      while (index < bodyLength) {
        if (entryBody[index] === "{") {
          depth += 1;
        } else if (entryBody[index] === "}") {
          depth -= 1;
          if (depth === 0) {
            index += 1;
            break;
          }
        }
        index += 1;
      }

      value = entryBody.slice(valueStart, index);
    } else if (entryBody[index] === '"') {
      const valueStart = index;
      index += 1;

      while (index < bodyLength) {
        if (entryBody[index] === '"' && entryBody[index - 1] !== "\\") {
          index += 1;
          break;
        }
        index += 1;
      }

      value = entryBody.slice(valueStart, index);
    } else {
      const valueStart = index;
      while (index < bodyLength && entryBody[index] !== ",") {
        index += 1;
      }
      value = entryBody.slice(valueStart, index);
    }

    if (key) {
      fields[key] = normalizeValue(value);
    }

    while (index < bodyLength && entryBody[index] !== ",") {
      index += 1;
    }

    if (entryBody[index] === ",") {
      index += 1;
    }
  }

  return fields;
};

const parseEntries = (bibtex: string) => {
  const entries: Record<string, string>[] = [];
  const source = bibtex ?? "";
  let index = 0;

  while (index < source.length) {
    const atIndex = source.indexOf("@", index);
    if (atIndex === -1) {
      break;
    }

    let openBraceIndex = source.indexOf("{", atIndex);
    if (openBraceIndex === -1) {
      break;
    }

    let depth = 1;
    let cursor = openBraceIndex + 1;

    while (cursor < source.length && depth > 0) {
      if (source[cursor] === "{") {
        depth += 1;
      } else if (source[cursor] === "}") {
        depth -= 1;
      }
      cursor += 1;
    }

    if (depth !== 0) {
      break;
    }

    const rawEntryBody = source.slice(openBraceIndex + 1, cursor - 1);
    const firstComma = rawEntryBody.indexOf(",");

    if (firstComma !== -1) {
      const fieldsBody = rawEntryBody.slice(firstComma + 1);
      const parsedFields = parseFields(fieldsBody);
      if (Object.keys(parsedFields).length > 0) {
        entries.push(parsedFields);
      }
    }

    index = cursor;
  }

  return entries;
};

export const parseBibtexPublications = (bibtex: string): Publication[] => {
  return parseEntries(bibtex)
    .map(fields => {
      const title = fields.title ? normalizeValue(fields.title) : "";
      const authors = fields.author ? splitAuthors(fields.author) : [];
      const journal = normalizeValue(fields.journal || fields.booktitle || "");
      const yearMatch = normalizeValue(fields.year || "").match(/\d{4}/);

      return {
        title,
        authors,
        journal,
        year: yearMatch?.[0] ?? "",
      };
    })
    .filter(publication => publication.title.length > 0);
};
