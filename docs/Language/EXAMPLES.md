# ForSure Loop Notation

## Bare-Minimum Notation

The bare-minimum notation is the most concise form of expressing the `ForSure` loop, omitting all optional syntax and focusing solely on the necessary components for iteration.

### Code Example

```typescript
// Bare-Minimum notation for a .gitignore example
root: [
  "pages/index.ts",
  "pages/_app.ts",
  "pages/_document.ts",
  "src/blockchain/rust/Cargo.toml",
  "src/blockchain/rust/src/mod.rs",
  "src/blockchain/rust/src/blockchain_and_transaction.rs",
  "src/api/user.ts",
  "src/api/transaction.ts",
  "tsconfig.json",
  "configurations.json",
  "package.json",
  "yarn.lock",
  "DOCS.md",
  ".env.local",
  ".env.production",
  ".gitignore",
];
```

## Short-Hand Notation

Short-hand notation introduces inline comments or annotations that provide additional context but are not as verbose as long-hand notation.

### Code Example

```typescript
// Short-Hand notation for a .gitignore example with basic comments
root: {
  'pages': ['index.ts', '_app.ts', '_document.ts'], // Next.js pages
  'src': {
    'blockchain/rust': ['Cargo.toml', 'src/mod.rs', 'src/blockchain_and_transaction.rs'], // Rust blockchain code
    'api': ['user.ts', 'transaction.ts'] // API routes
  },
  'configFiles': ['tsconfig.json', 'configurations.json', 'package.json', 'yarn.lock'],
  'docs': ['DOCS.md'],
  'env': ['.env.local', '.env.production'],
  'ignore': ['.gitignore']
}
```

## Long-Hand Notation

Long-hand notation is the most descriptive form. It uses a more structured format with detailed comments explaining each item’s purpose.

### Code Example

```typescript
// Long-Hand Notation providing detailed comments for each file and directory.
root: {
  'pages': { // Next.js specific directories
    'index.ts': "Landing page, updated from .tsx to .ts",
    '_app.ts': "Custom App component, updated from .tsx to .ts",
    '_document.ts': "Custom Document to modify html and body tags, removed .tsx extension"
  },
  'src': { // Application source code
    'blockchain': {
      'rust': { // Blockchain related code has been restructured
        'Cargo.toml': "Rust package manifest",
        'src': {
          'mod.rs': "Rust module declaration",
          'blockchain_and_transaction.rs': "Combined Blockchain and Transaction implementation"
        }
      }
    },
    'api': { // API directory has been kept as instructed
      'user.ts': "API route for user actions",
      'transaction.ts': "API route for transaction actions"
    }
  },
  'configFiles': {
    'tsconfig.json': "TypeScript configuration",
    'configurations.json': "Project configuration settings",
    'package.json': "NPM package manifest",
    'yarn.lock': "Yarn lockfile for dependencies"
  },
  'docs': {
    'DOCS.md': "Documentation in markdown"
  },
  'env': {
    '.env.local': "Local environment variables",
    '.env.production': "Production environment variables"
  },
  'ignore': {
    '.gitignore': "Specifies intentionally untracked files to ignore"
  }
}
```

Each notation serves a different level of conciseness and detail, accommodating various use cases from quick glances to comprehensive exploration of the loop content.
