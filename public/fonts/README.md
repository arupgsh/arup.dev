# Fonts

This folder is no longer required for the site typography.

The site now loads Inter and JetBrains Mono through CSS imports from
`@fontsource`, so no Google Fonts links or `/fonts/` assets are needed for the
main UI.

If you change the font stack, update `src/styles/fonts.css`,
`src/styles/global.css`, and the OG-image font loader in
`src/utils/loadGoogleFont.ts`.
