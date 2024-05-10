# ForSure Language Syntax and Semantics

## Introduction

The ForSure language provides a user-friendly and readable syntax for managing and manipulating project structures. This document describes the rules and semantics for creating file system hierarchies, importing files, and attaching attributes in the ForSure language.

## File System Hierarchies

A file system is defined using the `root` keyword followed by a hierarchical representation of folders and files. The file system definition is enclosed in curly braces `{}`. Here are the rules for creating file system hierarchies:

- Folders and files are represented as key-value pairs.
- The key is the folder or file name, represented as a string.
- The value can be another folder definition or a list of file names.
- Folder definitions are represented by enclosing the contents in curly braces `{}`.
- File lists are represented as comma-separated strings.

```
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
```

## Importing Files

The ForSure language supports importing external file systems using the `@import` directive. This allows for the inclusion of files and folders from other ForSure files. Here are the rules for importing files:

- Use the `@import` keyword followed by the file path in single or double quotes.
- The imported file system will be merged with the current file system.

```
@import 'external.fs';

root: {
  // folder and file definitions
}
```

## Attaching Attributes

Attributes can be attached to file and folder definitions using square brackets `[]`. Attributes provide additional metadata such as permissions, size, and types. Here are the rules for attaching attributes:

- Place the attributes within square brackets `[]`.
- Separate multiple attributes using commas `,`.
- Each attribute consists of a key-value pair, separated by a colon `:`.
- The attribute key is a string.
- The attribute value can be a string, number, boolean, or any other valid data type.

```
'file1.txt': [ size: '10KB', type: 'text' ]
```

## Conclusion

This document has described the rules and semantics for creating file system hierarchies, importing files, and attaching attributes in the ForSure language. Understanding these rules is crucial for effectively managing and manipulating project structures in ForSure. For more advanced language features and syntax, refer to the official ForSure documentation.