# ForSure Language (FSH) 🚀
ForSure is a language designed to simplify projects by using a flat-file-like structured language/compiler/cli/converter system. It allows you to describe and document file structures in a clear and concise manner, similar to how you would write a Dockerfile for a container. ForSure uses a simple, human-readable syntax to represent directories, files, and their relationships.

## Getting Started 🎉
To start using ForSure, clone this repository and review the sample `.fs` files included. You can write your ForSure definitions using any text editor.

## Features ✨
- **Hierarchical Structure:** Mimics the natural file system's hierarchy.
- **Comments and Annotations:** Offers inline commenting and metadata association.
- **@import Directives:** Facilitates file inclusion for reusable structures.
- **Custom Attributes:** Extends elements with user-defined attributes like permissions and sizes.
- **Readable and Simple:** A clean syntax prioritizing user understanding and ease of use.

## Writing Your First ForSure File ✏️

### Basic Example

Here's a basic example of what a `.fs` file looks like:

```forsure
root:
  # Main source code directory
  - src:
      - main.js { entry: true }
      - utils:
          # Utility scripts
          - helpers.js
          - date.js { timezone: "UTC" }
  # Assets for front-end design
  - assets:
      - logo.svg
      - css:
          # Style sheets
          - theme.css
  # Documentation file
  - README.md
```

### Intermediate Example

An intermediate example including custom attributes and import directives:

```
root:
  - src:
      @import 'common-files.fs'
      - app.js { entry: true, permissions: "644" }
      - config.json { env: "production" }
  - tests:
      - test_app.js
  - docs:
      - api.md
      - readme.md
```

### Advanced Example

An advanced example showcasing nested imports and complex attributes:

```
root:
  - server:
      @import 'server-config.fs'
      - index.js { entry: true, permissions: "755" }
      - lib:
          - database.js { connection: "secure" }
          - cache.js { strategy: "LRU" }
  - client:
      @import 'client-components.fs'
      - index.html
      - js:
          - app.js { async: true }
  - build:
      - Dockerfile
      - Jenkinsfile
```
      
## Contributing 🤝

Contributions to ForSure are greatly appreciated. Any improvements or suggestions are welcome. Please refer to the 
 file for guidelines on contributing to this project.

## Submitting Feedback 📝

We are excited to have you participate in the development of ForSure! During the beta launch, we highly encourage users to provide feedback and contribute to the improvement of the tool. Here’s how you can do it:

1. Fork the repository on GitHub to create your own copy.
2. Create a new branch for your feedback.
3. Write your feedback in a markdown file (
) within the docs/ directory of your branch.
4. Create a pull request with your branch. Make sure to give a clear title and description of your feedback.

### Review Process

- The maintainers will review your feedback.
- Accepted feedback will be converted into issues.
- These issues will then be addressed by the maintenance team accordingly.

### Fork the Project 🍴

1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
2. Commit your Changes (git commit -m 'Add some AmazingFeature')
3. Push to the Branch (git push origin feature/AmazingFeature)
4. Open a Pull Request

### License ⚖️

Distributed under the MIT License. See LICENSE for more information.

### Contact 📬

Your Name - @your_twitter_handle
Project Link: https://github.com/elicharlese/ForSure

Feel free to customize the 
 to better suit the specifics of your project or personal information.