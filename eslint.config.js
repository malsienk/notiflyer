// @ts-check
const eslint = require('@eslint/js');
const tsEslint = require('typescript-eslint');
const tsParser = require('@typescript-eslint/parser');

module.exports = tsEslint.config({
  files: ['src/*.ts'],
  extends: [eslint.configs.recommended, ...tsEslint.configs.recommended],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/prefer-for-of': 'off',
    curly: ['error', 'all'],
    'dot-notation': 'error',
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignorePattern: '^import .*;',
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-param-reassign': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-use-before-define': 'error',
    'no-void': ['error', { allowAsStatement: true }],
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
  },
});
