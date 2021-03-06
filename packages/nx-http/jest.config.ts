/* eslint-disable */
export default {
  displayName: 'nx-http',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/nx-http',
  coverageReporters: ['html', 'lcov'],
  testEnvironment: 'node'
};
