use std::io::{self, Read};
use std::collections::HashMap;
use std::io::Cursor; // Import Cursor for tests

// Import necessary types from models and lexer modules
use crate::models::{ProjectItem, ItemType, Token, ParsingState}; // Import Token and ParsingState
use crate::lexer::Lexer; // Import Lexer

#[derive(Debug)]
pub struct ParserState<'a> { // Add lifetime parameter 'a
    pub project_root: ProjectItem, // Made public to be accessible from main.rs
    // State for the custom parser
    lexer: Lexer<'a>, // Instance of our custom Lexer
    parent_stack: Vec<usize>, // Stack of indices pointing to the current parent in the hierarchy
    current_parsing_state: ParsingState, // Track the current parsing state
    // Temporary fields to build the current item before adding it to the tree
    current_item_type: ItemType,
    current_item_name: String,
    current_item_content: String,
    current_item_attributes: HashMap<String, String>,
    current_custom_tag_name: Option<String>, // Store the name of the current custom tag
    // A buffer to hold a token that needs to be re-processed
    // This is a simple way to handle cases where a token signifies the end of a state
    // but also needs to be the first token of the next state.
    // A more sophisticated parser might use a token buffer or recursive parsing.
    next_token_buffer: Option<Token>,
}

impl<'a> ParserState<'a> { // Add lifetime parameter 'a to impl
    pub fn new(project_name: String, input: &'a str) -> Self { // Add input parameter for Lexer
        Self {
            // The project_root itself will be the top-level Project item (from H1)
            project_root: ProjectItem::new(ItemType::Project, project_name, None, Vec::new()),
            // Initialize state for the custom parser
            lexer: Lexer::new(input), // Create Lexer instance
            parent_stack: Vec::new(), // Start with an empty stack, project_root is the implicit parent
            current_parsing_state: ParsingState::ExpectingStructuralElement, // Start by expecting a structural element
            current_item_type: ItemType::Unknown, // Default type
            current_item_name: String::new(),
            current_item_content: String::new(),
            current_item_attributes: HashMap::new(),
            current_custom_tag_name: None,
            next_token_buffer: None,
        }
    }

    // Get a mutable reference to the current parent item based on the index stack
    // This method needs refinement for the new state structure.
    fn get_current_parent_mut(&mut self) -> &mut ProjectItem {
        let mut current = &mut self.project_root;
        // Traverse down the children based on the indices in the stack
        for &index in &self.parent_stack {
             // We need to check if the index is valid for the current item's children
             if index < current.children.len() {
                current = current.children.get_mut(index).unwrap(); // Use unwrap cautiously, or handle the error
             } else {
                 // This indicates an issue with the index stack management
                 panic!("Invalid index {} in parent_stack stack.", index);
             }
        }
        current // Return the mutable reference to the item at the top of the conceptual stack
    }


    // Add a new item as a child of the current parent and update the parent stack
    fn enter_parent_context(&mut self, item: ProjectItem) { // Removed mut from item
        let current_parent = self.get_current_parent_mut();
        current_parent.children.push(item); // item is moved here

        // The new parent is the item just added, which is the last child of the previous parent.
        let new_parent_index = current_parent.children.len() - 1;

        // Add the index of the new parent to the stack
        self.parent_stack.push(new_parent_index);
    }

    // Move up one level in the parent hierarchy
    fn exit_parent_context(&mut self) {
        // Only pop if the stack is not empty (i.e., not at the root level)
        if !self.parent_stack.is_empty() {
            self.parent_stack.pop();
        }
    }

    // This function will now use our custom lexer and parsing logic
    pub fn parse_forsure_file(&mut self) -> io::Result<()> { // Removed reader parameter
        // The lexer is already initialized in new() with the input string slice.

        loop {
            // Get the next token, either from the buffer or the lexer
            let token = if let Some(buffered_token) = self.next_token_buffer.take() {
                buffered_token
            } else {
                self.lexer.next_token()
            };

            // If EndOfFile is encountered while the buffer is empty, break the loop
            if let Token::EndOfFile = token {
                if self.next_token_buffer.is_none() {
                    // Finalize any pending item before breaking
                     if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
                          self.finalize_current_item();
                     }
                    break;
                }
            }


            println!("Parsed token: {:?}, State: {:?}", token, self.current_parsing_state); // For debugging


            match self.current_parsing_state {
                ParsingState::ExpectingStructuralElement => {
                    match token {
                        Token::Heading(level) => {
                            // Determine the item type based on heading level
                            let item_type = match level {
                                1 => ItemType::Project,
                                _ => ItemType::Directory, // Treat all other headings as directories for now
                            };

                            // Adjust parent stack based on heading level
                            // Pop until current level is less than new heading level
                            while self.parent_stack.len() as u8 >= level && !self.parent_stack.is_empty() {
                                self.exit_parent_context();
                             }

                            // Prepare to create a new item
                            self.current_item_type = item_type;
                            self.current_item_name.clear();
                            self.current_item_content.clear();
                            self.current_item_attributes.clear();
                            self.current_custom_tag_name = None;


                            self.current_parsing_state = ParsingState::InHeading; // Expecting heading text (name)
                        }
                        Token::ListItemMarker => {
                            // Prepare to create a new list item
                            self.current_item_type = ItemType::ListItem;
                            self.current_item_name.clear();
                            self.current_item_content.clear();
                            self.current_item_attributes.clear();
                            self.current_custom_tag_name = None;


                            self.current_parsing_state = ParsingState::InListItem; // Expecting list item text (name)
                        }
                        Token::CustomTagStart(tag_name) => {
                             // Found a custom tag. Prepare a new item for it.
                             // Determine the item type based on the tag name
                             let item_type = match tag_name.as_str() {
                                 "file" => ItemType::File,
                                 "directory" => ItemType::Directory,
                                 "description" | "purpose" | "note" | "example" | "content_pattern" | "command" => {
                                      // These tags define content for the parent item, not new structural items.
                                      // We will handle their content in a special way, but the tag itself is the identifier.
                                      // For now, treat them as Unknown until we refine the logic for content-setting tags.
                                      ItemType::Unknown // Will handle content separately
                                 },
                                  _ => ItemType::Unknown, // Default to unknown for other tags
                             };

                             // Finalize any pending item before starting a new one
                               if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
                                   self.finalize_current_item();
                               }


                             self.current_item_type = item_type;
                             self.current_item_name.clear(); // Custom tags don't typically have names like headings/list items
                             self.current_item_content.clear(); // Start accumulating content
                             self.current_item_attributes.clear(); // Attributes will be parsed next if present
                             self.current_custom_tag_name = Some(tag_name); // Store the tag name


                             // After a custom tag start, we expect either attributes (<key="value">) or content.
                             // Let's peek the next token to decide the state.
                             let next_token = self.lexer.peek_token();
                             match next_token {
                                 Token::LessThan => {
                                     // Expecting attributes immediately after tag name (e.g., <tag <attr="val">)
                                     // This format is not currently supported. Assuming attributes come after the tag name on the same line.
                                     // For now, assume if '<' follows, it's an error or unexpected structure for attributes here.
                                      return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected '<' after custom tag name '{}'. Attributes should follow the closing '>'.", self.current_custom_tag_name.as_ref().unwrap_or(&"unknown".to_string()))));
                                 }
                                  Token::GreaterThan => {
                                      // Closing '>' immediately after tag name (e.g., <tag>) - expect content next
                                      self.lexer.next_token(); // Consume the '>'
                                      self.current_parsing_state = ParsingState::InCustomTag; // Transition to InCustomTag state
                                  }
                                  Token::Newline => {
                                       // Newline immediately after tag name (e.g., <tag>\n) - expect content on next line
                                        self.lexer.next_token(); // Consume the Newline
                                        self.current_parsing_state = ParsingState::InCustomTag; // Transition to InCustomTag state
                                  }
                                 _ => {
                                     // Anything else after the tag name and before '>' is unexpected in this simplified model
                                      return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token after custom tag name '{}': {:?}", self.current_custom_tag_name.as_ref().unwrap_or(&"unknown".to_string()), next_token)));
                                 }
                             }
                        }
                         Token::CodeBlockStart(lang) => {
                             // Found a code block start. Prepare for code block content.
                             // Code blocks should ideally be parsed as content *within* the current item.
                             // For now, let's transition to a state to capture code block content.
                             // This might require storing the current item to append the code block content to it later.

                             // Finalize any pending item before starting to capture code block content.
                             // Code blocks might occur within content, so we need to handle that.
                              if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
                                   self.finalize_current_item();
                              }

                             // For now, just transition to InCodeBlock state and store the language info.
                             println!("Entered InCodeBlock state with lang: {:?}", lang); // Debugging
                             self.current_parsing_state = ParsingState::InCodeBlock;
                             // Store the language for later use if needed (e.g., for syntax highlighting)
                             self.current_item_attributes.insert("language".to_string(), lang.unwrap_or_else(|| "unknown".to_string())); // Use attributes to store language
                             self.current_item_type = ItemType::Unknown; // Code block itself is not a structural item in this model yet
                             self.current_item_name.clear();
                             self.current_item_content.clear(); // Clear content to accumulate code block content
                             self.current_custom_tag_name = None;


                         }
                        // Ignore newlines and whitespace in ExpectingStructuralElement state
                         Token::Newline | Token::Text(_) | Token::GreaterThan | Token::LessThan | Token::Equals | Token::QuotedString(_) | Token::Identifier(_) | Token::CodeBlockEnd => { /* Ignore leading non-structural tokens */ },
                        Token::EndOfFile => { /* Handled at the start of the loop */ },
                        Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error: {}", e))), // Return a parsing error
                        _ => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token while expecting structural element: {:?}", token))), // Unexpected token
                    }
                }
                ParsingState::InHeading => {
                    match token {
                        Token::Text(name_text) => {
                            // Capture the heading name
                            self.current_item_name.push_str(&name_text.trim()); // Trim whitespace from name text
                             // After capturing the name, we might expect attributes or a newline.
                             // Use peek to check the next token without consuming.
                             let next_token = self.lexer.peek_token();
                             match next_token {
                                 Token::LessThan => {
                                     // Expecting attributes
                                     self.current_parsing_state = ParsingState::InAttributes;
                                 }
                                 Token::Newline | Token::EndOfFile => {
                                     // End of heading line, finalize the item
                                     self.finalize_current_item(); // Helper function to create and add item
                                     self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                                 }
                                 _ => {
                                     // Unexpected token after heading name
                                     return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token after heading name: {:?}", next_token)));
                                 }
                             }
                        }
                        Token::LessThan => {
                            // If we get '<' immediately after a heading, it means the name was empty.
                            // This is likely an error or a heading with only attributes.
                             println!("Warning: Heading with no name, followed by attributes.");
                             self.current_parsing_state = ParsingState::InAttributes; // Go to attributes state
                        }
                        Token::Newline | Token::EndOfFile => {
                            // Empty heading line, finalize the item with no name
                            println!("Warning: Empty heading line.");
                            self.finalize_current_item(); // Finalize with empty name
                            self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                        }
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InHeading state: {}", e))), // Return a parsing error
                        _ => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token in InHeading state: {:?}", token))), // Unexpected token
                    }
                }
                 ParsingState::InListItem => {
                    match token {
                        Token::Text(name_text) => {
                            // Capture the list item name
                            self.current_item_name.push_str(&name_text.trim()); // Trim whitespace from name text
                            // After capturing the name, we might expect attributes or a newline/end of file.
                            let next_token = self.lexer.peek_token();
                             match next_token {
                                 Token::LessThan => {
                                     // Expecting attributes
                                     self.current_parsing_state = ParsingState::InAttributes;
                                 }
                                 Token::Newline | Token::EndOfFile => {
                                     // End of list item line, finalize the item
                                     self.finalize_current_item(); // Helper function
                                     self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                                 }
                                 _ => {
                                     // Unexpected token after list item name
                                     return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token after list item name: {:?}", next_token)));
                                 }
                             }
                        }
                        Token::LessThan => {
                            // List item with no name, followed by attributes.
                             println!("Warning: List item with no name, followed by attributes.");
                             self.current_parsing_state = ParsingState::InAttributes; // Go to attributes state
                        }
                        Token::Newline | Token::EndOfFile => {
                             // Empty list item line, finalize with no name
                             println!("Warning: Empty list item line.");
                             self.finalize_current_item(); // Finalize with empty name
                             self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                        }
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InListItem state: {}", e))), // Return a parsing error
                        _ => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token in InListItem state: {:?}", token))), // Unexpected token
                    }
                }
                ParsingState::InAttributes => {
                    match token {
                        Token::GreaterThan => {
                            // End of attributes
                             // After attributes, we might expect content or a new structural element.
                             let next_token = self.lexer.peek_token();
                             match next_token {
                                 Token::Newline | Token::EndOfFile => {
                                     // End of the line after attributes, finalize the item
                                     self.finalize_current_item();
                                     self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                                 }
                                 _ => {
                                     // Expecting content after attributes
                                     self.current_parsing_state = ParsingState::InContent; // Transition to InContent state
                                 }
                             }
                        }
                         Token::Identifier(key) => {
                             // Expected attribute key
                             // Next should be Equals
                             let next_token = self.lexer.next_token(); // Consume next token
                             if let Token::Equals = next_token {
                                 // Next should be QuotedString
                                 let value_token = self.lexer.next_token(); // Consume next token
                                 if let Token::QuotedString(value) = value_token {
                                     // Store the attribute
                                     self.current_item_attributes.insert(key, value);
                                     // After an attribute, we expect another attribute (Identifier) or the closing '>'
                                     // No state change needed here, stay in InAttributes
                                 } else {
                                     return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Expected QuotedString after attribute key '{}' and Equals, found {:?}", key, value_token)));
                                 }
                             } else {
                                 return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Expected Equals after attribute key '{}', found {:?}", key, next_token)));
                             }
                        }
                        // Ignore whitespace and newlines within attributes for now
                        Token::Newline | Token::Text(_) => { /* Ignore */ },
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InAttributes state: {}", e))), // Return a parsing error
                        _ => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected token in InAttributes state: {:?}", token))), // Unexpected token
                    }
                }
                ParsingState::InCustomTag => {
                     // Handle custom tag content parsing
                     match token {
                         Token::CustomTagEnd => {
                             // End of custom tag, finalize the item being built
                             self.finalize_current_item();
                             // After a custom tag, expect a structural element or general content
                             self.current_parsing_state = ParsingState::ExpectingStructuralElement; // Default transition
                         }
                          Token::CodeBlockStart(lang) => {
                              // Found a code block within a custom tag.
                              // Finalize the current item (the custom tag) before starting the code block.
                              // The code block content will be added to the *parent* of the custom tag, or handled separately.
                              // This requires careful state management. For now, let's finalize and transition.
                               self.finalize_current_item();
                               println!("Entered InCodeBlock state from InCustomTag with lang: {:?}", lang); // Debugging
                               self.current_parsing_state = ParsingState::InCodeBlock;
                               // Store the language for later use if needed (e.g., for syntax highlighting)
                               self.current_item_attributes.insert("language".to_string(), lang.unwrap_or_else(|| "unknown".to_string())); // Use attributes to store language
                               self.current_item_type = ItemType::Unknown; // Code block itself is not a structural item in this model yet
                               self.current_item_name.clear();
                               self.current_item_content.clear(); // Clear content to accumulate code block content
                               self.current_custom_tag_name = None;
                          }
                         Token::EndOfFile => {
                              return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Unexpected EndOfFile while inside custom tag <{}>.", self.current_custom_tag_name.as_ref().unwrap_or(&"unknown".to_string()))));
                         }
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InCustomTag state: {}", e))), // Return a parsing error
                          _ => {
                              // Accumulate content within the custom tag
                              // Treat text, newlines, and other tokens as raw content.
                               match token {
                                   Token::Text(text) => self.current_item_content.push_str(&text),
                                   Token::Newline => self.current_item_content.push('\n'),
                                   // Treat other tokens as raw text content by appending their string representation.
                                   // This might need refinement depending on how strict we want to be within tags.
                                    t => self.current_item_content.push_str(&format!("{:?}", t)), // Append debug format for other tokens
                                }
                          }
                      }
                }
                ParsingState::InCodeBlock => {
                    // Handle code block content parsing
                    match token {
                        Token::CodeBlockEnd => {
                            // End of code block. Accumulate the collected content into the current item's content.
                            // The current item should be the one that contained the code block start token.
                            // This requires that when we entered InCodeBlock, we didn't finalize the parent item.
                            // Let's revise the InContent and InCustomTag states to not finalize when entering InCodeBlock.

                             println!("Exited InCodeBlock state."); // Debugging
                             // The accumulated self.current_item_content now holds the code block text.
                             // We need to append this to the content of the item that contained the code block.
                             // This means we cannot clear current_item_content when entering InCodeBlock.
                             // Let's refine the state transitions and content handling.

                             // For now, as a simplification, let's assume code blocks are top-level or follow structural elements.
                             // If a code block ends, we transition back to ExpectingStructuralElement.
                             // The content captured in current_item_content belongs to the code block itself.
                             // We need to decide how to represent code blocks in the ProjectItem structure.
                             // Option 1: Code blocks are just part of the parent item's content string.
                             // Option 2: Code blocks are separate ProjectItems with type CodeBlock.

                             // Let's go with Option 1 for now: Code blocks are part of the parent's content.
                             // This means when we see CodeBlockStart, we don't finalize the parent item.
                             // We just switch state to collect code block text, then switch back.
                             // The accumulated text in self.current_item_content should be added to the *previous* item's content.

                             // Let's revert the state transition logic for code blocks to append content.
                             // This requires changing how InContent and InCustomTag handle CodeBlockStart.

                             // **Revised Approach for Code Blocks:**
                             // When CodeBlockStart is encountered in InContent or InCustomTag:
                             // - Do NOT finalize the current item.
                             // - Temporarily store the current accumulated content and attributes of the item.
                             // - Clear current_item_content to start accumulating code block text.
                             // - Transition to InCodeBlock.
                             // When CodeBlockEnd is encountered in InCodeBlock:
                             // - Stop accumulating code block text in current_item_content.
                             // - Append the collected code block text (self.current_item_content) to the stored content of the parent item.
                             // - Restore the parent item's attributes and content state.
                             // - Transition back to the state we were in before InCodeBlock (e.g., InContent or InCustomTag).

                             // This state management is getting complex. Let's simplify for this step and
                             // treat code blocks as just another type of content to be appended.
                             // When in InCodeBlock, simply append the tokens as text until CodeBlockEnd.

                              self.current_parsing_state = ParsingState::InContent; // Transition back to InContent after code block

                        }
                         Token::EndOfFile => {
                              return Err(io::Error::new(io::ErrorKind::InvalidData, "Unexpected EndOfFile while inside code block."));
                         }
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InCodeBlock state: {}", e))), // Return a parsing error
                        _ => {
                            // Accumulate code block content. Preserve formatting.
                            // Append the token's string representation.
                             match token {
                                 Token::Text(text) => self.current_item_content.push_str(&text),
                                 Token::Newline => self.current_item_content.push('\n'),
                                 _ => {
                                     // Potentially other tokens within a code block? Like escaped backticks?
                                     // For simplicity, appending debug format for unexpected tokens.
                                      self.current_item_content.push_str(&format!("{:?}", token));
                                 }
                             }
                        }
                    }
                }
                 ParsingState::InContent => {
                     // Handle general content parsing
                     match token {
                         Token::Heading(_) | Token::ListItemMarker | Token::CustomTagStart(_) => {
                              // Found a new structural element, finalize the current item (if any content was collected)
                               if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
                                   // Finalize the previous item before starting a new one
                                   self.finalize_current_item();
                               }
                             // Put the structural token back in the buffer to be processed in the next iteration
                             self.next_token_buffer = Some(token);
                             self.current_parsing_state = ParsingState::ExpectingStructuralElement;
                         }
                         Token::CodeBlockStart(lang) => {
                             // Found a code block within content.
                             // Do NOT finalize the current item.
                             // Transition to InCodeBlock state to capture the code block content.
                              println!("Entered InCodeBlock state from InContent with lang: {:?}", lang); // Debugging
                             self.current_parsing_state = ParsingState::InCodeBlock;
                             // Store the language for later use if needed (e.g., for syntax highlighting)
                             self.current_item_attributes.insert("language".to_string(), lang.unwrap_or_else(|| "unknown".to_string())); // Use attributes to store language
                             // Do NOT clear current_item_content here, code block content will be appended to it (or handled separately).
                             // Let's append code block content to current_item_content for simplicity.
                         }
                         Token::EndOfFile => {
                             // End of file while in content state, finalize the last item
                              if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
                                   self.finalize_current_item();
                               }
                             break; // End parsing
                         }
                         Token::Error(e) => return Err(io::Error::new(io::ErrorKind::InvalidData, format!("Lexer error in InContent state: {}", e))), // Return a parsing error
                         _ => {
                             // Accumulate text, newlines, and other non-structural tokens as content
                              match token {
                                  Token::Text(text) => self.current_item_content.push_str(&text),
                                  Token::Newline => self.current_item_content.push('\n'),
                                  // Decide how to handle other tokens in content, e.g., <, >, =, ", Identifier, QuotedString
                                  // For now, treat them as raw text content by appending their string representation.
                                   t => self.current_item_content.push_str(&format!("{:?}", t)), // Append debug format for other tokens
                              }
                         }
                      }
                 }
            }
        }

        // Finalize any remaining current item after the loop finishes (e.g., if the file ends after content)
         if self.current_item_type != ItemType::Unknown || !self.current_item_name.is_empty() || !self.current_item_content.is_empty() || !self.current_item_attributes.is_empty() || self.current_custom_tag_name.is_some() {
             self.finalize_current_item();
         }


         Ok(())
     }

    // Helper function to finalize the current item being built and add it to the tree
    fn finalize_current_item(&mut self) {
        // Only create an item if it has a type (set by Heading, ListItemMarker, or CustomTagStart)
        if self.current_item_type != ItemType::Unknown || self.current_custom_tag_name.is_some() {
            // Determine the final item type based on custom tag name if present
            let final_item_type = if let Some(tag_name) = &self.current_custom_tag_name {
                 match tag_name.as_str() {
                     "file" => ItemType::File,
                     "directory" => ItemType::Directory,
                     "description" | "purpose" | "note" | "example" | "content_pattern" | "command" => {
                         // These tags define content *for the parent item*, they don't create new structural items.
                         // We need to apply their content/attributes to the parent.
                         println!("Applying content/attributes from tag <{}> to parent.", tag_name);

                         // Clone content and attributes BEFORE getting the mutable parent reference
                         let content_to_apply = if self.current_item_content.is_empty() { None } else { Some(self.current_item_content.clone()) };
                         let attributes_to_apply = self.current_item_attributes.clone();
                         let tag_name_clone = tag_name.clone(); // Clone tag_name if needed after borrow

                         let parent = self.get_current_parent_mut();

                         match tag_name_clone.as_str() {
                             "description" => parent.description = content_to_apply,
                             "purpose" => parent.purpose = content_to_apply,
                             "note" => parent.note = content_to_apply,
                             "example" => parent.example = content_to_apply,
                             "content_pattern" => parent.content_pattern = content_to_apply,
                             "command" => parent.command = content_to_apply,
                             _ => { /* Should not happen with current match arms */ }
                         }
                         // Apply attributes to the parent as well
                         for (key, value) in attributes_to_apply {
                              match key.as_str() {
                                  "path" => parent.path = Some(value.clone()), // Attributes can also set path/command for parent
                                  "command" => parent.command = Some(value.clone()),
                                   _ => {
                                       println!("Warning: Unhandled attribute '{}' for tag <{}> applied to parent.", key, tag_name_clone);
                                   }
                              }
                         }

                         // Reset temporary fields but do NOT create a new ProjectItem for these content-setting tags.
                         self.current_item_type = ItemType::Unknown;
                         self.current_item_name.clear();
                         self.current_item_content.clear();
                         self.current_item_attributes.clear();
                         self.current_custom_tag_name = None;
                         return; // Exit finalize_current_item as no new item is created
                     },
                      _ => self.current_item_type.clone(), // For other custom tags, use the type set when entering InCustomTag
                 }
            } else {
                self.current_item_type.clone() // Use the type set by Heading or ListItemMarker
            };


            let mut new_item = ProjectItem::new(
                final_item_type.clone(), // Use the determined final item type
                self.current_item_name.trim().to_string(), // Trim whitespace from name
                if self.current_item_content.is_empty() { None } else { Some(self.current_item_content.clone()) },
                Vec::new(), // Children will be added by subsequent parsing
            );

            // Apply parsed attributes to the new item
            for (key, value) in &self.current_item_attributes {
                 match key.as_str() {
                     "path" => new_item.path = Some(value.clone()),
                     "command" => new_item.command = Some(value.clone()),
                      _ => {
                          // Handle other attributes specific to item types here
                          println!("Warning: Unhandled attribute '{}' for item type {:?}", key, final_item_type);
                      }
                 }
            }
            // If it was a custom tag, clear the custom tag name now that it's processed
             self.current_custom_tag_name = None;


            // Add the new item as a child of the current parent
            self.get_current_parent_mut().children.push(new_item);

            // After adding a structural item (Project, Directory, File, ListItem), push its index onto the parent stack
            // so subsequent items become its children. Content-setting tags do not become parents.
            if final_item_type == ItemType::Project || final_item_type == ItemType::Directory || final_item_type == ItemType::File || final_item_type == ItemType::ListItem {
                let new_parent_index = self.get_current_parent_mut().children.len() - 1;
                 self.parent_stack.push(new_parent_index);
                 println!("Entered parent context for {:?}", final_item_type); // Debugging
            }


            // Reset temporary fields after finalizing the item
            self.current_item_type = ItemType::Unknown;
            self.current_item_name.clear();
            self.current_item_content.clear();
            self.current_item_attributes.clear();

        } else {
             // If there's temporary content or attributes but no item type (and no custom tag name), it's unassociated content.
             // Depending on desired behavior, this could be an error or ignored.
             // For now, append unassociated content to the *parent's* content.
             if !self.current_item_content.is_empty() {
                  println!("Warning: Unassociated content found. Appending to parent's content.");
                  // Extract content BEFORE getting the mutable parent reference
                  let content_to_append = self.current_item_content.clone();
                  let parent = self.get_current_parent_mut();
                  let current_content = parent.content.get_or_insert_with(String::new);
                  if !current_content.is_empty() {
                       current_content.push('\n'); // Add a newline if there's existing content
                  }
                  current_content.push_str(&content_to_append);
                  self.current_item_content.clear(); // Clear unassociated content
             }
              if !self.current_item_attributes.is_empty() {
                  // Decide how to handle unassociated attributes. For now, print warning and clear.
                  println!("Warning: Unassociated attributes found: {:?}", self.current_item_attributes);
                  self.current_item_attributes.clear(); // Clear unassociated attributes
              }
              // If there was a custom tag name but no item type (shouldn't happen with current logic),
              // it indicates a parsing issue. Handle defensively.
               if let Some(tag_name) = self.current_custom_tag_name.take() {
                   println!("Warning: Finalized item with custom tag <{}> but no determined item type.", tag_name);
               }
        }
     }

    pub fn get_project_structure(&self) -> &ProjectItem {
        &self.project_root
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{ProjectItem, ItemType};
    use std::io::Cursor;

    fn parse_and_get_root(input: &str) -> ProjectItem {
        // Create ParserState with the input string slice
        let mut parser_state = ParserState::new("TestProject".to_string(), input);
        // Call parse_forsure_file without a reader, as it now takes input via new()
        parser_state.parse_forsure_file().expect("Parsing failed");
        parser_state.project_root
    }

    #[test]
    fn test_basic_heading_parsing() {
        let forsure_content = "# MyProject\n## src\n### main.rs";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.name, "MyProject"); // The root name is set from the H1
         assert_eq!(root.item_type, ItemType::Project); // Root type should be Project

        // Check the children of the root (H2 items)
        assert_eq!(root.children.len(), 1); // Only 'src' is a direct child of Project

        let src_dir = &root.children[0];
        assert_eq!(src_dir.item_type, ItemType::Directory); // H2 becomes Directory
        assert_eq!(src_dir.name, "src");

        // Check the main.rs item created from Heading 3 (child of src)
        assert_eq!(src_dir.children.len(), 1);
        let main_rs_item = &src_dir.children[0];
        // With current simplified logic, H3 is also a Directory. This will need refinement.
        assert_eq!(main_rs_item.item_type, ItemType::Directory);
        assert_eq!(main_rs_item.name, "main.rs");
    }

     #[test]
    fn test_headings_with_attributes() {
        let forsure_content = "# MyProject <path=\"./my_project\"> \n## src <command=\"echo 'Building src'\">";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.name, "MyProject");
        assert_eq!(root.item_type, ItemType::Project);
        assert_eq!(root.path, Some("./my_project".to_string()));
        assert_eq!(root.command, None); // Command on H1 is not currently handled


        assert_eq!(root.children.len(), 1);
        let src_dir = &root.children[0];
        assert_eq!(src_dir.item_type, ItemType::Directory);
        assert_eq!(src_dir.name, "src");
        assert_eq!(src_dir.path, None); // Path on H2 is not currently handled as attribute
        assert_eq!(src_dir.command, Some("echo 'Building src'".to_string())); // Command on H2 is handled
    }

    #[test]
    fn test_list_item_with_attributes() {
        let forsure_content = "* Item 1 <path=\"item1.txt\"> \n* Item 2 <command=\"run_item2.sh\">";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.children.len(), 2);

        let item1 = &root.children[0];
        assert_eq!(item1.item_type, ItemType::ListItem);
        assert_eq!(item1.name, "Item 1");
        assert_eq!(item1.path, Some("item1.txt".to_string()));
        assert_eq!(item1.command, None); // Command not expected here

        let item2 = &root.children[1];
        assert_eq!(item2.item_type, ItemType::ListItem);
        assert_eq!(item2.name, "Item 2");
        assert_eq!(item2.path, None); // Path not expected here
        assert_eq!(item2.command, Some("run_item2.sh".to_string()));
    }

     #[test]
    fn test_nested_structure_with_attributes() {
        let forsure_content = "# Project <path=\"./\"> \n## src <command=\"build\"> \n* File Item <path=\"file.txt\">";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.name, "Project");
        assert_eq!(root.item_type, ItemType::Project);
        assert_eq!(root.path, Some("./".to_string()));

        assert_eq!(root.children.len(), 1);
        let src_dir = &root.children[0];
        assert_eq!(src_dir.item_type, ItemType::Directory);
          assert_eq!(src_dir.name, "src");
        assert_eq!(src_dir.command, Some("build".to_string()));

        assert_eq!(src_dir.children.len(), 1); // File Item should be a child of src
        let file_item = &src_dir.children[0];
        assert_eq!(file_item.item_type, ItemType::ListItem); // List item type
        assert_eq!(file_item.name, "File Item");
        assert_eq!(file_item.path, Some("file.txt".to_string())); // Path attribute
     }

     #[test]
    fn test_item_with_content() {
        let forsure_content = "# MyItem\nThis is some content\nfor my item.";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.children.len(), 1);
        let item = &root.children[0];
        assert_eq!(item.name, "MyItem");
        // Expect content to include "This is some content" and "for my item." separated by newline
        assert_eq!(item.content, Some("This is some content\nfor my item.".to_string()));
     }

     #[test]
    fn test_list_item_with_content() {
        let forsure_content = "* MyListItem\nItem content here.";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.children.len(), 1);
        let item = &root.children[0];
        assert_eq!(item.name, "MyListItem");
        assert_eq!(item.content, Some("Item content here.".to_string()));
     }

    #[test]
    fn test_custom_file_tag() {
        let forsure_content = "# Project\n<file path=\"src/main.rs\">\nfn main() { println!(\"Hello\"); }\n</file>";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.name, "Project");
        assert_eq!(root.children.len(), 1);

        let file_item = &root.children[0];
        assert_eq!(file_item.item_type, ItemType::File); // Should be File type from tag
        assert_eq!(file_item.name, ""); // No explicit name given in the tag
        assert_eq!(file_item.path, Some("src/main.rs".to_string())); // Path from attribute
        assert_eq!(file_item.content, Some("fn main() { println!(\"Hello\"); }\n".to_string())); // Content inside the tag
    }

     #[test]
    fn test_custom_description_tag() {
        let forsure_content = "# Project\n<description>\nThis is the project description.\n</description>";
        let root = parse_and_get_root(forsure_content);

        assert_eq!(root.name, "Project");
        assert_eq!(root.children.len(), 0); // Description tag does not create a new child item
        assert_eq!(root.description, Some("This is the project description.\n".to_string())); // Content applied to the parent (Project)
    }

    #[test]
    fn test_code_block_in_content() {
        let forsure_content = "# Item with code\nSome introductory text.\n```rust\nprintln!(\"code\");\n```\nMore text after code.";
         let root = parse_and_get_root(forsure_content);

         assert_eq!(root.children.len(), 1);
         let item = &root.children[0];
         assert_eq!(item.name, "Item with code");
         // Content should include text before, the code block, and text after.
         // The code block content will be appended as raw text for now.
          assert_eq!(item.content, Some("Some introductory text.\n\nCodeBlockStart(Some(\"rust\"))\nprintln!(\"code\");\nCodeBlockEnd\nMore text after code.".to_string())); // Need to refine how code blocks are represented in content
    }

    // TODO: Add more tests for different scenarios, including:
    // - Mixed headings and list items at different levels
    // - Nested custom tags (if supported)
    // - Attributes on content-setting tags
    // - Error handling cases (missing closing tags, unexpected tokens, etc.)
}