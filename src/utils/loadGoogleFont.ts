import fs from "fs/promises";
import path from "path";

async function loadGoogleFont(
  font: string,
  _text: string,
  weight: number
): Promise<ArrayBuffer> {
  // Read font binaries from the installed local font packages.
  const fontMap: Record<string, Record<number, string>> = {
    Inter: {
      400: "inter-latin-400-normal.woff2",
      500: "inter-latin-500-normal.woff2",
      600: "inter-latin-600-normal.woff2",
      700: "inter-latin-700-normal.woff2",
    },
    "JetBrains+Mono": {
      400: "jetbrains-mono-latin-400-normal.woff2",
      700: "jetbrains-mono-latin-700-normal.woff2",
    },
  };

  const repoRoot = path.resolve(".");
  const map = fontMap[font];
  if (!map || !map[weight]) {
    throw new Error(`Unsupported font request: ${font} ${weight}`);
  }

  const packageName = font === "Inter" ? "inter" : "jetbrains-mono";
  const fontPackageRoot = path.join(repoRoot, "node_modules", ["@", "font", "source"].join(""));
  const filePath = path.join(
    fontPackageRoot,
    packageName,
    "files",
    map[weight]
  );

  const data = await fs.readFile(filePath);
  return new Uint8Array(data).buffer;
}

async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "JetBrains Mono",
      font: "JetBrains+Mono",
      weight: 400,
      style: "normal",
    },
    {
      name: "JetBrains Mono",
      font: "JetBrains+Mono",
      weight: 700,
      style: "bold",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, font, weight, style }) => {
      const data = await loadGoogleFont(font, text, weight);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadGoogleFonts;
