module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
    sourceType: 'module',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  // ignorePatterns: ['node_modules', '*.config.js', 'build', 'dist'],
  rules: {
    // defined the common lint rules
    /**
     * basic rules
     */
    // https://eslint.org/docs/rules/no-unused-vars
    '@typescript-eslint/no-unused-vars': ['error'],

    /**
     * typescript
     */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-use-before-define': 'warn',

    /**
     * import
     */
    // 'import/no-extraneous-dependencies': ['error'],
    // 'import/no-self-import': 'error',
    // 'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    // 'import/prefer-default-export': 'off',
  },
  overrides: [],
  ignorePatterns: ['dist', 'node_modules'],
};
