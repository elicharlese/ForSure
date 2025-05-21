use std::path::PathBuf;

// Define the different types of project items
#[derive(Debug, PartialEq, Clone, Default)] // Added Default derive
pub enum ItemType {
    #[default] // Explicitly mark Unknown as the default state
    Project,
    Directory,
    File,
    ListItem,
    Unknown,
}

// Basic struct to represent a file or directory item
#[derive(Debug, Default, Clone, PartialEq)] // Added PartialEq for testing
pub struct ProjectItem {
    pub item_type: ItemType, // Changed type to use the ItemType enum
    pub name: String,
    pub path: Option<String>,
    pub full_path: Option<PathBuf>, // Calculated full path from the root (will need to be set during creation)
    pub description: Option<String>,
    pub purpose: Option<String>,
    pub note: Option<String>,
    pub example: Option<String>,
    pub content_pattern: Option<String>,
    pub command: Option<String>, // Command to execute for this item
    pub children: Vec<ProjectItem>, // Nested items
    pub content: Option<String>, // General content for the item
}

impl ProjectItem {
    // Added a constructor function
    pub fn new(item_type: ItemType, name: String, content: Option<String>, children: Vec<ProjectItem>) -> Self {
        Self {
            item_type,
            name,
            path: None,
            full_path: None,
            description: None,
            purpose: None,
            note: None,
            example: None,
            content_pattern: None,
            command: None,
            children,
            content,
        }
    }
}


// Define the different types of tokens our lexer will recognize
#[derive(Debug, PartialEq, Clone)] // Added Clone derive
pub enum Token {
    // Structural elements
    Heading(u8), // Heading level 1-6
    ListItemMarker, // '-' or '*' at the start of a list item line

    // Custom HTML-like tags and attributes
    LessThan,       // '<'
    GreaterThan,    // '>'
    Equals,         // '='
    QuotedString(String), // e.g., "\"value\"" -> QuotedString("value")
    Identifier(String), // e.g., "name" in <name="value"> or tag names like "file"

    // Add custom tag tokens
    CustomTagStart(String), // e.g., "<file>" -> CustomTagStart("file")
    CustomTagEnd, // e.g., "</file>" -> CustomTagEnd

    // Code blocks
    CodeBlockStart(Option<String>), // e.g., "```rust" -> CodeBlockStart(Some("rust")), "```" -> CodeBlockStart(None)
    CodeBlockEnd, // ```

    // Content
    Text(String), // Any other text content
    Newline,
    EndOfFile,

    // Error token from lexer
    Error(String),
}

// Define the parsing state
#[derive(Debug, PartialEq, Clone)]
pub enum ParsingState {
    ExpectingStructuralElement, // Initial state, expecting a heading, list item, or custom tag
    InHeading,                  // Just parsed a heading, expecting text for the name
    InListItem,                 // Just parsed a list item marker, expecting text for the name
    InCustomTag,                // Inside a custom tag (e.g., <file>, <directory>, <description>)
    InAttributes,               // Parsing attributes within a custom tag or after item name
    InCodeBlock,                // Inside a code block
    InContent,                  // Accumulating general text content for an item
}


#[derive(Debug, PartialEq, Clone, Default)] // Added Default and PartialEq derive
pub enum ListItemParsingState {
    #[default] // Explicitly mark None as the default state
    None,
    CapturingTagContent, // State indicating we are capturing content for a specific tag (tag name)
    CapturingCodeBlock, // State to indicate we are capturing content within a code block
}