use crate::models::Token; // Import the Token enum
use std::iter::Peekable;
use std::str::Chars;

#[derive(Debug, Clone)] // Added Clone derive to Lexer
pub struct Lexer<'a> {
    chars: Peekable<Chars<'a>>,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Lexer {
            chars: input.chars().peekable(),
        }
    }

    // Consume the current character and return it
    fn next_char(&mut self) -> Option<char> {
        self.chars.next()
    }

    // Peek at the next character without consuming it
    fn peek(&mut self) -> Option<&char> {
        self.chars.peek()
    }

    // Consume characters while a predicate is true
    fn consume_while<F>(&mut self, predicate: F) -> String
    where
        F: Fn(char) -> bool,
    {
        let mut result = String::new();
        while let Some(&c) = self.peek() {
            if predicate(c) {
                result.push(self.next_char().unwrap());
            } else {
                break;
            }
        }
        result
    }

    // Skip whitespace characters (excluding newline)
    fn skip_whitespace(&mut self) {
        while let Some(&c) = self.peek() {
            if c.is_whitespace() && c != '\n' { // Keep newline
                self.next_char();
            } else {
                break;
            }
        }
    }

    // Lex the next token
    pub fn next_token(&mut self) -> Token {
        // Skip any leading whitespace, but not newlines at the start of a line
        self.skip_whitespace();

        if let Some(&c) = self.peek() {
            match c {
                '#' => self.lex_heading(),
                '-' | '*' => self.lex_list_item_marker(),
                '<' => {
                    self.next_char(); // Consume '<'
                    // Check if it's a custom tag start or end
                    if let Some('/') = self.peek() {
                        // Potential closing tag </tag_name>
                        self.next_char(); // Consume '/'
                        // Expect identifier (tag name)
                        self.skip_whitespace(); // Skip space after '/'
                        let tag_name = self.lex_identifier(); // Lex the tag name

                        // Check for '>' after tag name
                         self.skip_whitespace(); // Skip space before '>'
                        if let Some('>') = self.next_char() {
                            // It's a valid closing tag
                            Token::CustomTagEnd
                        } else {
                            // Expected '>', but found something else or EOF
                            Token::Error(format!("Expected '>' after closing tag name, found {:?}", self.peek()))
                        }
                    } else if let Some(&next_c) = self.peek() {
                         if next_c.is_alphabetic() { // Check if it starts with a letter (potential tag name)
                             // Potential opening tag <tag_name>
                            let tag_name_token = self.lex_identifier(); // Lex the tag name
                            if let Token::Identifier(tag_name) = tag_name_token {
                                 // Check for '>' after tag name
                                 self.skip_whitespace(); // Skip space before '>'
                                if let Some('>') = self.next_char() {
                                    // It's a valid opening tag
                                    Token::CustomTagStart(tag_name)
                                } else {
                                    // Expected '>', but found something else or EOF
                                    Token::Error(format!("Expected '>' after opening tag name '{}', found {:?}", tag_name, self.peek()))
                                }
                            } else {
                                // Should be an identifier after '<'
                                Token::Error(format!("Expected identifier after '<' for custom tag, found {:?}", tag_name_token))
                            }
                         } else {
                             // It's just a standalone '<', likely starting attributes <key="value">
                              Token::LessThan
                         }
                    } else {
                         // Just '<' at the end of input
                         Token::LessThan
                    }
                },
                '>' => {
                    self.next_char(); // Consume '>'
                    Token::GreaterThan
                },
                '=' => {
                    self.next_char(); // Consume '='
                    Token::Equals
                },
                '"' => self.lex_quoted_string(),
                '`' => {
                    // Check for code block start or end (```)
                    let mut temp_lexer = self.clone(); // Use clone for lookahead
                    let backticks = temp_lexer.consume_while(|c| c == '`').len();

                    if backticks >= 3 {
                        // It's a code block marker. Consume the backticks.
                        self.consume_while(|c| c == '`');

                        // Check if it's a start or end marker based on what follows
                        // Simple approach: if the rest of the line is just whitespace or empty, it's likely an end marker.
                        // Otherwise, it's a start marker with optional language info.
                         let mut temp_lexer_rest_of_line = self.clone();
                         let rest_of_line = temp_lexer_rest_of_line.consume_while(|c| c != '\n');
                         if rest_of_line.trim().is_empty() {
                              // It's a code block end marker
                              // Consume the rest of the whitespace and the newline if present
                              self.skip_whitespace();
                              if self.peek() == Some(&'\n') {
                                  self.next_char(); // Consume newline
                              }
                              Token::CodeBlockEnd
                         } else {
                              // It's a code block start marker with language info
                              // Consume the language info until newline
                              let lang_info = self.consume_while(|c| c != '\n').trim().to_string();
                               // Consume the newline after lang info
                               if self.peek() == Some(&'\n') {
                                   self.next_char(); // Consume newline
                               }
                              Token::CodeBlockStart(if lang_info.is_empty() { None } else { Some(lang_info) })
                         }
                    } else {
                        // Not a code block marker, treat the backticks as text.
                         self.lex_text() // Treat as part of text
                    }
                },
                '\n' => self.lex_newline(),
                 _ if c.is_alphanumeric() => self.lex_identifier(), // Start of an identifier
                _ => self.lex_text(), // Anything else is treated as text
            }
        } else {
            Token::EndOfFile // No more characters
        }
    }

    // Peek the next token without consuming it
     pub fn peek_token(&mut self) -> Token {
         // Create a temporary lexer by cloning the current state
         let mut temp_lexer = Lexer {
              chars: self.chars.clone(),
         };
         temp_lexer.next_token() // Lex the next token from the temporary state
     }


    // Lex a heading token
    fn lex_heading(&mut self) -> Token {
        let mut level = 0;
        while let Some('#') = self.peek() {
            self.next_char();
            level += 1;
        }
        // Consume optional space after #
        if let Some(' ') = self.peek() {
            self.next_char();
        }
        // Headings in Markdown are typically level 1-6
        Token::Heading(level.min(6)) // Cap at level 6
    }

    // Lex a list item marker token
    fn lex_list_item_marker(&mut self) -> Token {
        // Consume '-' or '*'
        self.next_char();
        // Consume optional space after marker
        if let Some(' ') = self.peek() {
            self.next_char();
        }
        Token::ListItemMarker
    }

    // Lex an identifier (used for tag names and attribute keys)
    fn lex_identifier(&mut self) -> Token {
        let identifier = self.consume_while(|c| c.is_alphanumeric() || c == '_' || c == '-');
        if identifier.is_empty() {
             Token::Error("Expected identifier, found none.".to_string())
        } else {
            Token::Identifier(identifier)
        }
    }


    // Lex a quoted string (used for attribute values)
    fn lex_quoted_string(&mut self) -> Token {
        self.next_char(); // Consume the opening '"'
        let mut value = String::new();
        let mut escaped = false;

        while let Some(c) = self.next_char() {
            match c {
                '"' if !escaped => {
                    return Token::QuotedString(value); // Found closing quote
                },
                '\\' if !escaped => {
                    escaped = true; // Next char is escaped
                },
                _ => {
                    if escaped {
                        // Handle escape sequences if needed (e.g., \n, \t, \", \\)
                        // For simplicity, just push the escaped character for now.
                         value.push(c);
                        escaped = false;
                    } else {
                        value.push(c);
                    }
                }
            }
        }

        // If we reach here, the closing quote was not found
        Token::Error("Unterminated quoted string".to_string())
    }


    // Lex a newline token
    fn lex_newline(&mut self) -> Token {
        self.next_char(); // Consume '\n'
        Token::Newline
    }

    // Lex a general text token.
    fn lex_text(&mut self) -> Token {
        let mut text = String::new();
        // Consume characters until a character that starts a special token
        while let Some(&c) = self.peek() {
            match c {
                '#' | '-' | '*' | '<' | '>' | '=' | '`' | '\n' => break, // Stop at characters that start other tokens
                 _ if c.is_whitespace() && !text.is_empty() => {
                      // If we've started collecting text, stop at whitespace
                     break;
                 }
                _ => {
                    // Consume and add the character to text.
                    // If it's whitespace and text is empty, we are still skipping leading whitespace within text segments.
                    let consumed_char = self.next_char().unwrap();
                    if consumed_char.is_whitespace() && text.is_empty() {
                        // Skip leading whitespace
                         continue;
                    }
                     text.push(consumed_char);
                }
            }
        }

        if text.is_empty() {
             // This case could happen if we only encounter whitespace after the initial skip,
             // or if there are two special tokens immediately next to each other with no
             // text or whitespace in between.
             // Depending on desired behavior, we might return an Error, skip, or refine
             // the logic to avoid reaching this state when valid tokens follow.
             // For now, let's return an error if no text is collected and it's not EOF.
             if self.peek().is_some() {
                 // Return an error if there are remaining characters but no text was lexed
                  Token::Error(format!("Lexer lex_text produced empty string at character: {:?}", self.peek().unwrap()))
             } else {
                  // If it's empty and peek is None, it's EndOfFile, but next_token
                  // handles that at the start. This branch should be unreachable if logic is correct.
                 Token::Error("Unexpected empty text token near EOF.".to_string())
             }

        } else {
            Token::Text(text)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::Token; // Import Token for assertions

    // Helper function to create a lexer from a string slice
    fn lex_input(input: &str) -> Lexer {
        Lexer::new(input)
    }

    #[test]
    fn test_lex_heading() {
        let mut lexer = lex_input("# Heading 1");
        assert_eq!(lexer.next_token(), Token::Heading(1));
        let mut lexer = lex_input("## Heading 2");
        assert_eq!(lexer.next_token(), Token::Heading(2));
        let mut lexer = lex_input("###### Heading 6");
        assert_eq!(lexer.next_token(), Token::Heading(6));
        let mut lexer = lex_input("####### Heading 7 (should be capped)");
        assert_eq!(lexer.next_token(), Token::Heading(6)); // Capped at 6
    }

    #[test]
    fn test_lex_list_item_marker() {
        let mut lexer = lex_input("- Item 1");
        assert_eq!(lexer.next_token(), Token::ListItemMarker);
        let mut lexer = lex_input("* Item 2");
        assert_eq!(lexer.next_token(), Token::ListItemMarker);
    }

    #[test]
    fn test_lex_angle_brackets_and_equals() {
        // These should only be lexed as standalone tokens if not part of a custom tag
        let mut lexer = lex_input("< > =");
        assert_eq!(lexer.next_token(), Token::LessThan);
        assert_eq!(lexer.next_token(), Token::GreaterThan);
        assert_eq!(lexer.next_token(), Token::Equals);
    }

    #[test]
    fn test_lex_quoted_string() {
        let mut lexer = lex_input("\"hello world\"");
        assert_eq!(lexer.next_token(), Token::QuotedString("hello world".to_string()));
        let mut lexer = lex_input("\"string with \\\"quote\\\"\"");
        assert_eq!(lexer.next_token(), Token::QuotedString("string with \"quote\"".to_string()));
        let mut lexer = lex_input("\"unterminated string");
        assert_eq!(lexer.next_token(), Token::Error("Unterminated quoted string".to_string()));
    }

     #[test]
    fn test_lex_identifier() {
        let mut lexer = lex_input("name-attribute_123");
        assert_eq!(lexer.next_token(), Token::Identifier("name-attribute_123".to_string()));
         // Identifier followed by space and other tokens
         let mut lexer = lex_input("file name=\"test.txt\"");
         assert_eq!(lexer.next_token(), Token::Identifier("file".to_string()));
         assert_eq!(lexer.next_token(), Token::Identifier("name".to_string()));
         assert_eq!(lexer.next_token(), Token::Equals);
         assert_eq!(lexer.next_token(), Token::QuotedString("test.txt".to_string()));
    }

    #[test]
    fn test_lex_custom_tags() {
        let mut lexer = lex_input("<file>content</file>");
        assert_eq!(lexer.next_token(), Token::CustomTagStart("file".to_string()));
        assert_eq!(lexer.next_token(), Token::Text("content".to_string()));
        assert_eq!(lexer.next_token(), Token::CustomTagEnd);
        assert_eq!(lexer.next_token(), Token::EndOfFile);

        let mut lexer = lex_input("<directory > </directory>"); // Tags with spaces
         assert_eq!(lexer.next_token(), Token::CustomTagStart("directory".to_string()));
         assert_eq!(lexer.next_token(), Token::Text(" ".to_string())); // Space inside tag treated as text
         assert_eq!(lexer.next_token(), Token::CustomTagEnd);
         assert_eq!(lexer.next_token(), Token::EndOfFile);

        let mut lexer = lex_input("<tag-with-dash>\nContent\n</tag-with-dash>");
         assert_eq!(lexer.next_token(), Token::CustomTagStart("tag-with-dash".to_string()));
         assert_eq!(lexer.next_token(), Token::Newline);
         assert_eq!(lexer.next_token(), Token::Text("Content".to_string()));
         assert_eq!(lexer.next_token(), Token::Newline);
         assert_eq!(lexer.next_token(), Token::CustomTagEnd);
         assert_eq!(lexer.next_token(), Token::EndOfFile);

         // Invalid tags
         let mut lexer = lex_input("< invalid>");
         assert_eq!(lexer.next_token(), Token::LessThan); // Lexes '<' as LessThan
         // The rest will be lexed as text or identifiers depending on what follows
    }


     #[test]
    fn test_lex_code_block_markers() {
        let mut lexer = lex_input("```rust\ncode\n```");
        assert_eq!(lexer.next_token(), Token::CodeBlockStart(Some("rust".to_string())));
        // Lexer doesn't consume code block content, that's parser's job
        assert_eq!(lexer.next_token(), Token::Newline); // Newline after ```rust
        assert_eq!(lexer.next_token(), Token::Text("code".to_string())); // Assuming "code" is lexed as Text
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::CodeBlockEnd);

        let mut lexer = lex_input("```\ncode\n```");
        assert_eq!(lexer.next_token(), Token::CodeBlockStart(None)); // No language info
        assert_eq!(lexer.next_token(), Token::Newline); // Newline after ```
        assert_eq!(lexer.next_token(), Token::Text("code".to_string()));
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::CodeBlockEnd);
    }


    #[test]
    fn test_lex_text() {
        let mut lexer = lex_input("This is some text.\nAnother line.");
        assert_eq!(lexer.next_token(), Token::Text("This is some text.".to_string()));
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::Text("Another line.".to_string()));
        assert_eq!(lexer.next_token(), Token::EndOfFile);

        // Text with special characters in between (should be lexed as separate tokens)
        let mut lexer = lex_input("text <tag> more text");
        assert_eq!(lexer.next_token(), Token::Text("text".to_string()));
        assert_eq!(lexer.next_token(), Token::CustomTagStart("tag".to_string())); // Now recognizes <tag>
        assert_eq!(lexer.next_token(), Token::Text("more text".to_string()));
        assert_eq!(lexer.next_token(), Token::EndOfFile);

        // Text followed by attribute start
        let mut lexer = lex_input("Item name <path=\"./\">");
         assert_eq!(lexer.next_token(), Token::Text("Item name".to_string()));
         assert_eq!(lexer.next_token(), Token::LessThan); // This is for attributes
         assert_eq!(lexer.next_token(), Token::Identifier("path".to_string()));
         assert_eq!(lexer.next_token(), Token::Equals);
         assert_eq!(lexer.next_token(), Token::QuotedString("./".to_string()));
         assert_eq!(lexer.next_token(), Token::GreaterThan);
         assert_eq!(lexer.next_token(), Token::EndOfFile);
    }


    #[test]
    fn test_lex_mixed_content() {
        let mut lexer = lex_input("# Project <path=\"./\"> \n* Item <command=\"run\">");
        assert_eq!(lexer.next_token(), Token::Heading(1));
        assert_eq!(lexer.next_token(), Token::Text("Project".to_string())); // Heading text
        assert_eq!(lexer.next_token(), Token::LessThan);
        assert_eq!(lexer.next_token(), Token::Identifier("path".to_string()));
        assert_eq!(lexer.next_token(), Token::Equals);
        assert_eq!(lexer.next_token(), Token::QuotedString("./".to_string()));
        assert_eq!(lexer.next_token(), Token::GreaterThan);
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::ListItemMarker);
         assert_eq!(lexer.next_token(), Token::Text("Item".to_string())); // List item text
        assert_eq!(lexer.next_token(), Token::LessThan);
        assert_eq!(lexer.next_token(), Token::Identifier("command".to_string()));
        assert_eq!(lexer.next_token(), Token::Equals);
        assert_eq!(lexer.next_token(), Token::QuotedString("run".to_string()));
        assert_eq!(lexer.next_token(), Token::GreaterThan);
        assert_eq!(lexer.next_token(), Token::EndOfFile);
    }

    #[test]
    fn test_empty_input() {
        let mut lexer = lex_input("");
        assert_eq!(lexer.next_token(), Token::EndOfFile);
    }

     #[test]
    fn test_whitespace_handling() {
        let mut lexer = lex_input("  # Heading\n\n* Item");
         // Leading whitespace on the first line is skipped
        assert_eq!(lexer.next_token(), Token::Heading(1));
         assert_eq!(lexer.next_token(), Token::Text("Heading".to_string()));
         assert_eq!(lexer.next_token(), Token::Newline);
         // The blank line between heading and list item results in an extra Newline token
         assert_eq!(lexer.next_token(), Token::Newline);
         assert_eq!(lexer.next_token(), Token::ListItemMarker);
         assert_eq!(lexer.next_token(), Token::Text("Item".to_string()));
         assert_eq!(lexer.next_token(), Token::EndOfFile);
    }
}