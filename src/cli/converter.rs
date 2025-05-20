use std::env;
use std::fs::{self, DirEntry};
use std::io;
use std::path::Path;

fn main() -> io::Result<()> {
    // Assume the first argument is the path to the repository
    let args: Vec<String> = env::args().collect();
    let repo_path = &args[1];

    // Generate ForSure representation
    let forsure_content = visit_dirs(Path::new(repo_path), &convert_to_forsure)?;

    // Output the ForSure file content to stdout or write it to a file
    println!("{}", forsure_content);

    Ok(())
}

// Function to convert a directory entry to a ForSure style string
fn convert_to_forsure(entry: &DirEntry) -> String {
    // This is where you define how a filesystem entity is represented in ForSure syntax
    // Placeholder for demonstration: just use the file name
    let file_name = entry.file_name().into_string().unwrap_or_default();
    format!("file: {}\n", file_name)
}

// Function to recursively visit directories and apply conversion function
fn visit_dirs(dir: &Path, cb: &dyn Fn(&DirEntry) -> String) -> io::Result<String> {
    let mut forsure_representation = String::new();

    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                // Recursively visit subdirectories
                forsure_representation += &visit_dirs(&path, cb)?;
            } else {
                // Apply the conversion function to each file
                forsure_representation += &cb(&entry);
            }
        }
    }

    Ok(forsure_representation)
}