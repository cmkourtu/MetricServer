module.exports = {
    extends: ["airbnb-base", "plugin:node/recommended"],
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    rules: {
        "import/prefer-default-export": "off",
        "no-param-reassign": "off",
        "no-underscore-dangle": "off",
        complexity: ["error", {max: 8}],
        "max-depth": ["error", {max: 3}],
        "node/exports-style": ["error", "module.exports"],
        "node/file-extension-in-import": ["error", "never"],
        "func-names": ["error", "never"],
    },
    plugins: ["prettier", "node"],
    extends: ["plugin:prettier/recommended"],
};
