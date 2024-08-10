// src/parser/parser.rs

use crate::lexer::lexer::{Lexer, Token};
use crate::parser::ast::{Expr, Operator, Stmt};
use crate::utils::logger::Logger;
use std::fmt;

#[derive(Debug)]
pub enum ParseError {
    UnexpectedToken(Token, String),
    UnexpectedEOF,
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ParseError::UnexpectedToken(token, msg) => write!(f, "Unexpected token {:?}: {}", token, msg),
            ParseError::UnexpectedEOF => write!(f, "Unexpected end of file"),
        }
    }
}

pub type ParseResult<T> = Result<T, ParseError>;

pub struct Parser<'a> {
    lexer: &'a mut Lexer,
    current_token: Token,
}

impl<'a> Parser<'a> {
    pub fn new(lexer: &'a mut Lexer) -> Self {
        let current_token = lexer.next_token();
        Logger::log(&format!("Init token: {:?}", current_token));
        Parser { lexer, current_token }
    }

    pub fn parse(&mut self) -> ParseResult<Vec<Stmt>> {
        Logger::log("Start parsing");
        let mut statements = vec![];

        while self.current_token != Token::EOF {
            let stmt = self.parse_stmt()?;
            statements.push(stmt);
        }

        Logger::log("Finished parsing");
        Ok(statements)
    }

    fn parse_stmt(&mut self) -> ParseResult<Stmt> {
        Logger::log(&format!("Parsing statement: {:?}", self.current_token));
        match self.current_token {
            Token::Print => {
                self.next_token();
                let expr = self.parse_expr()?;
                self.expect_token(Token::Semicolon)?;
                Ok(Stmt::Print(Box::new(expr)))
            },
            _ => Err(ParseError::UnexpectedToken(self.current_token.clone(), "Expected 'print'".to_string())),
        }
    }

    fn parse_expr(&mut self) -> ParseResult<Expr> {
        Logger::log("Parsing expression");
        let left = self.parse_term()?;
        self.parse_binop_expr(left)
    }

    fn parse_binop_expr(&mut self, left: Expr) -> ParseResult<Expr> {
        match self.current_token {
            Token::Plus => {
                self.next_token();
                let right = self.parse_term()?;
                Ok(Expr::BinOp(Box::new(left), Operator::Add, Box::new(right)))
            },
            Token::Star => {
                self.next_token();
                let right = self.parse_term()?;
                Ok(Expr::BinOp(Box::new(left), Operator::Mul, Box::new(right)))
            },
            _ => Ok(left),
        }
    }

    fn parse_term(&mut self) -> ParseResult<Expr> {
        match self.current_token {
            Token::Number(n) => {
                self.next_token();
                Ok(Expr::Number(n))
            },
            Token::LParen => {
                self.next_token();
                let expr = self.parse_expr()?;
                self.expect_token(Token::RParen)?;
                Ok(expr)
            },
            Token::Identifier(ref name) => {
                let name_cloned = name.clone();
                self.next_token();
                if self.current_token == Token::LParen {
                    self.next_token();
                    let args = self.parse_call_args()?;
                    Ok(Expr::FnCall(name_cloned, args))
                } else {
                    Ok(Expr::FnCall(name_cloned, vec![]))  // Use cloned name here
                }
            },
            _ => Err(ParseError::UnexpectedToken(self.current_token.clone(), "Expected a term".to_string())),
        }
    }

    fn parse_call_args(&mut self) -> ParseResult<Vec<Expr>> {
        let mut args = Vec::new();
        if self.current_token != Token::RParen {
            args.push(self.parse_expr()?);
            while self.current_token == Token::Comma {
                self.next_token();
                args.push(self.parse_expr()?);
            }
        }
        self.expect_token(Token::RParen)?;
        Ok(args)
    }

    fn next_token(&mut self) {
        self.current_token = self.lexer.next_token();
        Logger::log(&format!("Next token: {:?}", self.current_token));
    }

    fn expect_token(&mut self, token: Token) -> ParseResult<()> {
        if self.current_token == token {
            self.next_token();
            Ok(())
        } else {
            Logger::error(&format!("Expected token: {:?}, got: {:?}", token.clone(), self.current_token));
            Err(ParseError::UnexpectedToken(token.clone(), format!("Expected token: {:?}, got: {:?}", token.clone(), self.current_token)))
        }
    }
}