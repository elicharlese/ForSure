use std::fs; // Keep as it's used for fs::read_to_string
use std::io::{Error, ErrorKind};
use getopts::Options;
use std::env;
// Removed unused import: use std::path::Path; // Compiler reports unused, although Path::new is used. Let's remove it to fix the warning.

mod models;
mod lexer; // Declare the new lexer module
mod parser;
mod creator;

// Removed unused import: use models::ProjectItem; // ProjectItem is not directly used in main
use parser::parse_forsure_file; // Import the parsing function
use creator::{create_project_structure, print_structure}; // Import creator functions


// Function to print usage information
fn print_usage(program: &str, opts: Options) {
    let brief = format!("Usage: {} FILE [options]", program);
    print!("{}", opts.usage(&brief));
}


fn main() -> Result<(), Error> {
    println!("ForSure CLI is running!");

    // 1. Define command-line options
    let mut opts = Options::new();
    opts.optopt("f", "file", "set the input .forsure file path", "FILE");
    opts.optflag("h", "help", "print this help menu");

    // 2. Parse command-line arguments
    let args: Vec<String> = env::args().collect();
    let program = args[0].clone();

    let matches = match opts.parse(&args[1..]) {
        Ok(m) => { m },
        Err(f) => { // Handle parsing errors
            eprintln!("{}", f.to_string());
            print_usage(&program, opts);
            return Err(Error::new(ErrorKind::InvalidInput, "Failed to parse arguments"));
        }
    };

    // 3. Handle help flag
    if matches.opt_present("h") {
        print_usage(&program, opts);
        return Ok(()); // Exit after printing help
    }

    // 4. Determine the input file path
    let forsure_file_path = if let Some(file_path) = matches.opt_str("f") {
        file_path
    } else if args.len() > 1 && !args[1].starts_with('-') {
        // If no -f flag, treat the first non-flag argument as the file path
        args[1].clone()
    }
    else {
        // No file path provided, print usage and exit with an error
        eprintln!("No input .forsure file specified.");
        print_usage(&program, opts);
        return Err(Error::new(ErrorKind::InvalidInput, "No input file specified"));
    };


    println!("Using input file: {}", forsure_file_path);

    // Read the content of the .forsure file
    let markdown_input = match fs::read_to_string(&forsure_file_path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading file {}: {}", forsure_file_path, e);
            return Err(e);
        }
    };

    // 5. Parse the markdown input using the parser module
    println!("\nParsing markdown events and building structure:");
    let project_structure = match parse_forsure_file(&markdown_input) {
        Ok(structure) => structure,
        Err(e) => {
            eprintln!("Error parsing .forsure file: {}", e);
            return Err(e);
        }
    };


    // 6. Print the parsed structure (for debugging)
    println!("\nFinal Parsed Project Structure:");
    print_structure(&project_structure, 0);

    // 7. Create the project structure on disk using the creator module
    let output_dir = std::path::Path::new("output_project"); // std::path::Path is still used here
    match create_project_structure(&project_structure, output_dir) {
        Ok(_) => println!("\nProject structure created successfully in '{}'", output_dir.display()),
        Err(e) => eprintln!("\nError creating project structure: {}", e),
    }

    Ok(())
}