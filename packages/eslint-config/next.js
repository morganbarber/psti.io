import { fixupConfigRules } from '@eslint/compat';
import nextPlugin from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';

export default [
    ...fixupConfigRules(nextPlugin),
    prettierConfig,
];
