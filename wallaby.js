module.exports = function () {
  process.env.NODE_ENV = 'test';
  return {
    files: [
      'src/data/*.json',
      'tsconfig.json',
      'package.json',
      { pattern: 'src/**/*.ts', load: false },
      { pattern: 'test/**/*test.ts', ignore: true },
    ],
    tests: [{ pattern: 'test/**/*test.ts' }],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'jest',

    debug: true,
  };
};
