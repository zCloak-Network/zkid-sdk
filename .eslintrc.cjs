
const base = require('@zcloak/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  rules: {
    ...base.rules,
    'import-newlines/enforce': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    'operator-linebreak': 'off',
    'simple-import-sort/imports': [
      2,
      {
        groups: [
          ['^\u0000'], // all side-effects (0 at start)
          ['\u0000$', '^@zcloak.*\u0000$', '^\\..*\u0000$'], // types (0 at end)
          ['^[^/\\.]'],
          ['^@zcloak'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
        ]
      }
    ],
  }
};
