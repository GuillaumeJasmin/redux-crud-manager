module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "extends": "airbnb-base",
  "rules": {
    "import/no-extraneous-dependencies": 0,
    "arrow-parens": 0,
    "no-console": [2, { "allow": ["warn", "error"] }],
    "max-len": 0,
    "object-curly-newline": ["error", { minProperties: 8, multiline: true, consistent: true}],
  },
  "settings": {
    "import/resolver": {
      "webpack": "webpack.config.js"
    }
  }
}
