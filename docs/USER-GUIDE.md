# ForSure User Guide

## Introduction

ForSure is a CLI tool for managing and visualizing project structure and metadata. It helps you define, visualize, and validate the structure of your projects. By ensuring that your project's files and directories conform to a specified structure, ForSure makes project management more predictable and less error-prone.

## Installation

To install ForSure globally via npm, use the following command:
```sh
npm install -g forsure-cli
To verify the installation:

Shell Script
Copy
forsure --version
Commands/Usage
Initialize a New Project
Create a new project with a basic template:

Shell Script
Copy
forsure new <project-name>
Example:

Shell Script
Copy
forsure new my-project
Run ForSure
Run ForSure to validate and visualize the project structure defined in a file:

Shell Script
Copy
forsure run <filename.fs>
Example:

Shell Script
Copy
forsure run project-structure.fs
List All Commands
To see all available commands, use:

Shell Script
Copy
forsure --help
Examples
Basic Example
Create a file with the following content:

Copy
root: {
  'index.html': [ size: '5KB', type: 'html' ],
  'style.css': [ size: '2KB', type: 'css' ],
  'script.js': [ size: '3KB', type: 'javascript' ]
}
Run ForSure to validate the structure:

Shell Script
Copy
forsure run basic.fs
Intermediate Example
Create a file:

Copy
root: {
  'src': {
    'index.ts': [ size: '10KB', type: 'typescript' ],
    'app': {
      'main.ts': [ size: '8KB', type: 'typescript' ],
      'util.ts': [ size: '4KB', type: 'typescript' ]
    }
  },
  'styles': {
    'main.css': [ size: '3KB', type: 'css' ],
    'theme.css': [ size: '2KB', type: 'css' ]
  },
  'README.md': [ size: '1KB', type: 'markdown' ]
}
Validate with:

Shell Script
Copy
forsure run intermediate.fs
Advanced Example
For modular design using imports, create a file:

Copy
root: {
  'common': {
    'config.json': [ size: '2KB', type: 'json' ],
    'utils': {
      'helpers.js': [ size: '3KB', type: 'javascript' ]
    }
  }
}
Create another file with the following:

Copy
@import 'common.fs';
root: {
  'src': {
    'index.js': [ size: '10KB', type: 'javascript' ],
    'components': {
      'header.js': [ size: '5KB', type: 'javascript' ],
      'footer.js': [ size: '5KB', type: 'javascript' ]
    }
  },
  'assets': {
    'logo.png': [ size: '15KB', type: 'image' ]
  }
}
Validate with:

Shell Script
Copy
forsure run advanced.fs
Best Practices
Verify before committing: Always verify your project structure definitions before committing.
Consistency: Use clear and consistent naming conventions.
Modularity: Modularize structures into separate files for larger projects.
Documentation: Document attributes and their expected values at the beginning of your files.
Troubleshooting
Common Issues
Invalid Command: Ensure that you are using the correct command syntax.
Missing File: Verify that the file path in the command is correct.
Validation Errors: Review the error messages for details on what's incorrect and adjust your file accordingly.
Getting Help
For further assistance, refer to the official documentation or check out the community forums and support channels.

Conclusion
ForSure is a powerful tool to manage project structures consistently. By following this user guide, you can effectively utilize ForSure to simplify and standardize your project management process.

Copy

This `USER-GUIDE.md` provides a comprehensive guide for users on how to install, use, and troubleshoot the ForSure CLI tool. It includes examples from basic to advanced usage, best practices, and common troubleshooting tips.