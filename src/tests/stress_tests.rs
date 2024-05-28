// tests/stress_tests.rs
#[cfg(test)]
mod stress_tests {
    use crate::lexer::lexer::Lexer;
    use crate::parser::parser::Parser;
    use crate::interpreter::Interpreter;

    fn parse_and_execute(input: &str) -> String {
        let mut lexer = Lexer::new(input);
        let mut parser = Parser::new(&mut lexer);
        let stmts = parser.parse().unwrap();
        let interpreter = Interpreter::new();

        let result = std::panic::catch_unwind(|| {
            for stmt in &stmts {
                interpreter.exec_stmt(stmt);
            }
        });

        match result {
            Ok(_) => "Execution successful".to_string(),
            Err(_) => "Execution failed".to_string(),
        }
    }

    #[test]
    fn stress_test_large_expression() {
        let code = "print(".to_owned() + &"2 + ".repeat(1000) + "2);";
        let result = parse_and_execute(&code);
        assert_eq!(result, "Execution successful");
    }

    #[test]
    fn stress_test_large_function_calls() {
        let mut code = "print(".to_string();
        for i in 0..100 {
            code += &format!("add({}, {}), ", i, i + 1);
        }
        code += "0);";
        let result = parse_and_execute(&code);
        assert_eq!(result, "Execution successful");
    }

    #[test]
    fn stress_test_deeply_nested_expressions() {
        let mut code = "print(".to_string();
        for _ in 0..500 {
            code += "2 + (";
        }
        code = code[..code.len()-1].to_string(); // remove last unnecessary '('
        code += &"))".repeat(500);
        code += ";";
        let result = parse_and_execute(&code);
        assert_eq!(result, "Execution successful");
    }

    #[test]
    fn test_error_handling() {
        let code = "print(2 * ;";
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);

        let result = parser.parse();
        assert!(result.is_err());
    }
}