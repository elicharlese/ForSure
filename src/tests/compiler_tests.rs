// tests/compiler_tests.rs
use lexer::interpreter::Interpreter;
use lexer::parser::parser::Parser;
use lexer::lexer::lexer::Lexer;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compile_and_run_addition() {
        let code = "print(2 + 3);";
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);

        let ast = parser.parse();

        let mut interpreter = Interpreter::new();
        for statement in ast {
            interpreter.exec_stmt(&statement);
        }
    }

    #[test]
    fn test_compile_and_run_multiplication() {
        let code = "print(4 * 5);";
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);

        let ast = parser.parse();

        let mut interpreter = Interpreter::new();
        for statement in ast {
            interpreter.exec_stmt(&statement);
        }
    }
}