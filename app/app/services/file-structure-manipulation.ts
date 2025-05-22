import type { FileNode } from "../components/file-structure-visualization"

// Add a file or directory to the structure
export function addNode(
  structure: FileNode,
  path: string,
  newNode: FileNode,
  createMissingDirectories = false,
): FileNode {
  const pathParts = path.split("/").filter(Boolean)

  // If path is empty, we're adding to the root
  if (pathParts.length === 0) {
    return {
      ...structure,
      children: [...(structure.children || []), newNode],
    }
  }

  // Clone the structure to avoid mutating the original
  const result = { ...structure }

  // Navigate to the target directory
  let current = result
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i]
    if (!current.children) {
      current.children = []
    }

    const childIndex = current.children.findIndex((child) => child.name === part)

    if (childIndex === -1) {
      if (createMissingDirectories) {
        // Create missing directory
        const newDir: FileNode = {
          name: part,
          type: "directory",
          children: [],
        }
        current.children.push(newDir)
        current = newDir
      } else {
        // Path doesn't exist and we're not creating missing directories
        return structure
      }
    } else {
      current = current.children[childIndex]

      // Ensure we're navigating through directories
      if (current.type !== "directory" && i < pathParts.length - 1) {
        return structure // Can't navigate through a file
      }
    }
  }

  // Add the new node to the target directory
  if (!current.children) {
    current.children = []
  }

  // Check if a node with the same name already exists
  const existingIndex = current.children.findIndex((child) => child.name === newNode.name)
  if (existingIndex !== -1) {
    // Replace the existing node
    current.children[existingIndex] = newNode
  } else {
    // Add the new node
    current.children.push(newNode)
  }

  return result
}

// Remove a file or directory from the structure
export function removeNode(structure: FileNode, path: string): FileNode {
  const pathParts = path.split("/").filter(Boolean)

  // If path is empty or just the root, we can't remove the root
  if (pathParts.length === 0) {
    return structure
  }

  // Clone the structure to avoid mutating the original
  const result = { ...structure }

  // Navigate to the parent directory
  let current = result
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i]
    if (!current.children) {
      return structure // Path doesn't exist
    }

    const childIndex = current.children.findIndex((child) => child.name === part)
    if (childIndex === -1) {
      return structure // Path doesn't exist
    }

    current = current.children[childIndex]

    // Ensure we're navigating through directories
    if (current.type !== "directory") {
      return structure // Can't navigate through a file
    }
  }

  // Remove the target node
  if (!current.children) {
    return structure // No children to remove from
  }

  const targetName = pathParts[pathParts.length - 1]
  const targetIndex = current.children.findIndex((child) => child.name === targetName)

  if (targetIndex === -1) {
    return structure // Target doesn't exist
  }

  // Remove the node
  current.children = current.children.filter((_, i) => i !== targetIndex)

  return result
}

// Rename a file or directory
export function renameNode(structure: FileNode, path: string, newName: string): FileNode {
  const pathParts = path.split("/").filter(Boolean)

  // If path is empty, we're renaming the root
  if (pathParts.length === 0) {
    return {
      ...structure,
      name: newName,
    }
  }

  // Clone the structure to avoid mutating the original
  const result = { ...structure }

  // Navigate to the target node
  let current = result
  let parent = null
  let parentIndex = -1

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i]
    if (!current.children) {
      return structure // Path doesn't exist
    }

    const childIndex = current.children.findIndex((child) => child.name === part)
    if (childIndex === -1) {
      return structure // Path doesn't exist
    }

    if (i === pathParts.length - 1) {
      // This is the node we want to rename
      parent = current
      parentIndex = childIndex
    } else {
      current = current.children[childIndex]

      // Ensure we're navigating through directories
      if (current.type !== "directory") {
        return structure // Can't navigate through a file
      }
    }
  }

  if (parent && parentIndex !== -1) {
    // Rename the node
    parent.children![parentIndex] = {
      ...parent.children![parentIndex],
      name: newName,
    }
  }

  return result
}

// Move a file or directory to a new location
export function moveNode(structure: FileNode, sourcePath: string, targetPath: string): FileNode {
  // First, find and remove the source node
  const sourcePathParts = sourcePath.split("/").filter(Boolean)
  if (sourcePathParts.length === 0) {
    return structure // Can't move the root
  }

  // Clone the structure to avoid mutating the original
  let result = { ...structure }

  // Navigate to the parent of the source node
  let current = result
  for (let i = 0; i < sourcePathParts.length - 1; i++) {
    const part = sourcePathParts[i]
    if (!current.children) {
      return structure // Path doesn't exist
    }

    const childIndex = current.children.findIndex((child) => child.name === part)
    if (childIndex === -1) {
      return structure // Path doesn't exist
    }

    current = current.children[childIndex]

    // Ensure we're navigating through directories
    if (current.type !== "directory") {
      return structure // Can't navigate through a file
    }
  }

  // Find the source node
  if (!current.children) {
    return structure // No children to move
  }

  const sourceName = sourcePathParts[sourcePathParts.length - 1]
  const sourceIndex = current.children.findIndex((child) => child.name === sourceName)

  if (sourceIndex === -1) {
    return structure // Source doesn't exist
  }

  // Get a copy of the source node
  const sourceNode = { ...current.children[sourceIndex] }

  // Remove the source node
  result = removeNode(result, sourcePath)

  // Add the source node to the target path
  return addNode(result, targetPath, sourceNode, true)
}

// Create a new directory
export function createDirectory(structure: FileNode, path: string, name: string): FileNode {
  const newDir: FileNode = {
    name,
    type: "directory",
    children: [],
  }

  return addNode(structure, path, newDir, true)
}

// Create a new file
export function createFile(structure: FileNode, path: string, name: string, content = ""): FileNode {
  const newFile: FileNode = {
    name,
    type: "file",
    content,
  }

  return addNode(structure, path, newFile, true)
}

// Add a function to update file content
export function updateFileContent(structure: FileNode, path: string, content: string): FileNode {
  // Clone the structure to avoid mutating the original
  const result = { ...structure }

  // Parse the path
  const pathParts = path.split("/").filter(Boolean)

  // If path is empty, we can't update the root
  if (pathParts.length === 0) {
    return structure
  }

  // Navigate to the file
  let current = result
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i]
    if (!current.children) {
      return structure // Path doesn't exist
    }

    const childIndex = current.children.findIndex((child) => child.name === part)
    if (childIndex === -1) {
      return structure // Path doesn't exist
    }

    current = current.children[childIndex]

    // Ensure we're navigating through directories
    if (current.type !== "directory") {
      return structure // Can't navigate through a file
    }
  }

  // Update the file content
  if (!current.children) {
    return structure // No children to update
  }

  const fileName = pathParts[pathParts.length - 1]
  const fileIndex = current.children.findIndex((child) => child.name === fileName)

  if (fileIndex === -1) {
    return structure // File doesn't exist
  }

  // Ensure it's a file
  if (current.children[fileIndex].type !== "file") {
    return structure // Not a file
  }

  // Update the content
  current.children[fileIndex] = {
    ...current.children[fileIndex],
    content,
  }

  return result
}

// Update the parseFileStructureCommand function to handle file content commands
export function parseFileStructureCommand(command: string): {
  action: "add" | "remove" | "rename" | "move" | "update" | "unknown"
  type?: "file" | "directory"
  path?: string
  name?: string
  targetPath?: string
  content?: string
} {
  command = command.toLowerCase().trim()

  // Add file or directory
  if (command.includes("add") || command.includes("create")) {
    if (command.includes("file")) {
      const match = command.match(
        /(?:add|create)\s+(?:a\s+)?file\s+(?:called\s+)?['"]?([^'"]+)['"]?(?:\s+(?:in|to|at)\s+['"]?([^'"]+)['"]?)?/i,
      )
      if (match) {
        return {
          action: "add",
          type: "file",
          name: match[1],
          path: match[2] || "",
        }
      }
    } else if (command.includes("folder") || command.includes("directory")) {
      const match = command.match(
        /(?:add|create)\s+(?:a\s+)?(?:folder|directory)\s+(?:called\s+)?['"]?([^'"]+)['"]?(?:\s+(?:in|to|at)\s+['"]?([^'"]+)['"]?)?/i,
      )
      if (match) {
        return {
          action: "add",
          type: "directory",
          name: match[1],
          path: match[2] || "",
        }
      }
    }
  }

  // Remove file or directory
  if (command.includes("remove") || command.includes("delete")) {
    const match = command.match(/(?:remove|delete)\s+(?:the\s+)?(?:file|folder|directory)\s+['"]?([^'"]+)['"]?/i)
    if (match) {
      return {
        action: "remove",
        path: match[1],
      }
    }
  }

  // Rename file or directory
  if (command.includes("rename")) {
    const match = command.match(
      /rename\s+(?:the\s+)?(?:file|folder|directory)\s+['"]?([^'"]+)['"]?\s+to\s+['"]?([^'"]+)['"]?/i,
    )
    if (match) {
      return {
        action: "rename",
        path: match[1],
        name: match[2],
      }
    }
  }

  // Move file or directory
  if (command.includes("move")) {
    const match = command.match(
      /move\s+(?:the\s+)?(?:file|folder|directory)\s+['"]?([^'"]+)['"]?\s+to\s+['"]?([^'"]+)['"]?/i,
    )
    if (match) {
      return {
        action: "move",
        path: match[1],
        targetPath: match[2],
      }
    }
  }

  // Update file content
  if (command.includes("update") || command.includes("edit") || command.includes("change")) {
    if (command.includes("content") || command.includes("file")) {
      const match = command.match(
        /(?:update|edit|change)\s+(?:the\s+)?(?:content\s+of\s+)?(?:file\s+)?['"]?([^'"]+)['"]?(?:\s+to\s+['"]?([^'"]+)['"]?)?/i,
      )
      if (match) {
        return {
          action: "update",
          path: match[1],
          content: match[2] || "",
        }
      }
    }
  }

  return { action: "unknown" }
}

// Update the applyFileStructureCommand function to handle file content updates
export function applyFileStructureCommand(
  structure: FileNode,
  command: string,
): {
  newStructure: FileNode
  success: boolean
  message: string
} {
  const parsedCommand = parseFileStructureCommand(command)

  if (parsedCommand.action === "unknown") {
    return {
      newStructure: structure,
      success: false,
      message:
        "I couldn't understand that file structure command. Try something like 'add a file called config.js' or 'create a folder called utils'.",
    }
  }

  try {
    let newStructure = structure
    let message = ""

    switch (parsedCommand.action) {
      case "add":
        if (parsedCommand.type === "file" && parsedCommand.name) {
          newStructure = createFile(
            structure,
            parsedCommand.path || "",
            parsedCommand.name,
            parsedCommand.content || "",
          )
          message = `Added file "${parsedCommand.name}" ${parsedCommand.path ? `to ${parsedCommand.path}` : "to the root directory"}.`
        } else if (parsedCommand.type === "directory" && parsedCommand.name) {
          newStructure = createDirectory(structure, parsedCommand.path || "", parsedCommand.name)
          message = `Created directory "${parsedCommand.name}" ${parsedCommand.path ? `in ${parsedCommand.path}` : "in the root directory"}.`
        }
        break

      case "remove":
        if (parsedCommand.path) {
          newStructure = removeNode(structure, parsedCommand.path)
          message = `Removed "${parsedCommand.path}" from the file structure.`
        }
        break

      case "rename":
        if (parsedCommand.path && parsedCommand.name) {
          newStructure = renameNode(structure, parsedCommand.path, parsedCommand.name)
          message = `Renamed "${parsedCommand.path}" to "${parsedCommand.name}".`
        }
        break

      case "move":
        if (parsedCommand.path && parsedCommand.targetPath) {
          newStructure = moveNode(structure, parsedCommand.path, parsedCommand.targetPath)
          message = `Moved "${parsedCommand.path}" to "${parsedCommand.targetPath}".`
        }
        break

      case "update":
        if (parsedCommand.path && parsedCommand.content !== undefined) {
          newStructure = updateFileContent(structure, parsedCommand.path, parsedCommand.content)
          message = `Updated content of "${parsedCommand.path}".`
        }
        break
    }

    return {
      newStructure,
      success: true,
      message,
    }
  } catch (error) {
    return {
      newStructure: structure,
      success: false,
      message: `Error applying file structure change: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
