const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    // 告诉 Jest 处理 `*.vue` 文件
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    // 支持源代码中相同的 `@` -> `src` 别名
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    // 用 `babel-jest` 处理 js
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    // 用 `vue-jest` 处理 `*.vue` 文件
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  // 解决错误：SecurityError: localStorage is not available for opaque origins
  "testURL": "http://localhost/",
  "testEnvironment": "jsdom",
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  // Option "mapCoverage" has been removed, as it's no longer necessary.
  // mapCoverage: true,
  coverageReporters: ["html", "text-summary"],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverage:true,
  collectCoverageFrom: [
    'src/test/specs/HelloWorld.spec.js',
    '!src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ]
}
