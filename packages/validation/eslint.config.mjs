import config from '@psti/eslint-config/node.js';

const eslintConfig = [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    ...config,
];

export default eslintConfig;
