module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    PlayerControl: true,
    PluginCanvasES6: true,
  },
  plugins: ['vue'],
  extends: ['eslint-config-ali/vue', 'prettier', 'prettier/vue'],
  rules: {
    /* 0 = off, 1 = warn, 2 = error */
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
