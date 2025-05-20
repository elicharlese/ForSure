// Removed unused import: use std::fs; // Compiler reports unused, although std::fs::... is used. Removing to fix warning.
use std::io::Error;
use std::path::Path; // Keep as it's used for Path and Path::new

use crate::models::ProjectItem; // Import ProjectItem from our models module

// Helper function to print the structure (for debugging)
pub fn print_structure(items: &Vec<ProjectItem>, depth: usize) {
    for item in items {
        let indent = "  ".repeat(depth);
        println!("{}Type: {}, Name: {}", indent, item.item_type, item.name);
        if let Some(path) = &item.path {
            println!("{}  Path: {}", indent, path);
        }
        // full_path is calculated in parser, so we can print it here
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
        let item_path = match &item.path {
            Some(p) => base_path.join(p),
            None => {
                // If no path is specified, use the name (with some sanitization)
                if !item.name.is_empty() {
                    let file_or_dir_name = item.name.replace(" ", "_").to_lowercase(); // Simple sanitization
                    base_path.join(file_or_dir_name)
                } else {
                    // If no name and no path, skip this item as we don't know what to create
                    // Commented out the warning as it's expected for structural items without names/paths that aren't files/directories
                    // println!("Warning: Skipping item with no name and no path: {:?}\n", item);
                    // Still recurse for children even if this item is skipped, in case they have paths
                    create_project_structure(&item.children, base_path)?;
                    continue; // Skip to the next item
                }
            }
        };

        match item.item_type.as_str() {
            "Directory" => {
                if !item_path.exists() {
                    std::fs::create_dir_all(&item_path)?;
                    println!("Creating directory: \"{}\"", item_path.display());
                }
                // Recursively create children within this directory
                create_project_structure(&item.children, &item_path)?;
            },
            "File" => {
                // Ensure parent directory exists before creating the file
                 if let Some(parent) = item_path.parent() {
                     if !parent.exists() {
                         std::fs::create_dir_all(parent)?;
                         println!("Creating parent directory for file: \"{}\"", parent.display());
                     }
                 }
                // Create the file and write content if content_pattern or example is provided
                let content_to_write = item.content_pattern.clone()
                    .or_else(|| item.example.clone());

                if let Some(content) = content_to_write {
                    std::fs::write(&item_path, content)?;
                    println!("Creating file and writing content: \"{}\"", item_path.display());
                } else {
                    // Create an empty file if no content is provided
                    std::fs::File::create(&item_path)?;
                    println!("Creating empty file: \"{}\"", item_path.display());
                }
            },
            // For any other item type (including Headings and ListItems), just recurse through children.
            // They represent structure but don't create file system entries themselves unless they have a path.
            _ => {
                 if !item.children.is_empty() {
                     println!("Processing children of {}: {}", item.item_type, item.name);
                     // Pass the current base_path. Children with paths will build relative to this.
                     create_project_structure(&item.children, base_path)?;
                 } else if item.path.is_some() || !item.name.is_empty() {
                      // If it's an item with a path or name but not File/Directory and no children,
                      // it might be a conceptual item we still want to acknowledge but not create a FS entry for.
                      // The warning for skipping no-name/no-path items covers the purely empty ones.
                      // We don't need to do anything for other structural items without children here.
                 } else {
                     // This is likely a purely empty item that wasn't caught by the 'no name and no path' check.
                     // It shouldn't create a FS entry.
                 }
            },
        }
    }
    Ok(())
}