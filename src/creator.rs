use std::io::Error;
use std::path::Path;
use std::path::PathBuf;
use std::fs;

use crate::models::{ProjectItem, ItemType}; // Import ItemType

// Helper function to print the structure (for debugging)
#[allow(dead_code)] // Allow dead code since it's not called from main by default
pub fn print_structure(items: &Vec<ProjectItem>, depth: usize) {
    for item in items {
        let indent = "  ".repeat(depth);
        // Use {:?} for Debug formatting of ItemType
        println!("{}Type: {:?}, Name: {}", indent, item.item_type, item.name);
        if let Some(path) = &item.path {
            println!("{}  Path: {}", indent, path);
        }
        // full_path will need to be set during creation for accuracy here
        if let Some(full_path) = &item.full_path {
            println!("{}  Full Path: {:?}", indent, full_path);
        }
        if let Some(description) = &item.description {
             println!("{}  Description: {}", indent, description.trim());
        }
        if let Some(purpose) = &item.purpose {
             println!("{}  Purpose: {}", indent, purpose.trim());
        }
        if let Some(note) = &item.note {
             println!("{}  Note: {}", indent, note.trim());
        }
        if let Some(example) = &item.example {
             println!("{}  Example: {}", indent, example.trim());
        }
        if let Some(pattern) = &item.content_pattern {
             println!("{}  Content Pattern: {}", indent, pattern.trim());
        }
        if let Some(command) = &item.command { // Print the command if present
             println!("{}  Command: {}", indent, command.trim());
        }
         if let Some(content) = &item.content { // Print general content if present
              // Print only the first few lines of content for brevity
              let lines: Vec<&str> = content.lines().take(5).collect();
              println!("{}  Content: {}...", indent, lines.join("\\n")); // Show newlines as \n
         }


        if !item.children.is_empty() {
            println!("{}  Children:", indent);
            print_structure(&item.children, depth + 1);
        }
    }
}

// Function for creating the actual project structure on disk
pub fn create_project_structure(structure: &Vec<ProjectItem>, base_path: &Path) -> Result<(), Error> {
    // Ensure the base directory exists
    if !base_path.exists() {
        std::fs::create_dir_all(base_path)?;
        println!("Creating base directory: \"{}\"", base_path.display());
    }

    for item in structure {
        // Determine the path for the current item. Prioritize the explicit 'path' field if present.
        let item_path = if let Some(p) = &item.path {
            // If path is specified, use it relative to the base_path
            base_path.join(p)
        } else if !item.name.is_empty() && (item.item_type == ItemType::Directory || item.item_type == ItemType::File || item.item_type == ItemType::Project || item.item_type == ItemType::ListItem) {
            // If no path but name and is a Directory, File, Project, or ListItem, use sanitized name relative to parent
            let file_or_dir_name = item.name.replace(" ", "_").to_lowercase(); // Simple sanitization
             // This logic needs to be smarter about relative paths based on the parent item's path.
             // For now, joining to base_path is a simplification.
            base_path.join(file_or_dir_name)

        }
         else {
            // If no name and no path, skip creating a FS entry for this item itself.
            // Still recurse for children, passing the current base_path.
            create_project_structure(&item.children, base_path)?;
            continue; // Skip to the next item in the current level
        };


        match item.item_type { // Match on the ItemType enum directly
            ItemType::Directory | ItemType::Project => { // Treat Project like a Directory for creation purposes
                if !item_path.exists() {
                    std::fs::create_dir_all(&item_path)?;
                    println!("Creating directory: \"{}\"", item_path.display());
                }
                // Recursively create children within this directory, using item_path as the new base
                create_project_structure(&item.children, &item_path)?;
            },
            ItemType::File => { // Only create files for explicit "File" type
                 // Ensure parent directory exists before creating the file
                 if let Some(parent) = item_path.parent() {
                     if !parent.exists() {
                         std::fs::create_dir_all(parent)?;
                         println!("Creating parent directory for file: \"{}\"", parent.display());
                     }
                 }
                // Create the file and write content if content_pattern, example, or content is provided
                let content_to_write = item.content_pattern.clone()
                    .or_else(|| item.example.clone())
                    .or_else(|| item.content.clone()); // Also consider the general 'content' field

                if let Some(content) = content_to_write {
                    std::fs::write(&item_path, content)?;
                    println!("Creating file and writing content: \"{}\"", item_path.display());
                } else {
                    // Create an empty file if no content
                    std::fs::File::create(&item_path)?;
                    println!("Creating empty file: \"{}\"", item_path.display());
                }
                 // Recursively process children of files. Children of a file might represent nested structure within the logical file content,
                 // but for file system creation, they would need their own paths.
                 // If a file has children with paths, they would be created relative to the file's directory.
                 if !item.children.is_empty() {
                      // Pass the directory containing the current item as the base for children
                      if let Some(parent_dir) = item_path.parent() {
                           println!("Processing children of item '{}' (Type: {:?}) within directory: \"{}\"", item.name, item.item_type, parent_dir.display()); // Use {:?}
                           create_project_structure(&item.children, parent_dir)?;
                      } else {
                           // This case should be rare for files with names, but handle defensively
                           println!("Warning: Could not determine parent directory for item '{}' (Type: {:?}) with children.", item.name, item.item_type); // Use {:?}
                           create_project_structure(&item.children, base_path)?; // Fallback to base_path
                      }
                 }
            },
             ItemType::ListItem => {
                 // ListItems typically don't create FS entries themselves unless they have an explicit path or are typed as File/Directory.
                 // The check at the top handles cases where a ListItem gets a path or name and becomes a File/Directory.
                 // If it's still a ListItem here, it's likely just a structural element in the hierarchy.
                 // Recursively process its children, passing the current base_path.
                  if !item.children.is_empty() {
                      println!("Processing children of {:?}: {}", item.item_type, item.name); // Use {:?}
                       create_project_structure(&item.children, base_path)?;
                  }
             }
            // For any other item type, just recurse through children.
            ItemType::Unknown => { // Handle Unknown explicitly or via _
                 if !item.children.is_empty() {
                     println!("Processing children of {:?}: {}", item.item_type, item.name); // Use {:?}
                     // Pass the current base_path. Children with paths will build relative to this.
                     create_project_structure(&item.children, base_path)?;
                 }
            },
        }

        // If the item has a command, print it
        if let Some(command) = &item.command {
            // Determine the directory where the command should be executed.
            // If the item is a directory or project, execute in its own path.
            // If the item is a file or list item, execute in its parent directory.
            let execution_dir = match item.item_type { // Match on ItemType enum
                ItemType::Directory | ItemType::Project => item_path.clone(),
                ItemType::File | ItemType::ListItem => item_path.parent().unwrap_or(base_path).to_path_buf(),
                ItemType::Unknown => base_path.to_path_buf(), // For unknown types, execute in the current base path
            };

            println!(
                "Suggested command for item '{}' (Type: {:?}): cd \"{}\" && {}", // Use {:?}
                item.name, item.item_type, execution_dir.display(), command.trim() // Trim command whitespace
            );
            // TODO: Implement actual command execution here in a future iteration
            // For now, we just print the suggested command.
        }
    }
    Ok(())
}