use std::path::PathBuf;

// Basic struct to represent a file or directory item
#[derive(Debug, Default, Clone)] // Added Clone derive for easier handling in parser
pub struct ProjectItem {
    pub item_type: String,
    pub name: String,
    pub path: Option<String>,
    pub full_path: Option<PathBuf>, // Calculated full path from the root
    pub description: Option<String>,
    pub purpose: Option<String>,
    pub note: Option<String>,
    pub example: Option<String>,
    pub content_pattern: Option<String>,
    pub children: Vec<ProjectItem>, // Nested items
}

// Define the different types of tokens our lexer will recognize
#[derive(Debug, PartialEq, Clone)] // Added Clone derive
pub enum Token {
    // Structural elements
    Heading(u8), // Heading level 1-6
    ListItemMarker, // '-' or '*' at the start of a list item line

    // Custom HTML-like tags
    CustomTagStart(String), // e.g., "<description>" -> CustomTagStart("description")
    CustomTagEnd(String),   // e.g., "</description>" -> CustomTagEnd("description")

    // Code blocks
    CodeBlockStart(Option<String>), // e.g., "```rust" -> CodeBlockStart(Some("rust")), "```" -> CodeBlockStart(None)

    // Content
    Text(String), // Any other text content
    Newline,
    EndOfFile,

    // Error token
    Error(String),
}

#[derive(Debug, PartialEq, Clone, Default)] // Added Default derive
pub enum ListItemParsingState {
    #[default] // Explicitly mark None as the default state
    None,
    CapturingTagContent(String), // State indicating we are capturing content for a specific tag (tag name)
    CapturingCodeBlock, // State to indicate we are capturing content within a code block
}

// Removed unused enum from previous parser: ListItemParsingState - replaced by the one above.