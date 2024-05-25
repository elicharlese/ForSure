# OFFICIAL-LANGUAGE-DOCUMENTATION.md

## Introduction

The ForSure language provides a user-friendly and readable syntax for managing and manipulating project structures. It is designed to be easy to use, extensible, and reliable, making it suitable for developers and non-developers alike. This document covers the setup process, syntax guide, and a reference for the standard library.

## Features

- **Hierarchical Structure**: Represents file systems as a collection of folders and files.
- **Comments and Annotations**: Allows for descriptive purposes.
- **Import Directives**: Facilitates inclusion of reusable structures.
- **Custom Attributes**: Extends elements with user-defined metadata.
- **Readable Syntax**: Easy to understand and use.
- 
## Setup

To start using the ForSure language, follow the setup instructions below:

### Installation

1. **Install ForSure CLI**: The ForSure command-line interface (CLI) can be installed via npm or another package manager. Run the following command:
    ```sh
    npm install -g forsure-cli
    ```
2. **Verify Installation**: Ensure the installation was successful by checking the version:
    ```sh
    forsure --version
    ```
3. **Create a New ForSure Project**: Use the CLI to create a new project:
    ```sh
    forsure new my-project
    ```
4. **Navigate to Project Directory**: Move to your project directory:
    ```sh
    cd my-project
    ```
5. **Run ForSure**: Start using the ForSure language in your project:
    ```sh
    forsure run
    ```
With these steps, you should be ready to define and manage your project structures using ForSure.

## Syntax Guide

The ForSure language uses a concise and readable syntax for defining file systems. Below are the core syntax elements:

### File System Representation

The root of the file system is defined using the `root` keyword, followed by a hierarchical representation of folders and files enclosed in curly braces `{}`.

```forsure
root: {
  // folder and file definitions
}
```
## Folder and File Definitions

Folders and files are defined within the root. Each folder and file is a key-value pair where the key is the name and the value is either another folder definition or a list of file names.

root: {
  'folder1': {
    'file1.txt',
    'file2.txt'
  },
  'folder2': {
    'subfolder1': {
      'file3.txt'
    },
    'file4.txt'
  }
}

## Attributes

Attributes provide metadata for files and folders such as size, type, and permissions. They are enclosed in square brackets [] and are attached to the file or folder name.

'file1.txt': [ size: '10KB', type: 'text' ]
Importing External File Systems
For modular project structures, use the @import directive to include files and folders from other ForSure files.

@import 'external.fs';
root: {
  // folder and file definitions
}

## Comments and Annotations

ForSure allows inline comments using the // syntax for descriptive purposes.

root: {
  'folder1': { // Main folder
    'file1.txt', // Text file
    'file2.txt': [ size: '5KB', type: 'text' ] // Another text file with attributes
  }
}

## Standard Library Reference

The ForSure standard library includes several built-in attributes and directives for common use cases.

Attributes
size
Specifies the size of a file.

'file1.txt': [ size: '10KB' ]
type
Specifies the type of a file.

'file1.txt': [ type: 'text' ]
permissions
Specifies permissions for a file or folder.

'file1.txt': [ permissions: 'read-only' ]
Directives
@import
Imports an external file system definition.

@import 'external.fs';
Example
Bringing it all together, here’s a final example showcasing various features:

@import 'common.fs';
root: {
  'src': {
    'main': {
      'app.js': [ size: '15KB', type: 'javascript' ],
      'index.html': [ size: '5KB', type: 'html' ]
    },
    'styles': {
      'style.css': [ size: '3KB', type: 'css' ]
    }
  },
  'README.md': [ size: '2KB', type: 'markdown' ]
}

## Conclusion

With this guide, you should have a comprehensive understanding of the ForSure language's setup, syntax, and standard library. For more advanced topics, refer to the official documentation and community resources.