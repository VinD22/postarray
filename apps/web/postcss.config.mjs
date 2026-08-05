/** Tailwind v4 runs as a PostCSS plugin. There is no tailwind.config file: the
 *  theme lives in `@relay/design-system` as `@theme` tokens in CSS. */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
