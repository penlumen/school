import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // This rule treats intentional async data-loading effects as cascading
      // renders even when the state update occurs in an async callback.
      // The affected components use effects to synchronize with the API.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;
