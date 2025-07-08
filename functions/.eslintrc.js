// Import necessary modules for the flat config system
const js = require("@eslint/js"); // Contains eslint:recommended
const tseslint = require("@typescript-eslint/eslint-plugin"); // TypeScript plugin
const tsParser = require("@typescript-eslint/parser"); // TypeScript parser
const importPlugin = require("eslint-plugin-import"); // Import plugin
const globals = require("globals"); // For pre-defined global sets like 'node', 'browser', etc.

// The root of a flat config file is an array of config objects.
module.exports = [
  // 1. ESLint's base recommended rules for all JavaScript code
  // This replaces "eslint:recommended" from your old extends array.
  js.configs.recommended,
  // 2. General configuration for all files (JavaScript and TypeScript)
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"], // Apply this configuration to these file types
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022, // Use modern ECMAScript features (e.g., ES2022)
        sourceType: "module", // Use ES Modules
      },
      // Global variables for the Node.js environment (replaces old 'env: { node: true }')
      globals: {
        ...globals.node, // Provides common Node.js global variables (process, Buffer, __dirname, etc.)
      },
    },
    // Define plugins available for this configuration object
    plugins: {
      "@typescript-eslint": tseslint,
      "import": importPlugin,
    },
    // Define rules for this configuration object
    rules: {
      // Keep your existing rules
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      // Basic import rules from 'eslint-plugin-import' (partially replaces plugin:import/errors, warnings)
      "import/no-unresolved": 0, // Often disabled when using TypeScript with a resolver, if you want TS to handle it
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-named-as-default": "warn",
      "import/no-named-as-default-member": "warn",
      "import/no-duplicates": "error",
      "import/no-self-import": "error",
      "import/no-cycle": "error",
      "import/no-unused-modules": "warn",
      "import/no-absolute-path": "error",
      "import/no-dynamic-require": "error",
      "import/no-relative-packages": "error",
      "import/no-deprecated": "warn",
      "import/no-extraneous-dependencies": "warn",
      "import/no-mutable-exports": "error",
      "import/no-named-default": "warn",
      "import/no-useless-path-segments": "warn",
    },
    // Global ignore patterns for the entire project (replaces old 'ignorePatterns')
    ignores: [
      "/lib/**/*", // Ignore built files.
      "/generated/**/*", // Ignore generated files.
    ],
  },
  // 3. TypeScript-specific configuration
  // This replaces your 'overrides' block for TypeScript files and "plugin:@typescript-eslint/recommended"
  {
    files: ["**/*.ts", "**/*.tsx"], // ONLY apply these settings to TypeScript files
    languageOptions: {
      parser: tsParser, // Use the TypeScript ESLint parser for these files
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.dev.json"], // Specify TypeScript project for type-aware linting
        sourceType: "module",
        ecmaVersion: 2022,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint, // Ensure TypeScript plugin is available for these files
      "import": importPlugin, // Ensure import plugin is available for these files (for import/typescript)
    },
    rules: {
      // Equivalent to "plugin:@typescript-eslint/recommended"
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off", // Disable no-explicit-any rule, as per your original config
    },
  },
];
