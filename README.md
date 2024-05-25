# ForSure Language (FSH)

ForSure is a language designed to simplify projects by using a flat-file-like structured language/compiler/cli/converter system. It allows you to describe and document file structures in a clear and concise manner, similar to how you would write a Dockerfile for a container. ForSure uses a simple, human-readable syntax to represent directories, files, and their relationships.

## Getting Started

To start using ForSure, clone this repository and review the sample .fs files included. You can write your ForSure definitions using any text editor.

## Features

- **Hierarchical Structure:** Mimics the natural file system's hierarchy.
- **Comments and Annotations:** Offers inline commenting and metadata association.
- **@import Directives:** Facilitates file inclusion for reusable structures.
- **Custom Attributes:** Extends elements with user-defined attributes like permissions and sizes.
- **Readable and Simple:** A clean syntax prioritizing user understanding and ease of use.

## Writing Your First ForSure File

Here's a basic example of what a .fs file looks like:

```
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

## Contributing

Contributions to ForSure are greatly appreciated. Any improvements or suggestions are welcome. Please refer to the CODE_OF_CONDUCT.md file for guidelines on contributing to this project.

### Fork the Project

1. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

Your Name - @your_twitter_handle
Project Link: https://github.com/your_repo/ForSure

Feel free to customize the README.md to better suit the specifics of your project or personal information.
