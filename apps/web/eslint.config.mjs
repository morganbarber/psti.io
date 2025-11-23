import config from '@psti/eslint-config/next.js';

const eslintConfig = [
    {
        ignores: ['.next/**', 'out/**', 'node_modules/**'],
    },
    ...config,
];

export default eslintConfig;
