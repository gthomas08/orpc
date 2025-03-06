import antfu from '@antfu/eslint-config'
import pluginBan from 'eslint-plugin-ban'

export default antfu({
  react: true,
  formatters: true,
}, {
  plugins: { ban: pluginBan },
  rules: {
    'ts/consistent-type-definitions': 'off',
    'react-refresh/only-export-components': 'off',
    'react/prefer-destructuring-assignment': 'off',
    'react/no-context-provider': 'off',
    'ts/method-signature-style': ['off'],
    'ban/ban': [
      'error',
      {
        name: ['JSON', 'stringify'],
        message: 'JSON.stringify can return undefined, use stringifyJSON instead',
      },
    ],
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['json-schema-typed', 'json-schema-typed/*'],
        message: 'Please import from @orpc/openapi instead',
      }],
    }],
  },
}, {
  files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test-d.ts', '**/*.test-d.tsx', 'apps/content/shared/**', 'playgrounds/**', 'packages/*/playground/**'],
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'antfu/no-top-level-await': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'no-alert': 'off',
    'ban/ban': 'off',
  },
}, {
  files: ['apps/content/shared/**', 'apps/content/docs/**', 'apps/content/examples/**', 'playgrounds/**', 'packages/*/playground/**'],
  rules: {
    'no-console': 'off',
    'perfectionist/sort-imports': 'off',
    'import/first': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'ban/ban': 'off',
  },
}, {
  files: ['apps/content/examples/**'],
  rules: {
    'import/first': 'off',
  },
}, {
  files: ['playgrounds/**'],
  rules: {
    'no-alert': 'off',
  },
})
