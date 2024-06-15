# ForSure Documentation

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [Understanding the File Structure](#understanding-the-file-structure)
- [Core Features](#core-features)
  - [Hierarchical Structure](#hierarchical-structure)
  - [Comments and Annotations](#comments-and-annotations)
  - [Custom Attributes](#custom-attributes)
- [Advanced Features](#advanced-features)
  - [@import Directives](#import-directives)
  - [Modularization](#modularization)
  - [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Additional Resources](#additional-resources)

## Introduction

ForSure is a CLI tool designed to manage and visualize project structures and metadata. It enables developers to define, visualize, and validate project structures, ensuring that files and directories conform to a specified format. By maintaining a consistent project structure, ForSure simplifies project management and reduces errors.

## Getting Started

### Installation

To install ForSure globally via npm, use the following command:
```sh
npm install -g forsure-cli
To verify the installation:

Shell Script
Copy
Insert
forsure --version
Basic Usage
Initialize a New Project:

Shell Script
Copy
Insert
forsure new <project-name>
Run ForSure:

Shell Script
Copy
Insert
forsure run <filename.forsure>
List All Commands:

Shell Script
Copy
Insert
forsure --help
Understanding the File Structure
A ForSure file (
.forsure
) defines the structure of a project using a clean, human-readable syntax. The structure is defined hierarchically, allowing for nested directories and files. Here is an example:

Copy
Insert
root: {
  'src': {
    'index.js': [ size: '2KB', type: 'javascript' ],
    'styles': {
      'main.css': [ size: '1KB', type: 'css' ]
    }
  },
  'README.md': [ size: '1KB', type: 'markdown' ]
}
Core Features
Hierarchical Structure
ForSure uses a hierarchical structure to represent files and directories:

Copy
Insert
root: {
  'index.html': [ size: '5KB', type: 'html' ],
  'style.css': [ size: '2KB', type: 'css' ],
  'script.js': [ size: '3KB', type: 'javascript' ]
}
Comments and Annotations
You can add comments and annotations in 
.forsure
 files for documentation purposes:

Copy
Insert
root: {
  'styles': {
    'main.css': [ size: '3KB', type: 'css', description: 'Main stylesheet' ] # Main stylesheet for the project
  }
}
Custom Attributes
Extend elements with user-defined attributes like permissions, sizes, and types:

Copy
Insert
root: {
  'index.html': [ size: '5KB', type: 'html', permissions: 'rw-r--r--' ]
}
Advanced Features
@import Directives
Use @import directives to include reusable structures:

Copy
Insert
@import 'common.forsure';
root: {
  'src': {
    'index.js': [ size: '10KB', type: 'javascript' ]
    }
  }
}
Modularization
For large projects, break down your ForSure definitions into modular files:

Copy
Insert
common.forsure
root: {
  'common': {
    'config.json': [ size: '2KB', type: 'json' ]
  }
}

project.forsure
@import 'common.forsure';
root: {
  'src': {
    'main.js': [ size: '3KB', type: 'javascript' ]
  }
}
Error Handling
ForSure provides error handling mechanisms such as customizable error messages and input validation:

Shell Script
Copy
Insert
# Custom error message for missing file
Error: File 'src/main.js' not found in defined structure.
Configuration
ForSure can be configured via a configuration file (
forsure.config.json
):

JSON
Copy
Insert
{
  "maxFileSize": "10MB",
  "allowedFileTypes": ["javascript", "html", "css"]
}
Place the 
forsure.config.json
 file in the root directory of your project to apply custom configurations.

Best Practices
Verify before committing: Always verify your project structure definitions before committing.
Consistency: Use clear and consistent naming conventions.
Modularity: Modularize structures into separate files for larger projects.
Documentation: Document attributes and their expected values at the beginning of your files.
Additional Resources
Official Documentation
Community Forums
GitHub Repository
Tutorial Videos
Community Support
Copy
Insert

This `DOCUMENTATION.md` file provides a comprehensive overview of the ForSure project, including core and advanced features, configuration, best practices, and additional resources. Use this guide to get started, understand the ForSure language, and effectively manage your project structures.