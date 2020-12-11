module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    // warnOnUnsupportedTypeScriptVersion: false,
    sourceType: 'module',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    // defined the common lint rules
    /**
     * basic rules
     */
    'prettier/prettier': 'error',
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
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          ['sibling', 'index'],
        ],
        'newlines-between': 'always',
        // alphabetize: {
        //   caseInsensitive: true,
        //   order: 'asc',
        // },
      },
    ],
    'import/exports-last': 'error',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        vue: 'never',
      },
    ],
    'import/first': 'error',
    'import/group-exports': 'off',
    'import/newline-after-import': 'error',
    // 'import/no-extraneous-dependencies': ['error'],
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    // 'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    // 'import/prefer-default-export': 'off',
    'import/no-absolute-path': 'error',
    'import/no-internal-modules': [
      'error',
      {
        allow: ['src/*'],
      },
    ],
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-default': 'error',
    'import/no-named-export': 'off',
    'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],
    'import/no-webpack-loader-syntax': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        // devDependencies: ["*.js", "src/**/*.test.js"],
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true,
        bundledDependencies: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    // 'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
      // 'babel-module': {},
      // node: {
      //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // },
    },
  },
  // overrides: [],
  // ignorePatterns: ['dist', 'node_modules'],
};
