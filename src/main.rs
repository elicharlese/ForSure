use std::fs;
use std::io::_Error; // Prefix with underscore
use pulldown_cmark::{Parser, Event, Tag, _HeadingLevel, TagEnd, CodeBlockKind}; // Prefix with underscore

// Basic struct to represent a file or directory item
#[derive(Debug, Default)]
struct ProjectItem {
    item_type: String,
    name: String,
    path: Option<String>,
    #[allow(dead_code)] // Allow dead code for this field
    full_path: Option<std::path::PathBuf>, // Calculated full path from the root
    description: Option<Option<String>>,
    purpose: Option<Option<String>>,
    note: Option<Option<String>>,
    example: Option<Option<String>>,
    content_pattern: Option<Option<String>>,
    children: Vec<ProjectItem>, // Nested items
}

#[derive(Debug, PartialEq)] // Add PartialEq derive here
enum ListItemParsingState {
    None,
    Type,
    Name,
    Path,
    Description,
    Purpose,
    Note,
    Example,
    ContentPattern,
}


fn main() -> Result<(), _Error> { // Use _Error here as well
    println!("ForSure CLI is running!");

    let forsure_file_path = "example.forsure";

    // Read the content of the .forsure file
    let markdown_input = fs::read_to_string(forsure_file_path)?;

    // Create a parser
    let parser = Parser::new(&markdown_input);

    println!("\nParsing markdown events and building structure:");

    let mut current_heading_level: Option<pulldown_cmark::HeadingLevel> = None; // Use full path or keep as is if _HeadingLevel is used below
    let mut in_list_item = false;
    let mut current_item = ProjectItem::default();
    let mut current_tag: Option<String> = None;
    let mut tag_content = String::new();
    let mut project_structure: Vec<ProjectItem> = Vec::new();
    let mut item_stack: Vec<ProjectItem> = Vec::new();
    let mut list_item_state = ListItemParsingState::None;


    // Iterate over the events and process them
    for event in parser {
        match event {
            Event::Start(Tag::Heading { level, .. }) => {
                current_heading_level = Some(level);
                // When a new heading starts, consider the previous item complete
                 if in_list_item {
                    in_list_item = false;
                    // Add the completed item to the current scope
                     if let Some(parent) = item_stack.last_mut() {
                        parent.children.push(current_item);
                     } else {
                        project_structure.push(current_item);
                     }
                    current_item = ProjectItem::default(); // Reset for a new item
                 }

                // Start a new item for the heading, assuming it represents a new scope
                 let new_item = ProjectItem {
                    item_type: format!("Heading{:?}", level),
                    name: String::new(), // Name will be set by the following text event
                    path: None,
                    full_path: None,
                    description: None,
                    purpose: None,
                    note: None,
                    example: None,
                    content_pattern: None,
                    children: Vec::new(),
                 };
                 item_stack.push(new_item);

            }
            Event::End(TagEnd::Heading(level)) => {
                 if let Some(top_item) = item_stack.pop() {
                    // The heading item is complete
                    if let Some(parent) = item_stack.last_mut() {
                         parent.children.push(top_item);
                    } else {
                        project_structure.push(top_item);
                    }
                 }
                if current_heading_level == Some(level) {
                    current_heading_level = None;
                }
            }
            Event::Start(Tag::List(_)) => {
                // Handle lists if needed, for now just acknowledge
            }
            Event::End(TagEnd::List(_)) => {
                // Handle lists if needed
            }
            Event::Start(Tag::Item) => {
                in_list_item = true;
                current_item = ProjectItem::default(); // Reset for a new item
                 list_item_state = ListItemParsingState::None; // Reset state for a new list item
                // println!("  Entering List Item");
            }
            Event::End(TagEnd::Item) => {
                in_list_item = false;
                // println!("  Parsed Item: {:?}\n", current_item); // Print parsed item for now
                // Add the parsed item to the current scope (which should be the last item on the stack, typically a heading)
                if let Some(parent) = item_stack.last_mut() {
                    parent.children.push(current_item);
                } else {
                    // If there's no parent (shouldn't happen for list items under a heading), add to the root
                    project_structure.push(current_item);
                }
                current_item = ProjectItem::default(); // Reset after processing
                 list_item_state = ListItemParsingState::None; // Reset state after processing item
                // println!("  Exiting List Item");
            }
            Event::Text(text) => {
                if in_list_item {
                    let line = text.trim();
                    if line.starts_with("Type:") {
                        current_item.item_type = line.replace("Type:", "").trim().to_string();
                         list_item_state = ListItemParsingState::Type;
                    } else if line.starts_with("Name:") {
                        current_item.name = line.replace("Name:", "").trim().to_string();
                         list_item_state = ListItemParsingState::Name;
                    } else if line.starts_with("Path:") {
                        current_item.path = Some(line.replace("Path:", "").trim().to_string());
                         list_item_state = ListItemParsingState::Path;
                    } else if let Some(_current) = &current_tag { // Fixed unused variable
                         tag_content.push_str(&text);
                    } else if list_item_state != ListItemParsingState::None {
                         // If we are in a list item and the previous line set a state,
                        // this text might be continuation of the previous tag content
                         tag_content.push_str(&text); // Append text to tag_content
                    }
                } else if let Some(last_item) = item_stack.last_mut() {
                    // If we are in a heading and encounter text, treat it as the heading name
                    if last_item.name.is_empty() && last_item.item_type.starts_with("Heading") {
                         last_item.name = text.trim().to_string();
                    } else if let Some(_tag) = &current_tag { // Fixed unused variable
                         tag_content.push_str(&text);
                    }
                } else if let Some(_tag) = &current_tag { // Fixed unused variable
                     tag_content.push_str(&text);
                }
            }
            Event::Html(html) => {
                let tag_str = html.trim();
                if tag_str.starts_with("<") && tag_str.ends_with(">") {
                    let tag_name = tag_str[1..tag_str.len() - 1].to_string();
                    if tag_name.starts_with("/") {
                        // End tag
                        let end_tag_name = tag_name[1..].to_string();
                         if let Some(current) = &current_tag {
                            if current == &end_tag_name {
                                match current.as_str() {
                                    "description" => {
                                         if in_list_item { current_item.description = Some(Some(tag_content.trim().to_string())); }
                                         else if let Some(last_item) = item_stack.last_mut() { last_item.description = Some(Some(tag_content.trim().to_string())); }
                                    },
                                    "purpose" => {
                                         if in_list_item { current_item.purpose = Some(Some(tag_content.trim().to_string())); }
                                         else if let Some(last_item) = item_stack.last_mut() { last_item.purpose = Some(Some(tag_content.trim().to_string())); }
                                    },
                                    "note" => {
                                         if in_list_item { current_item.note = Some(Some(tag_content.trim().to_string())); }
                                         else if let Some(last_item) = item_stack.last_mut() { last_item.note = Some(Some(tag_content.trim().to_string())); }
                                    },
                                    "example" => {
                                         if in_list_item { current_item.example = Some(Some(tag_content.trim().to_string())); }
                                         else if let Some(last_item) = item_stack.last_mut() { last_item.example = Some(Some(tag_content.trim().to_string())); }
                                    },
                                    "content_pattern" => {
                                         if in_list_item { current_item.content_pattern = Some(Some(tag_content.trim().to_string())); }
                                         else if let Some(last_item) = item_stack.last_mut() { last_item.content_pattern = Some(Some(tag_content.trim().to_string())); }
                                    },
                                    _ => {},
                                }
                                current_tag = None;
                                tag_content.clear();
                                 list_item_state = ListItemParsingState::None; // Reset state after closing tag
                            }
                        }
                    } else {
                        // Start tag
                        current_tag = Some(tag_name);
                        tag_content.clear(); // Clear content for the new tag
                         // Do NOT reset list_item_state here, it should be set by the preceding line in Event::Text
                    }
                }
            }
            Event::CodeBlock(kind) => {
                // Handle code blocks if needed
                // println!("Code Block: {:?}", kind);
                 list_item_state = ListItemParsingState::None; // Reset state on code block
            }

            // Handle other events like Start(Tag::Paragraph), End(Tag::Paragraph), etc. later
            _ => {
                 list_item_state = ListItemParsingState::None; // Reset state on other events
            },
        }
    }

    // After parsing, add any remaining items in the stack to the structure
     while let Some(remaining_item) = item_stack.pop() {
        if let Some(parent) = item_stack.last_mut() {
             parent.children.push(remaining_item);
        } else {
            project_structure.push(remaining_item);
        }
     }


    // TODO: Build the tree structure and extract tag content
    println!("\nFinal Parsed Project Structure:");
    print_structure(&project_structure, 0);

    // You can call create_project_structure here when you're ready to use it
    // For example:
    // let output_dir = std::path::Path::new("output_project");
    // create_project_structure(&project_structure, output_dir)?;

    Ok(())
}

// Helper function to print the structure (for debugging)
fn print_structure(items: &Vec<ProjectItem>, depth: usize) {
     for item in items {
        let indent = "  ".repeat(depth);
        println!("{}Type: {}, Name: {}", indent, item.item_type, item.name);
        if let Some(path) = &item.path {
            println!("{}  Path: {}", indent, path);
        }
        if let Some(full_path) = &item.full_path {
            println!("{}  Full Path: {:?}", indent, full_path);
        }
        if let Some(description) = &item.description {
             if let Some(desc) = description {
                println!("{}  Description: {}", indent, desc);
             }
        }
        if let Some(purpose) = &item.purpose {
             if let Some(purp) = purpose {
                println!("{}  Purpose: {}", indent, purp);
             }
        }
        if let Some(note) = &item.note {
             if let Some(nt) = note {
                println!("{}  Note: {}", indent, nt);
             }
        }
        if let Some(example) = &item.example {
             if let Some(ex) = example {
                println!("{}  Example: {}", indent, ex);
             }
        }
        if let Some(_pattern) = &item.content_pattern { // Fixed unused variable
             // println!("{}  Content Pattern: {}", indent, pattern); // If you want to print it
        }

        if !item.children.is_empty() {
            println!("{}  Children:", indent);
            print_structure(&item.children, depth + 1);
        }
     }
}

#[allow(dead_code)] // Allow dead code for now
// Placeholder for creating the actual project structure on disk
fn create_project_structure(structure: &Vec<ProjectItem>, base_path: &std::path::Path) -> Result<(), std::io::Error> {
     if !base_path.exists() {
        std::fs::create_dir_all(base_path)?;
        println!("Creating directory: \"{}\"", base_path.display());
     }

     for item in structure {
        let item_path = match &item.path {
            Some(p) => base_path.join(p),
            None => {
                // If no path is specified, use the name (with some sanitization)
                // Or decide how to handle items without explicit paths
                // For now, let's skip items without a path unless they are directories with children
                 if item.item_type == "Directory" && !item.children.is_empty() {
                    let dir_name = item.name.replace(" ", "_").to_lowercase(); // Simple sanitization
                    base_path.join(dir_name)
                 } else {
                    println!("Warning: Unknown item type '{}' for item '{}'. Skipping.", item.item_type, item.name);
                    continue;
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
                // Create the file and potentially write content based on content_pattern
                 if let Some(content_opt) = &item.content_pattern {
                    if let Some(content) = content_opt {
                        std::fs::write(&item_path, content)?;
                         println!("Creating file: \"{}\"", item_path.display());
                    } else {
                         // Create empty file if content_pattern is Some(None)
                        std::fs::File::create(&item_path)?;
                         println!("Creating empty file: \"{}\"", item_path.display());
                    }
                 } else {
                    // Create empty file if no content_pattern is provided
                    std::fs::File::create(&item_path)?;
                     println!("Creating empty file: \"{}\"", item_path.display());
                 }
            },
            // Add other item types as needed (e.g., "Module", "Component")
            _ => {
                // Handle unknown types or skip them
                 if !item_path.exists() && (item.item_type != "Directory" || item.children.is_empty()) {
                    println!("Warning: Unknown item type '{}' for item '{}'. Skipping creation.", item.item_type, item.name);
                 } else if item.item_type == "Directory" && !item.children.is_empty() {
                    // If it's an unknown type treated as a directory due to children, recurse
                     create_project_structure(&item.children, &item_path)?;
                 }
            }
        }
     }
     Ok(())
}