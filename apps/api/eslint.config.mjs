import config from '@psti/eslint-config/node.js';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
    },
    ...config,
    {
        files: ['**/*.ts'],
        rules: {
            // NestJS specific rules
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
];
