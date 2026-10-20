import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...next,
  ...typescript,
  globalIgnores(['.next/**', 'src/generated/**', '.data/**']),
  { rules: { '@next/next/no-img-element': 'off', 'react-hooks/set-state-in-effect': 'off' } },
]);
