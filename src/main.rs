use crate::lexer::lexer::Lexer;
use crate::parser::parser::Parser;
use crate::interpreter::Interpreter;
use crate::utils::logger::Logger;
use std::time::Instant;

mod lexer;
mod parser;
mod interpreter;
mod utils;

fn main() {
    let code = "print(2 + 3);";
    let start_time = Instant::now();

    let mut lexer = Lexer::new(code);
    let mut parser = Parser::new(&mut lexer);

    match parser.parse() {
        Ok(ast) => {
            Logger::log("Parsing successful. Executing AST...");
            let mut interpreter = Interpreter::new();

            for stmt in ast {
                interpreter.exec_stmt(&stmt);
            }
        }
        Err(e) => {
            Logger::error(&format!("Parsing failed: {}", e));
        }
    }

    let duration = start_time.elapsed();
    Logger::log(&format!("Execution time: {:?}", duration));
}