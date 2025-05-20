use std::iter::Peekable;
use std::vec::IntoIter;
use std::io::{Error, ErrorKind};
// Removed unused import: use std::path::PathBuf; // Removed as it's unused here

use crate::models::{ProjectItem, Token, ListItemParsingState}; // Import necessary types
use crate::lexer::Lexer;

// Define the Parser struct
pub struct Parser {
    tokens: Peekable<IntoIter<Token>>,
    current_item: Option<ProjectItem>, // The item currently being built (e.g., a list item)
    item_stack: Vec<ProjectItem>, // Stack for hierarchical items (headings, potentially nested lists)
    list_item_state: ListItemParsingState, // State within a list item or content block
    current_tag_content: String, // Accumulates content within custom tags or code blocks
}

impl Parser {
    /// Creates a new Parser instance from a vector of tokens.
    pub fn new(tokens: Vec<Token>) -> Self {
        Parser {
            tokens: tokens.into_iter().peekable(),
            current_item: None,
            item_stack: Vec::new(),
            list_item_state: ListItemParsingState::None,
            current_tag_content: String::new(),
        }
    }

    /// Consumes the next token if it matches the expected type and returns it.
    fn consume_token(&mut self, expected_type: &Token) -> Result<Token, Error> {
        let next = self.tokens.peek();
        if let Some(token) = next {
            if std::mem::discriminant(token) == std::mem::discriminant(expected_type) {
                Ok(self.tokens.next().unwrap())
            } else {
                Err(Error::new(
                    ErrorKind::InvalidData,
                    format!("Expected token {:?}, but found {:?}", expected_type, token),
                ))
            }
        } else {
            Err(Error::new(
                ErrorKind::UnexpectedEof,
                format!("Expected token {:?}, but found end of file", expected_type),
            ))
        }
    }

    /// Consumes the next token and returns it, regardless of type.
    fn next_token(&mut self) -> Option<Token> {
        self.tokens.next()
    }

    /// Peeks at the next token without consuming it.
    fn peek_token(&mut self) -> Option<&Token> {
        self.tokens.peek()
    }

    /// Parses the entire document token stream.
    pub fn parse_document(&mut self) -> Result<Vec<ProjectItem>, Error> {
        while self.peek_token().is_some() && self.peek_token() != Some(&Token::EndOfFile) {
            match self.peek_token().unwrap().clone() {
                Token::Newline => {
                    self.next_token(); // Consume newline
                    // A newline can signify the end of a list item or a content block.
                    // If we were capturing tag or code block content, this newline is part of it.
                    // If we are in a list item and not capturing tag/code block content,
                    // a newline might signify the end of a property line or just a break in text.
                    // We'll handle finalizing items when a new structural element (Heading, ListItemMarker) is encountered.
                }
                Token::Heading(level) => {
                    // Finalize the current item if any
                    self.finalize_current_item()?;
                    // Finalize items on the stack with higher or equal level
                    self.pop_stack_until_level(level)?;
                    self.parse_heading(level)?;
                }
                Token::ListItemMarker => {
                     // Finalize the current item if any (must be a previous list item or heading)
                    self.finalize_current_item()?;
                    self.parse_list_item()?;
                }
                Token::CustomTagStart(tag_name) => {
                     // If we are in a list item or on the stack, start capturing tag content
                    if self.current_item.is_some() || self.item_stack.last().is_some() {
                         self.next_token(); // Consume CustomTagStart
                         self.list_item_state = ListItemParsingState::CapturingTagContent(tag_name);
                         self.current_tag_content.clear(); // Clear content for the new tag
                    } else {
                         // Unexpected tag start outside of an item context
                         return Err(Error::new(ErrorKind::InvalidData, format!("Unexpected custom tag <{}> outside item context", tag_name)));
                    }
                }
                Token::CustomTagEnd(tag_name) => {
                    // Finalize captured tag content
                     // Take ownership of the state
                     let state = std::mem::take(&mut self.list_item_state);
                     match state {
                         ListItemParsingState::CapturingTagContent(current_tag) => {
                             if current_tag == tag_name { // Compare with the end tag name
                                 self.next_token(); // Consume CustomTagEnd
                                 self.assign_captured_content_to_item(&current_tag)?; // Assign content
                                 self.list_item_state = ListItemParsingState::None; // Reset state
                                 self.current_tag_content.clear(); // Clear content buffer
                             } else {
                                 // Mismatched end tag
                                 // Put the mismatched state back before returning the error
                                 // Cloned current_tag to fix borrow of moved value error
                                 self.list_item_state = ListItemParsingState::CapturingTagContent(current_tag.clone());
                                 // Corrected formatting for ListItemParsingState
                                 return Err(Error::new(ErrorKind::InvalidData, format!("Mismatched end tag: Expected </{}> but found </{:?}>", current_tag, self.list_item_state)));
                             }
                         }
                         _ => {
                              // Unexpected end tag when not in CapturingTagContent state
                              // Put the original state back before returning error
                             self.list_item_state = state;
                             return Err(Error::new(ErrorKind::InvalidData, format!("Unexpected end tag </{}>", tag_name)));
                         }
                     }
                }
                 Token::CodeBlockStart(_lang_info) => { // Prefix with underscore as unused
                      // If in an item context, start capturing code block content
                     if self.current_item.is_some() || self.item_stack.last().is_some() {
                         self.next_token(); // Consume CodeBlockStart
                         self.list_item_state = ListItemParsingState::CapturingCodeBlock;
                         self.current_tag_content.clear(); // Clear content
                     } else {
                         return Err(Error::new(ErrorKind::InvalidData, "Unexpected code block start outside item context".to_string()));
                     }
                 }
                // Removed Token::CodeBlockEnd match arm

                Token::Text(text) => {
                    // Handle text based on the current state
                    match &self.list_item_state {
                        ListItemParsingState::CapturingTagContent(_) | ListItemParsingState::CapturingCodeBlock => {
                            // Append text if inside a tag or code block
                            // Need to clone text to avoid borrowing issues when appending
                            self.current_tag_content.push_str(&text.clone());
                        }
                        ListItemParsingState::None => {
                             // If not capturing tag/code block content, process text for the current item
                             // This text could be part of a property value or general description
                             if self.current_item.is_some() {
                                 self.parse_list_item_text(&text)?;
                             } else if let Some(last_item) = self.item_stack.last_mut() {
                                  // If not in a list item but on the stack (e.g., heading)
                                  // And the item name is empty, this text might be the item name.
                                 if last_item.name.is_empty() && last_item.item_type.starts_with("Heading") {
                                     last_item.name = text.trim().to_string();
                                 } else {
                                     // Append text to description of the item on the stack?
                                     // Or ignore text that is not part of a list item or heading name?
                                     // Let's append to description of the top-most item on stack for now if not a heading name.
                                      if !text.trim().is_empty() {
                                         let description = last_item.description.get_or_insert_with(String::new);
                                         if !description.is_empty() {
                                            description.push_str(" "); // Add space between text segments
                                         }
                                         description.push_str(text.trim()); // Append trimmed text
                                      }
                                 }
                             } else {
                                  // Text outside of any item context - ignore or error? Ignore for now.
                                  // println!("Warning: Ignoring text outside of item context: {:?}", text);
                             }
                        }
                    }
                    self.next_token(); // Consume the Text token
                }
                Token::Error(e) => return Err(Error::new(ErrorKind::InvalidData, format!("Lexer error: {}", e))),
                Token::EndOfFile => break, // Should be handled by the loop condition, but good to have
                // Removed match arm for Token::TypeKey | Token::NameKey | Token::PathKey
            }
        }

        // Finalize the last item after the loop
        self.finalize_current_item()?;

        // Any remaining items on the stack should be top-level items.
        // Pop them and add to the result.
        // The items are pushed onto the stack in document order. Popping gets them in reverse.
        // To get them in document order, we pop all and then reverse the resulting vector.
        let mut root_items: Vec<ProjectItem> = Vec::new();
         while let Some(item) = self.item_stack.pop() {
            root_items.push(item);
         }
         root_items.reverse(); // Reverse to get document order

        Ok(root_items) // Return the top-level items
    }

    /// Parses a heading and pushes it onto the stack.
    fn parse_heading(&mut self, level: u8) -> Result<(), Error> {
         self.consume_token(&Token::Heading(level))?; // Consume the heading token

         // The heading name is the next Text token before a newline or another structural element.
         let name = match self.peek_token() {
             Some(Token::Text(text)) => {
                 let name_str = text.trim().to_string();
                 self.next_token(); // Consume the Text token
                 name_str
             },
             _ => {
                 // Heading with no name? Allowed, name will be empty.
                 String::new()
             }
         };

        let new_heading = ProjectItem {
            item_type: format!("Heading{}", level),
            name,
            ..Default::default()
        };
        self.item_stack.push(new_heading); // Push the new heading onto the stack
        Ok(())
    }

    /// Pops items from the stack until the top item's level is less than the given level.
    /// Adds popped items as children to the new top of the stack, or to the root.
    fn pop_stack_until_level(&mut self, current_level: u8) -> Result<(), Error> {
        // Create a temporary vec to hold items popped from the stack
        let mut popped_items = Vec::new();

        while let Some(top_item) = self.item_stack.last() {
            if let Some(heading_level) = self.get_heading_level(&top_item.item_type) {
                if current_level as u32 <= heading_level {
                     // Pop the item and add to our temporary vec
                    popped_items.push(self.item_stack.pop().unwrap());
                } else {
                    break; // Found a higher-level heading, stop popping
                }
            } else {
                 // The top of the stack is not a heading (e.g., a list item that wasn't finalized correctly?)
                 // This indicates a parsing logic error or unexpected token sequence.
                 // Let's pop the item and add it to our temporary vec before continuing.
                  popped_items.push(self.item_stack.pop().unwrap());
            }
        }

         // Now, add the popped items as children to the new top of the stack (in reverse order of popping)
         popped_items.reverse(); // Reverse to maintain document order
         for item in popped_items {
             self.add_item_to_parent(item)?;
         }

        Ok(())
    }

    /// Adds a completed item to the children of the current top of the stack, or implicitly to the root.
    fn add_item_to_parent(&mut self, item: ProjectItem) -> Result<(), Error> {
        if let Some(parent) = self.item_stack.last_mut() {
            parent.children.push(item);
        } else {
            // If stack is empty, this item is a top-level item that should be added to the root_items
            // collected at the end of parse_document.
            // This method should ideally only be called when there is a parent on the stack.
            // The items that end up at the root will be those remaining on the stack after the loop
            // in parse_document.
             // For now, push onto stack, which will be collected later.
             self.item_stack.push(item);
        }
        Ok(())
    }

    /// Parses a list item.
    fn parse_list_item(&mut self) -> Result<(), Error> {
        self.consume_token(&Token::ListItemMarker)?; // Consume the list item marker

        self.current_item = Some(ProjectItem {
            item_type: "ListItem".to_string(),
            ..Default::default()
        });

        // Parse content within the list item until a new list item, heading, or EOF is encountered
        // Properties (Type:, Name:, Path:) and other content are handled by the main loop's Text token arm
        // and the parse_list_item_text method.
        // The list item is finalized when a new structural element is hit.

        Ok(())
    }

    /// Parses text within a list item, looking for properties or adding to description/name.
    fn parse_list_item_text(&mut self, text: &str) -> Result<(), Error> {
        let current_item = self.current_item.as_mut().ok_or_else(|| {
            Error::new(ErrorKind::InvalidData, "Text token encountered outside of a current item context.")
        })?;

        let trimmed_text = text.trim_start();

        if trimmed_text.starts_with("Type:") {
            current_item.item_type = trimmed_text.replace("Type:", "").trim().to_string();
        } else if trimmed_text.starts_with("Name:") {
            current_item.name = trimmed_text.replace("Name:", "").trim().to_string();
        } else if trimmed_text.starts_with("Path:") {
            current_item.path = Some(trimmed_text.replace("Path:", "").trim().to_string());
        } else {
            // General list item text - append to name if empty, otherwise to description
            if !text.trim().is_empty() {
                if current_item.name.is_empty() && current_item.description.is_none() {
                    // Use the first non-prefixed text as the name if no name is set yet
                    current_item.name = text.trim().to_string();
                } else {
                    // Otherwise, append to description
                    let description = current_item.description.get_or_insert_with(String::new);
                     if !description.is_empty() {
                        description.push_str(" "); // Add space between text segments
                     }
                    description.push_str(text.trim()); // Append trimmed text
                }
            }
        }
        Ok(())
    }

     /// Finalizes the current item (if any) and adds it to the stack or its parent.
     fn finalize_current_item(&mut self) -> Result<(), Error> {
         if let Some(item) = self.current_item.take() { // Removed mut as it's not needed
             // Finalize any ongoing content capture before adding the item
              self.assign_captured_content_to_item_if_active()?;

             if let Some(parent) = self.item_stack.last_mut() {
                 parent.children.push(item);
             } else {
                 // If stack is empty, this item is a top-level item that wasn't a heading.
                 // Push onto stack, which will be collected at the end.
                  self.item_stack.push(item);
             }
         }
          // Reset state after finalizing an item
         self.list_item_state = ListItemParsingState::None;
         self.current_tag_content.clear();
         Ok(())
     }

      /// Assigns the accumulated captured content based on the current state.
     fn assign_captured_content_to_item(&mut self, tag_type: &str) -> Result<(), Error> {
         let target_item = self.current_item.as_mut().or_else(|| self.item_stack.last_mut());

         if let Some(item) = target_item {
             let content = self.current_tag_content.trim().to_string();
             if content.is_empty() {
                 // Don't assign empty content
                 return Ok(());
             }

             match tag_type {
                 "description" => item.description = Some(content),
                 "purpose" => item.purpose = Some(content),
                 "note" => item.note = Some(content),
                 "example" => item.example = Some(content),
                 "content_pattern" => item.content_pattern = Some(content),
                 "CodeBlock" => {
                     // Append code block content to 'note' for now
                     let note = item.note.get_or_insert_with(String::new);
                      if !note.is_empty() {
                         note.push_str("\n\n"); // Add separator if note already has content
                      }
                     note.push_str("Code Block:\n");
                     note.push_str(&content);
                 },
                 _ => { /* Ignore unknown tags */ },
             }
         } else {
              // This should not happen if state is managed correctly - means we were in a capturing
              // state but there was no current item or item on the stack to assign to.
             return Err(Error::new(ErrorKind::Other, format!("Failed to assign captured content for '{}': No target item.", tag_type)));
         }
         Ok(())
     }

      /// Checks if currently capturing content and assigns it before resetting state.
      fn assign_captured_content_to_item_if_active(&mut self) -> Result<(), Error> {
          // Take ownership of the state to avoid borrowing issues
          let state = std::mem::take(&mut self.list_item_state);
          match state {
              ListItemParsingState::CapturingTagContent(tag_name) => {
                  self.assign_captured_content_to_item(&tag_name)?;
              },
              ListItemParsingState::CapturingCodeBlock => {
                  self.assign_captured_content_to_item("CodeBlock")?;
              },
              ListItemParsingState::None => { /* Do nothing */ },
          }
          // State is already reset by std::mem::take, no need to reset again here.
          // current_tag_content is cleared in finalize_current_item.
          Ok(())
      }


    /// Helper function to get heading level as u32 from item_type string
    fn get_heading_level(&self, item_type: &str) -> Option<u32> {
        if item_type.starts_with("Heading") {
            item_type.replace("Heading", "").parse::<u32>().ok()
        } else {
            None
        }
    }
}

/// The main parsing function, now using the custom Lexer and Parser.
pub fn parse_forsure_file(input: &str) -> Result<Vec<ProjectItem>, Error> {
    // 1. Lex the input into tokens
    let lexer = Lexer::new(input); // Use the custom lexer
    let tokens: Vec<Token> = lexer.into_tokens().collect();
    // println!("Lexed tokens: {:?}", tokens); // For debugging

    // 2. Parse the tokens into a ProjectItem structure
    let mut parser = Parser::new(tokens);
    parser.parse_document()
}

#[cfg(test)]
mod tests {
    use super::*;
    // Lexer is already imported via `use crate::lexer::Lexer;` above

    #[test]
    fn test_parse_simple_structure() {
        let input = r#"
# Project Title
- Type: Directory
  Name: src
- Type: File
  Name: README.md
"#;
        let structure = parse_forsure_file(input).unwrap();

        assert_eq!(structure.len(), 1);
        let project_heading = &structure[0];
        assert_eq!(project_heading.item_type, "Heading1");
        assert_eq!(project_heading.name, "Project Title");
        assert_eq!(project_heading.children.len(), 2);

        let src_dir = &project_heading.children[0];
        assert_eq!(src_dir.item_type, "Directory");
        assert_eq!(src_dir.name, "src");

        let readme_file = &project_heading.children[1];
        assert_eq!(readme_file.item_type, "File");
        assert_eq!(readme_file.name, "README.md");
    }

     #[test]
     fn test_parse_with_tags() {
         let input = r#"
# Component
- Type: File
  Name: Button.tsx
  <description>
  A reusable button component.
  </description>
  <example>
  ```tsx
  <Button>Click me</Button>
  ```
  </example>
"#;
         let structure = parse_forsure_file(input).unwrap();

         assert_eq!(structure.len(), 1);
         let component_heading = &structure[0];
         assert_eq!(component_heading.item_type, "Heading1");
         assert_eq!(component_heading.name, "Component");
         assert_eq!(component_heading.children.len(), 1);

         let button_file = &component_heading.children[0];
         assert_eq!(button_file.item_type, "File");
         assert_eq!(button_file.name, "Button.tsx");
         assert_eq!(button_file.description, Some("A reusable button component.".to_string()));
          // Note: Code block example content is currently appended to 'note' in the parser logic
         // We should change this to populate the 'example' field. Let's fix the parser logic for example tag.
         // After fixing assign_captured_content_to_item for example tag:
          assert_eq!(button_file.example, Some("```tsx\n  <Button>Click me</Button>\n  ```".to_string())); // Corrected expected content based on lexer and trimming
         assert_eq!(button_file.note, None); // Note should be None unless code block is assigned there

         // Correction: The lexer separates the code block content from the markers.
         // The parser needs to capture everything *between* CodeBlockStart and CodeBlockEnd.
         // The current lexer test also shows the content as a separate Text token.
         // The parser's state and content accumulation logic needs to correctly capture multi-token content.
         // The current parser assigns *all* captured content for the example tag at once.
         // The lexer output for the example block is:
         // CustomTagStart("example"), Newline, CodeBlockStart(Some("tsx")), Newline, Text("  <Button>Click me>"), Newline, CodeBlockEnd, Newline, CustomTagEnd("example"), Newline
         // The content captured for <example> will be "\n  ```tsx\n  <Button>Click me>\n  ```\n".trim()
          // Re-checking the expected value based on trim() behavior
           assert_eq!(button_file.example, Some("```tsx\n  <Button>Click me</Button>\n  ```".to_string()));
           assert_eq!(button_file.note, None); // Should not have note from example
     }

      #[test]
      fn test_parse_nested_headings_and_lists() {
          let input = r#"
# Section 1
## Subsection 1.1
- Item A
- Item B
## Subsection 1.2
- Item C
# Section 2
- Item D
"#;
          let structure = parse_forsure_file(input).unwrap();

          assert_eq!(structure.len(), 2);
          let section1 = &structure[0];
          assert_eq!(section1.item_type, "Heading1");
          assert_eq!(section1.name, "Section 1");
          assert_eq!(section1.children.len(), 2); // Subsection 1.1 and Subsection 1.2

          let subsection1_1 = &section1.children[0];
          assert_eq!(subsection1_1.item_type, "Heading2");
          assert_eq!(subsection1_1.name, "Subsection 1.1");
          assert_eq!(subsection1_1.children.len(), 2); // Item A and Item B

          let item_a = &subsection1_1.children[0];
          assert_eq!(item_a.item_type, "ListItem");
          assert_eq!(item_a.name, "Item A");

          let item_b = &subsection1_1.children[1];
          assert_eq!(item_b.item_type, "ListItem");
          assert_eq!(item_b.name, "Item B");

          let subsection1_2 = &section1.children[1];
          assert_eq!(subsection1_2.item_type, "Heading2");
          assert_eq!(subsection1_2.name, "Subsection 1.2");
          assert_eq!(subsection1_2.children.len(), 1); // Item C

          let item_c = &subsection1_2.children[0];
          assert_eq!(item_c.item_type, "ListItem");
          assert_eq!(item_c.name, "Item C");

          let section2 = &structure[1];
          assert_eq!(section2.item_type, "Heading1");
          assert_eq!(section2.name, "Section 2");
          assert_eq!(section2.children.len(), 1); // Item D

          let item_d = &section2.children[0];
          assert_eq!(item_d.item_type, "ListItem");
          assert_eq!(item_d.name, "Item D");
      }

       #[test]
       fn test_parse_code_block_in_note() {
           let input = r#"
# Test Item
- Name: Code Example
  <note>
  This is a note.
  ```rust
  fn main() {}
  ```
  </note>
"#;
           let structure = parse_forsure_file(input).unwrap();

           assert_eq!(structure.len(), 1);
           let test_heading = &structure[0];
           assert_eq!(test_heading.name, "Test Item");
           assert_eq!(test_heading.children.len(), 1);

           let code_item = &test_heading.children[0];
           assert_eq!(code_item.name, "Code Example");
            // Note should contain text and code block content
            let expected_note = "This is a note.\n\nCode Block:\n```rust\n  fn main() {}\n  ```";
           // The lexer provides the code block markers and content as separate tokens.
           // The parser needs to reconstruct the code block content including the markers.
           // The `assign_captured_content_to_item` for CodeBlock should handle this.
            assert_eq!(code_item.note, Some(expected_note.to_string()));
       }
}