# ForSure CLI Guide

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Available Commands](#available-commands)
  - [`forsure new`](#forsure-new)
  - [`forsure run`](#forsure-run)
  - [`forsure --help`](#forsure-help)
  - [`forsure --version`](#forsure-version)
- [Usage Examples](#usage-examples)
  - [Creating a New Project](#creating-a-new-project)
  - [Running ForSure](#running-forsure)
  - [Listing All Commands](#listing-all-commands)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Introduction

ForSure is a CLI tool that helps you manage and visualize project structures and metadata. By defining, visualizing, and validating your project's structure with ForSure, you can make project management more predictable and less error-prone.

## Installation

To install ForSure globally using npm, run:
```sh
npm install -g forsure-cli
To verify the installation, check the version:

Shell Script
Copy
Insert
forsure --version
Available Commands
forsure new
Description: Create a new project with a basic template.

Usage:

Shell Script
Copy
Insert
forsure new <project-name>
forsure run
Description: Validate and visualize the project structure defined in a file.

Usage:

Shell Script
Copy
Insert
forsure run <filename.forsure>
forsure --help
Description: Display help information for the ForSure CLI tool.

Usage:

Shell Script
Copy
Insert
forsure --help
forsure --version
Description: Display the current version of the ForSure CLI tool.

Usage:

Shell Script
Copy
Insert
forsure --version
Usage Examples
Creating a New Project
To create a new project named "my-project", run:

Shell Script
Copy
Insert
forsure new my-project
Running ForSure
To validate and visualize the project structure defined in 
project-structure.forsure
, run:

Shell Script
Copy
Insert
forsure run project-structure.forsure
Listing All Commands
To see all available commands, run:

Shell Script
Copy
Insert
forsure --help
Configuration
ForSure can be configured using a configuration file (
forsure.config.json
). Below is an example configuration:

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
Verify Before Committing: Always run forsure to verify your project structure definitions before committing them.
Consistency: Use clear and consistent naming conventions for files and directories.
Modularity: Break down large structures into modular 
.forsure
 files and use @import directives.
Documentation: Document your 
.forsure
 files with comments and annotations.
Troubleshooting
Common Issues
Invalid Command: Ensure you are using the correct command syntax.
Missing File: Verify that the file path you provided is correct.
Validation Errors: Review the error messages provided by ForSure and adjust your 
.forsure
 file accordingly.
Getting Help
If you encounter issues that you cannot resolve, refer to the official documentation or seek help in the community forums.

Additional Resources
Official Documentation
Community Forums
GitHub Repository
Tutorial Videos
Community Support
This 
CLI-GUIDE.md
 provides comprehensive instructions for installing, using, and configuring the ForSure CLI tool. By following this guide, you can effectively utilize ForSure to manage and visualize your project structures.

Copy
Insert

This `CLI-GUIDE.md` file provides a complete guide for users on how to install, use, and configure the ForSure CLI tool. It includes available commands, usage examples, configuration options, best practices, troubleshooting tips, and additional resources for further assistance.