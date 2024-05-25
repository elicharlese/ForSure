// tests/lexer_tests.rs
#[cfg(test)]
mod tests {
    use crate::lexer::lexer::{Lexer, Token};

    #[test]
    fn test_lexer_tokens() {
        let code = "print(2 + 3);";
        let mut lexer = Lexer::new(code);

        assert_eq!(lexer.next_token(), Token::Print);
        assert_eq!(lexer.next_token(), Token::LParen);
        assert_eq!(lexer.next_token(), Token::Number(2));
        assert_eq!(lexer.next_token(), Token::Plus);
        assert_eq!(lexer.next_token(), Token::Number(3));
        assert_eq!(lexer.next_token(), Token::RParen);
        assert_eq!(lexer.next_token(), Token::Semicolon);
        assert_eq!(lexer.next_token(), Token::EOF);
    }
}