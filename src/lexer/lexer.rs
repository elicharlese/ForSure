use crate::utils::logger::Logger;

#[derive(Debug, PartialEq, Clone)]
pub enum Token {
    Number(i64),
    Plus,
    Minus,
    Star,
    Slash,
    Print,
    LParen,
    RParen,
    Semicolon,
    Comma,
    Identifier(String),
    EOF,
}

pub struct Lexer {
    input: Vec<char>,
    position: usize,
}

impl Lexer {
    pub fn new(input: &str) -> Self {
        Lexer {
            input: input.chars().collect(),
            position: 0,
        }
    }

    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();
        if self.position >= self.input.len() {
            Logger::log("Reached EOF");
            return Token::EOF;
        }

        let ch = self.input[self.position];
        self.position += 1;

        let token = match ch {
            '+' => Token::Plus,
            '-' => Token::Minus,
            '*' => Token::Star,
            '/' => Token::Slash,
            '(' => Token::LParen,
            ')' => Token::RParen,
            ';' => Token::Semicolon,
            ',' => Token::Comma,
            '0'..='9' => {
                self.position -= 1;
                Token::Number(self.read_number())
            },
            'a'..='z' | 'A'..='Z' => {
                self.position -= 1;
                Token::Identifier(self.read_identifier())
            },
            _ => {
                Logger::error("Unknown token");
                panic!("Unknown token")
            },
        };

        Logger::log(&format!("Token: {:?}", token));
        token
    }

    fn read_number(&mut self) -> i64 {
        let start = self.position;

        while self.position < self.input.len() && self.input[self.position].is_digit(10) {
            self.position += 1;
        }

        let number: String = self.input[start..self.position].iter().collect();
        number.parse().unwrap()
    }

    fn read_identifier(&mut self) -> String {
        let start = self.position - 1;

        while self.position < self.input.len() && self.input[self.position].is_alphanumeric() {
            self.position += 1;
        }

        self.input[start..self.position].iter().collect()
    }

    fn skip_whitespace(&mut self) {
        while self.position < self.input.len() && self.input[self.position].is_whitespace() {
            self.position += 1;
        }
    }
}