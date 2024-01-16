module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    env: {browser: true, es2020: true},
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended"
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    plugins: [
        "react-refresh",
        "@typescript-eslint",
        "react",
        "react-hooks",
        "eslint-plugin-import",
        "prettier"
    ],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            {allowConstantExport: true}
        ],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {"ignoreRestSiblings": true}],
        "@typescript-eslint/no-explicit-any": 1,
        "react/jsx-filename-extension": [
            "warn",
            {
                "extensions": [
                    ".jsx",
                    ".tsx"
                ]
            }
        ],
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "no-shadow": ["error", {"builtinGlobals": false, "hoist": "functions", "allow": []}]
    },
    parserOptions: {
        "project": [
            "tsconfig.json"
        ],
        "ecmaVersion": 2020,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    }
};
