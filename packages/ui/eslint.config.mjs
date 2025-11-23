import config from '@psti/eslint-config/next.js';

const eslintConfig = [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    ...config,
];

export default eslintConfig;
