use crate::parser::ast::{Expr, Stmt, Operator};
use crate::utils::logger::Logger;
use crate::stdlib::{math, string, collections};

pub struct Interpreter;

impl Interpreter {
    pub fn new() -> Self {
        Interpreter
    }

    pub fn eval_expr(&self, expr: &Expr) -> i64 {
        Logger::log(&format!("Evaluating expression: {:?}", expr));
        match expr {
            Expr::Number(n) => *n,
            Expr::BinOp(lhs, op, rhs) => {
                let left_val = self.eval_expr(lhs);
                let right_val = self.eval_expr(rhs);

                match op {
                    Operator::Add => left_val + right_val,
                    Operator::Mul => left_val * right_val,
                }
            },
            Expr::FnCall(name, args) => {
                let args_values: Vec<i64> = args.iter().map(|arg| self.eval_expr(arg)).collect();
                self.call_function(name, args_values)
            },
            _ => panic!("Unexpected expression"),
        }
    }

    fn call_function(&self, name: &str, args: Vec<i64>) -> i64 {
        match name {
            "add" => math::add(args[0], args[1]),
            "subtract" => math::subtract(args[0], args[1]),
            "multiply" => math::multiply(args[0], args[1]),
            "divide" => math::divide(args[0], args[1]).unwrap(),
            _ => panic!("Unknown function: {}", name),
        }
    }

    pub fn exec_stmt(&self, stmt: &Stmt) {
        Logger::log(&format!("Executing statement: {:?}", stmt));
        match stmt {
            Stmt::Print(expr) => {
                let result = self.eval_expr(expr);
                println!("{}", result);
            }
            _ => panic!("Unexpected statement"),
        }
    }
}