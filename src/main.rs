use std::env;
use std::process;
use getopts::Options;
use std::path::Path;
use std::fs;
use std::path::PathBuf;
use std::io::Read; // Import Read trait

mod parser;
mod models;
mod creator;
mod lexer; // Keep lexer module declaration

// Use the ParserState struct from the parser module
use parser::ParserState;
use models::ProjectItem; // Import ProjectItem from models

fn print_usage(program: &str, opts: Options) {
    let brief = format!("Usage: {} FILE [options]", program);
    print!("{}", opts.usage(&brief));
}

// Assuming this function is intended to process the parsed items and create files/directories
fn process_project_items(items: &[ProjectItem], base_path: &Path) -> std::io::Result<()> {
    for item in items {
        // Determine the path for the current item. Prioritize the explicit 'path' field if present.
        let item_path = if let Some(p) = &item.path {
            // If path is specified, use it relative to the base_path
            base_path.join(p)
        } else if !item.name.is_empty() && (item.item_type == models::ItemType::Directory || item.item_type == models::ItemType::File || item.item_type == models::ItemType::Project || item.item_type == models::ItemType::ListItem) {
            // If no path but name and is a Directory, File, Project, or ListItem, use sanitized name relative to parent
            let file_or_dir_name = item.name.replace(" ", "_").to_lowercase(); // Simple sanitization
             // This logic needs to be smarter about relative paths based on the parent item's path.
             // For now, joining to base_path is a simplification.
            base_path.join(file_or_dir_name)

        }
         else {
            // If no name and no path, skip creating a FS entry for this item itself.
            // Still recurse for children, passing the current base_path.
            creator::create_project_structure(&item.children, base_path)?; // Use creator::create_project_structure
            continue; // Skip to the next item in the current level
        };


        match item.item_type { // Match on the ItemType enum directly
            models::ItemType::Directory | models::ItemType::Project => { // Treat Project like a Directory for creation purposes
                if !item_path.exists() {
                    std::fs::create_dir_all(&item_path)?;
                    println!("Creating directory: \"{}\"", item_path.display());
                }
                // Recursively create children within this directory, using item_path as the new base
                creator::create_project_structure(&item.children, &item_path)?; // Use creator::create_project_structure
            },
            models::ItemType::File => { // Only create files for explicit "File" type
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
                           creator::create_project_structure(&item.children, parent_dir)?; // Use creator::create_project_structure
                      } else {
                           // This case should be rare for files with names, but handle defensively
                           println!("Warning: Could not determine parent directory for item '{}' (Type: {:?}) with children.", item.name, item.item_type); // Use {:?}
                           creator::create_project_structure(&item.children, base_path)?; // Fallback to base_path
                      }
                 }
            },
             models::ItemType::ListItem => {
                 // ListItems typically don't create FS entries themselves unless they have an explicit path or are typed as File/Directory.
                 // The check at the top handles cases where a ListItem gets a path or name and becomes a File/Directory.
                 // If it's still a ListItem here, it's likely just a structural element in the hierarchy.
                 // Recursively process its children, passing the current base_path.
                  if !item.children.is_empty() {
                      println!("Processing children of {:?}: {}", item.item_type, item.name); // Use {:?}
                       creator::create_project_structure(&item.children, base_path)?; // Use creator::create_project_structure
                  }
             }
            // For any other item type, just recurse through children.
            models::ItemType::Unknown => { // Handle Unknown explicitly or via _
                 if !item.children.is_empty() {
                     println!("Processing children of {:?}: {}", item.item_type, item.name); // Use {:?}
                     // Pass the current base_path. Children with paths will build relative to this.
                     creator::create_project_structure(&item.children, base_path)?; // Use creator::create_project_structure
                 }
            },
        }

        // If the item has a command, print it
        if let Some(command) = &item.command {
            // Determine the directory where the command should be executed.
            // If the item is a directory or project, execute in its own path.
            // If the item is a file or list item, execute in its parent directory.
            let execution_dir = match item.item_type { // Match on ItemType enum
                models::ItemType::Directory | models::ItemType::Project => item_path.clone(),
                models::ItemType::File | models::ItemType::ListItem => item_path.parent().unwrap_or(base_path).to_path_buf(),
                models::ItemType::Unknown => base_path.to_path_buf(), // For unknown types, execute in the current base path
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


fn main() {
    let args: Vec<String> = env::args().collect();
    let program = args[0].clone();

    let mut opts = Options::new();
    opts.optopt("o", "output", "set output file name", "NAME");
    opts.optflag("h", "help", "print this help menu");

    let matches = match opts.parse(&args[1..]) {
        Ok(m) => m,
        Err(f) => {
            eprintln!("{}", f.to_string());
            print_usage(&program, opts);
            process::exit(1);
        }
    };

    // Update the getopts usage to use the correct method
    // Assuming you want to check for the presence of the 'h' flag
    if matches.opt_present("h") { // Using opt_present as a common way to check for a flag
        print_usage(&program, opts);
        return;
    }

    let input_file_path = if matches.free.len() == 1 {
        matches.free[0].clone()
    } else {
        print_usage(&program, opts);
        process::exit(1);
    };

    let output_path_str = matches.opt_str("o").unwrap_or_else(|| "output_project".to_string());
    let output_path = PathBuf::from(output_path_str);

    // Read the input file content into a String
    let mut input_file = match fs::File::open(&input_file_path) {
        Ok(file) => file,
        Err(e) => {
            eprintln!("Error opening input file {}: {}", input_file_path, e);
            process::exit(1);
        }
    };
    let mut input_string = String::new();
    if let Err(e) = input_file.read_to_string(&mut input_string) {
         eprintln!("Error reading input file {}: {}", input_file_path, e);
         process::exit(1);
    }


    // Use ParserState to create the parser instance, providing the project name and input string slice
    let mut parser_state = ParserState::new("output_project".to_string(), &input_string); // Pass input string slice


    if let Err(e) = parser_state.parse_forsure_file() { // parse_forsure_file no longer needs reader
        eprintln!("Error parsing file: {}", e);
        process::exit(1);
    }

    println!("Successfully parsed file. Project structure:");
    // print the parsed items (optional)
    // The project structure is now in parser_state.project_root
    // println!("{:?}", parser_state.project_root);

    // Process the parsed items to create the project structure
    // Start processing from the children of the root, as process_project_items expects a slice of items
    if let Err(e) = creator::create_project_structure(&parser_state.project_root.children, &output_path) { // Use creator::create_project_structure
        eprintln!("Error creating project structure: {}", e);
        process::exit(1);
    }

    println!("Project structure created successfully in {:?}", output_path);

}