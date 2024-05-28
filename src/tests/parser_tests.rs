// tests/parser_tests.rs
#[cfg(test)]
mod tests {
    use crate::lexer::lexer::Lexer;
    use crate::parser::parser::Parser;
    use crate::parser::ast::{Expr, Operator, Stmt};

    fn parse_code(code: &str) -> Vec<Stmt> {
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);
        parser.parse().unwrap()
    }

    #[test]
    fn test_print_statement() {
        let code = "print(2 + 3);";
        let ast = parse_code(code);

        let expected_ast = vec![
            Stmt::Print(Box::new(Expr::BinOp(
                Box::new(Expr::Number(2)),
                Operator::Add,
                Box::new(Expr::Number(3)),
            ))),
        ];

        assert_eq!(ast, expected_ast);
    }

    #[test]
    fn test_nested_expressions() {
        let code = "print(2 + 3 * 4);";
        let ast = parse_code(code);

        let expected_ast = vec![
            Stmt::Print(Box::new(Expr::BinOp(
                Box::new(Expr::Number(2)),
                Operator::Add,
                Box::new(Expr::BinOp(
                    Box::new(Expr::Number(3)),
                    Operator::Mul,
                    Box::new(Expr::Number(4)),
                )),
            ))),
        ];
        assert_eq!(ast, expected_ast);
    }

    #[test]
    fn test_function_call_no_args() {
        let code = "print(foo());";
        let ast = parse_code(code);

        let expected_ast = vec![
            Stmt::Print(Box::new(Expr::FnCall("foo".to_string(), vec![]))),
        ];

        assert_eq!(ast, expected_ast);
    }

    #[test]
    fn test_function_call_with_args() {
        let code = "print(add(2, 3));";
        let ast = parse_code(code);

        let expected_ast = vec![
            Stmt::Print(Box::new(Expr::FnCall(
                "add".to_string(),
                vec![Expr::Number(2), Expr::Number(3)],
            ))),
        ];

        assert_eq!(ast, expected_ast);
    }

    #[test]
    fn test_multiple_statements() {
        let code = "
            print(2 + 3);
            print(4 * 5);
        ";
        let ast = parse_code(code);

        let expected_ast = vec![
            Stmt::Print(Box::new(Expr::BinOp(
                Box::new(Expr::Number(2)),
                Operator::Add,
                Box::new(Expr::Number(3)),
            ))),
            Stmt::Print(Box::new(Expr::BinOp(
                Box::new(Expr::Number(4)),
                Operator::Mul,
                Box::new(Expr::Number(5)),
            ))),
        ];

        assert_eq!(ast, expected_ast);
    }

    #[test]
    fn test_unexpected_token_error() {
        let code = "print(2 +);";
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);

        let result = parser.parse();
        assert!(result.is_err());
        match result {
            Err(crate::parser::parser::ParseError::UnexpectedToken(token, msg)) => {
                assert_eq!(token, crate::lexer::lexer::Token::Semicolon);
                assert_eq!(msg, "Expected a term".to_string());
            }
            _ => panic!("Expected UnexpectedToken error"),
        }
    }

    #[test]
    fn test_unexpected_eof_error() {
        let code = "print(2 + 3";
        let mut lexer = Lexer::new(code);
        let mut parser = Parser::new(&mut lexer);

        let result = parser.parse();
        assert!(result.is_err());
        match result {
            Err(crate::parser::parser::ParseError::UnexpectedEOF) => {}
            _ => panic!("Expected UnexpectedEOF error"),
        }
    }
}