module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [0],
    'body-max-line-length': [0]
  },
  ignores: [
    (commit) => {
      // WIP: commits
      return /^WIP(:\s(.|\n)+)?$/.test(commit.trim())
    },
    (commit) => {
      // $ npm version commits (1.1.0)
      return /^\d+\.\d+\.\d+.*$/.test(commit.trim())
    }
  ]
}
