## Data Types & Operations

The ForSure language provides a user-friendly and readable syntax for managing and manipulating project structures. This document outlines the data types and operations available in the ForSure language.

## Data Types

The ForSure language supports the following data types for representing file system elements:

- **Directory**: Represents a folder in the file system hierarchy.
- **File**: Represents a file within a directory.
- **Attributes**: Represents metadata associated with files and folders, such as permissions, size, type, etc.

## Operations

### Directory Operations

1. **Create Directory**: `createDirectory(directoryName)`
   
   Creates a new directory with the specified name.

2. **Remove Directory**: `removeDirectory(directoryName)`
   
   Deletes a directory and all its contents.

3. **List Contents**: `listContents(directoryName)`
   
   Lists all files and subdirectories within a directory.

4. **Move/Rename Directory**: `moveDirectory(oldDirectoryName, newDirectoryName)`
   
   Moves a directory to a new location or renames it.

### File Operations

1. **Create File**: `createFile(fileName, directoryName)`
   
   Creates a new file within a directory.

2. **Remove File**: `removeFile(fileName, directoryName)`
   
   Deletes a file from a directory.

3. **Read File Contents**: `readFile(fileName, directoryName)`
   
   Retrieves the contents of a file.

4. **Write to File**: `writeToFile(fileName, directoryName, content)`
   
   Updates or writes new content to a file.

### Attribute Operations

1. **Set Attribute**: `setAttribute(elementName, attributeName, attributeValue)`
   
   Sets or updates attributes for a file or directory.

2. **Get Attribute**: `getAttribute(elementName, attributeName)`
   
   Retrieves the value of a specific attribute for a file or directory.

3. **Remove Attribute**: `removeAttribute(elementName, attributeName)`
   
   Deletes an attribute from a file or directory.

## Conclusion

This document has documented the data types and operations available in the ForSure language for managing and manipulating file system elements. Understanding these data types and operations is essential for effectively working with project structures in ForSure. For more detailed information and examples, refer to the official ForSure documentation.
