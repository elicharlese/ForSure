use crate::models::Token; // Import the Token enum from our models module

#[derive(Debug)]
pub struct Lexer<'a> {
    chars: std::iter::Peekable<std::str::Chars<'a>>,
}

impl<'a> Lexer<'a> {
    /// Creates a new Lexer instance.
    pub fn new(input: &'a str) -> Self {
        Lexer {
            chars: input.chars().peekable(),
        }
    }

    /// Peeks at the next character without consuming it.
    fn peek(&mut self) -> Option<&char> {
        self.chars.peek()
    }

    /// Consumes and returns the next character.
    fn next_char(&mut self) -> Option<char> {
        self.chars.next()
    }

    /// Consumes characters while the predicate is true, returning the consumed string.
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

    /// Skips whitespace characters.
    fn skip_whitespace(&mut self) {
        self.consume_while(|c| c.is_whitespace() && c != '\n');
    }

    /// Lexes the next token from the input.
    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();

        let Some(&first_char) = self.peek() else {
            return Token::EndOfFile;
        };

        match first_char {
            '#' => self.lex_heading(),
            '-' | '*' => self.lex_list_item_marker(),
            '<' => self.lex_custom_tag(),
            '`' => self.lex_code_block(),
            '\n' => {
                self.next_char(); // Consume the newline
                Token::Newline
            }
            _ => self.lex_text(), // Default to lexing text
        }
    }

    /// Lexes a heading token.
    fn lex_heading(&mut self) -> Token {
        let hashes = self.consume_while(|c| c == '#');
        let level = hashes.len() as u8;
        // Consume optional space after hashes
        if let Some(' ') = self.peek() {
            self.next_char();
        }
        if level > 6 || level == 0 {
            Token::Error(format!("Invalid heading level: {}", level))
        } else {
            Token::Heading(level)
        }
    }

    /// Lexes a list item marker token.
    fn lex_list_item_marker(&mut self) -> Token {
        match self.peek() {
            Some('-') | Some('*') => {
                self.next_char(); // Consume the marker
                // Consume optional space after marker
                if let Some(' ') = self.peek() {
                    self.next_char();
                }
                Token::ListItemMarker
            }
            _ => self.lex_text(), // If not a list item marker at the start, treat as text
        }
    }

    /// Lexes a custom HTML-like tag token.
    fn lex_custom_tag(&mut self) -> Token {
        self.next_char(); // Consume '<'
        let is_end_tag = if let Some('/') = self.peek() {
            self.next_char(); // Consume '/'
            true
        } else {
            false
        };
        let tag_name = self.consume_while(|c| c.is_alphanumeric() || c == '_');
        self.skip_whitespace(); // Allow whitespace before closing '>'

        if let Some('>') = self.next_char() {
            if tag_name.is_empty() {
                Token::Error("Empty tag name".to_string())
            } else if is_end_tag {
                Token::CustomTagEnd(tag_name)
            } else {
                Token::CustomTagStart(tag_name)
            }
        } else {
            Token::Error("Unclosed tag".to_string())
        }
    }

    /// Lexes a code block token.
    fn lex_code_block(&mut self) -> Token {
        // Check for "```" marker
        if self.next_char() == Some('`') && self.next_char() == Some('`') && self.next_char() == Some('`') {
            let mut info = String::new();
            // Consume language info until newline or end of line
            while let Some(&c) = self.peek() {
                if c == '\n' {
                    break;
                }
                info.push(self.next_char().unwrap());
            }
            // Consume the newline if present after info
            if let Some('\n') = self.peek() {
                 self.next_char();
            }

            let lang_info = if info.trim().is_empty() {
                None
            } else {
                Some(info.trim().to_string())
            };

            Token::CodeBlockStart(lang_info)
        } else {
            // If it was just one or two backticks, treat as text
            Token::Text("`".to_string()) // Could be more robust to handle ` or ``
        }
    }

    /// Lexes a general text token.
    fn lex_text(&mut self) -> Token {
        let mut text = String::new();
        // Consume characters until a character that starts a special token
        while let Some(&c) = self.peek() {
            match c {
                '#' | '-' | '*' | '<' | '`' | '\n' => break, // Stop at characters that could start other tokens
                _ => text.push(self.next_char().unwrap()),
            }
        }

        // Also check for property keys if at the start of a line after whitespace
        // This requires some lookahead or state in the lexer, which complicates things.
        // For simplicity in the first iteration, let's handle property key parsing in the parser
        // based on the context (e.g., after a ListItemMarker and before other content).
        // So, for now, "Type:", "Name:", "Path:" will be lexed as part of a general Text token.
        // The parser will be responsible for recognizing and splitting these out.


        if text.is_empty() {
             // This case should ideally not be reached if skip_whitespace handles leading whitespace correctly
             // and the other match arms handle their respective tokens.
             // If it does, it might indicate an unhandled character, though `lex_text` should consume it.
             // Return an Error token or skip? Let's return an Error for now to indicate an issue.
             panic!("Lexer lex_text produced empty string - unexpected state."); // Or a more graceful handling
        }

        Token::Text(text)
    }

    // Method to get an iterator over tokens
    pub fn into_tokens(self) -> Tokens<'a> {
        Tokens { lexer: self }
    }
}

/// An iterator over tokens produced by the Lexer.
pub struct Tokens<'a> {
    lexer: Lexer<'a>,
}

impl<'a> Iterator for Tokens<'a> {
    type Item = Token;

    fn next(&mut self) -> Option<Self::Item> {
        let token = self.lexer.next_token();
        if let Token::EndOfFile = token {
            None // Stop iteration at EndOfFile
        } else {
            Some(token)
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lexer_headings() {
        let input = "# Heading 1\n## Heading 2";
        let mut lexer = Lexer::new(input);
        assert_eq!(lexer.next_token(), Token::Heading(1));
        assert_eq!(lexer.next_token(), Token::Text("Heading 1".to_string()));
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::Heading(2));
        assert_eq!(lexer.next_token(), Token::Text("Heading 2".to_string()));
        assert_eq!(lexer.next_token(), Token::EndOfFile);
    }

    #[test]
    fn test_lexer_list_items() {
        let input = "- Item 1\n* Item 2";
        let mut lexer = Lexer::new(input);
        assert_eq!(lexer.next_token(), Token::ListItemMarker);
        assert_eq!(lexer.next_token(), Token::Text("Item 1".to_string()));
        assert_eq!(lexer.next_token(), Token::Newline);
        assert_eq!(lexer.next_token(), Token::ListItemMarker);
        assert_eq!(lexer.next_token(), Token::Text("Item 2".to_string()));
        assert_eq!(lexer.next_token(), Token::EndOfFile);
    }

    #[test]
    fn test_lexer_custom_tags() {
        let input = "<description>Some text</description>";
        let mut lexer = Lexer::new(input);
        assert_eq!(lexer.next_token(), Token::CustomTagStart("description".to_string()));
        assert_eq!(lexer.next_token(), Token::Text("Some text".to_string()));
        assert_eq!(lexer.next_token(), Token::CustomTagEnd("description".to_string()));
        assert_eq!(lexer.next_token(), Token::EndOfFile);
    }

     #[test]
     fn test_lexer_code_blocks() {
         let input = "```rust\nprintln!(\"hello\");\n```";
         let mut lexer = Lexer::new(input);
         assert_eq!(lexer.next_token(), Token::CodeBlockStart(Some("rust".to_string())));
         // Lexer reads the whole line until `\n` for code block start info
         // The content and end marker are subsequent tokens
         assert_eq!(lexer.next_token(), Token::Text("println!(\"hello\");".to_string()));
         assert_eq!(lexer.next_token(), Token::Newline);
         assert_eq!(lexer.next_token(), Token::CodeBlockEnd);
         assert_eq!(lexer.next_token(), Token::EndOfFile);
     }

     #[test]
      fn test_lexer_mixed() {
          let input = "# Project\n- Item 1\n<note>A note</note>\n```\ncode\n```";
          let mut lexer = Lexer::new(input);
          assert_eq!(lexer.next_token(), Token::Heading(1));
          assert_eq!(lexer.next_token(), Token::Text("Project".to_string()));
          assert_eq!(lexer.next_token(), Token::Newline);
          assert_eq!(lexer.next_token(), Token::ListItemMarker);
          assert_eq!(lexer.next_token(), Token::Text("Item 1".to_string()));
          assert_eq!(lexer.next_token(), Token::Newline);
          assert_eq!(lexer.next_token(), Token::CustomTagStart("note".to_string()));
          assert_eq!(lexer.next_token(), Token::Text("A note".to_string()));
          assert_eq!(lexer.next_token(), Token::CustomTagEnd("note".to_string()));
          assert_eq!(lexer.next_token(), Token::Newline); // newline after </note>
          assert_eq!(lexer.next_token(), Token::CodeBlockStart(None));
          assert_eq!(lexer.next_token(), Token::Text("code".to_string()));
          assert_eq!(lexer.next_token(), Token::Newline);
          assert_eq!(lexer.next_token(), Token::CodeBlockEnd);
          assert_eq!(lexer.next_token(), Token::EndOfFile);
      }

      #[test]
       fn test_lexer_property_keys_as_text() {
           // Property keys are currently lexed as Text. Parser will handle their meaning.
           let input = "- Type: File\n  Name: README.md";
           let mut lexer = Lexer::new(input);
           assert_eq!(lexer.next_token(), Token::ListItemMarker);
           assert_eq!(lexer.next_token(), Token::Text("Type: File".to_string())); // Lexed as text
           assert_eq!(lexer.next_token(), Token::Newline);
            // Note: The spaces before "Name" will be consumed by skip_whitespace before lex_text
           assert_eq!(lexer.next_token(), Token::Text("Name: README.md".to_string())); // Lexed as text
           assert_eq!(lexer.next_token(), Token::EndOfFile);
       }
}