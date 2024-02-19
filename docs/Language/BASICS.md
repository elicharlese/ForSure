SYNTAX.md:

# ForSure Language Syntax and Semantics

## Introduction

The ForSure language provides a user-friendly and readable syntax for managing and manipulating project structures. This document defines the basic keywords, symbols, and constructs of the ForSure language.

## Keywords

The ForSure language includes the following keywords:

- `root`: Specifies the root of the file system definition.
- `@import`: Imports an external file system definition.

## Symbols

The ForSure language uses the following symbols:

- `:`: Separates the key (folder or file name) from its corresponding value (folder definition, file list, or attributes).
- `,`: Separates multiple values within a folder definition or file list.
- `[]`: Encloses attributes attached to file and folder definitions.

## Constructs

The ForSure language includes the following constructs:

### File System Definition

The file system is defined using the `root` keyword followed by a hierarchical representation of folders and files. The file system definition is enclosed in curly braces `{}`.

```
root: {
  // folder and file definitions
}
```

### Folder Definition

A folder definition consists of a folder name followed by its contents. Contents can include another folder definition or a list of file names.

```
'folder1': {
  // contents
}
```

### File List

A file list contains a comma-separated list of file names. File names are represented as strings.

```
'folder1': {
  'file1.txt',
  'file2.txt'
}
```

### Attributes

Attributes can be attached to file and folder definitions using square brackets `[]`. Attributes provide additional metadata such as permissions, size, and types.

```
'file1.txt': [ size: '10KB', type: 'text' ]
```

### Importing External File Systems

Modularity is supported in the ForSure language through the use of the `@import` directive. This directive allows the inclusion of files and folders from other ForSure files.

```
@import 'external.fs';

root: {
  // folder and file definitions
}
```

## Conclusion

This document has defined the basic keywords, symbols, and constructs of the ForSure language. Understanding these elements is essential for effectively using and manipulating project structures in ForSure. Refer to the official ForSure documentation for more advanced language features and syntax.
