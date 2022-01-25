import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    clearMocks: true,
    testMatch: ['**/__tests__/**/*test.(ts|js)'],
};

export default config;
