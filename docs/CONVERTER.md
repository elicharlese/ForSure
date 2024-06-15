# ForSure Converter Guide

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Supported Formats](#supported-formats)
- [Usage](#usage)
  - [Basic Conversion](#basic-conversion)
  - [Conversion Options](#conversion-options)
- [Examples](#examples)
  - [Convert JSON to ForSure](#convert-json-to-forsure)
  - [Convert ForSure to YAML](#convert-forsure-to-yaml)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Introduction

The ForSure converter tool allows you to convert project structure definitions between different formats, including ForSure, JSON, and YAML. This can be useful for integrating ForSure with other tools and systems that use different configuration formats.

## Installation

To install the ForSure converter globally via npm, use the following command:
```sh
npm install -g forsure-converter
Supported Formats
ForSure (
.forsure
)
JSON (
.json
)
YAML (
.yaml
)
Usage
Basic Conversion
To convert a project structure definition from one format to another, use the following command:

Shell Script
Copy
Insert
forsure-converter convert <input-file> <output-file>
Conversion Options
You can specify additional options to customize the conversion process:

Shell Script
Copy
Insert
forsure-converter convert <input-file> <output-file> [options]
Available Options:

--pretty: Format the output file with pretty-printing (for JSON and YAML).
--schema <schema-file>: Use a custom schema file for validation during conversion.
--strict: Enable strict mode to enforce strict validation rules.
Examples
Convert JSON to ForSure
Command:

Shell Script
Copy
Insert
forsure-converter convert structure.json structure.forsure
Input (
structure.json
):

JSON
Copy
Insert
{
  "root": {
    "index.html": {
      "size": "5KB",
      "type": "html"
    },
    "style.css": {
      "size": "2KB",
      "type": "css"
    },
    "script.js": {
      "size": "3KB",
      "type": "javascript"
    }
  }
}
Output (
structure.forsure
):

Copy
Insert
root: {
  'index.html': [ size: '5KB', type: 'html' ],
  'style.css': [ size: '2KB', type: 'css' ],
  'script.js': [ size: '3KB', type: 'javascript' ]
}
Convert ForSure to YAML
Command:

Shell Script
Copy
Insert
forsure-converter convert structure.forsure structure.yaml --pretty
Input (
structure.forsure
):

Copy
Insert
root: {
  'index.html': [ size: '5KB', type: 'html' ],
  'style.css': [ size: '2KB', type: 'css' ],
  'script.js': [ size: '3KB', type: 'javascript' ]
}
Output (
structure.yaml
):

Copy
Insert
root:
  index.html:
    size: "5KB"
    type: "html"
  style.css:
    size: "2KB"
    type: "css"
  script.js:
    size: "3KB"
    type: "javascript"
Configuration
You can configure the ForSure converter using a configuration file (
forsure-converter.config.json
). Place the configuration file in the root directory of your project.

Example Configuration
JSON
Copy
Insert
{
  "defaultFormat": "yaml",
  "prettyPrint": true,
  "validateSchema": true,
  "schemaFile": "custom-schema.json"
}
Best Practices
Keep It Simple: Use the converter to maintain a consistent project structure across different formats.
Validate Schemas: Always validate your project structures using custom schemas to ensure consistency.
Backup Files: Before converting, make sure to backup your original files to prevent data loss.
Troubleshooting
Common Issues
Invalid Format: Ensure that the input file is in a supported format.
Schema Validation Errors: Review the error messages and update your schema or project structure as needed.
Conversion Failures: Check for syntax errors in your input file and ensure the output file’s path is correct.
Getting Help
If you encounter issues that you cannot resolve, refer to the official documentation or seek help in the community forums.

Additional Resources
Official Documentation
Community Forums
GitHub Repository
Tutorial Videos
Community Support
This 
CONVERTER.md
 provides a comprehensive guide for using the ForSure converter tool to convert project structure definitions between different formats. By following this guide, you can effectively integrate ForSure with other systems and tools.

Copy
Insert

This `CONVERTER.md` file provides a detailed guide on using the ForSure converter, including installation, usage, examples, configuration, best practices, troubleshooting, and additional resources.