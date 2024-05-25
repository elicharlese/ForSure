// src/parser/ast.rs
#[derive(Debug)]
pub enum Operator {
    Add,
    Mul,
}

#[derive(Debug)]
pub enum Expr {
    Number(i64),
    BinOp(Box<Expr>, Operator, Box<Expr>),
    FnCall(String, Vec<Expr>), // Add this for function calls
}

#[derive(Debug)]
pub enum Stmt {
    Print(Box<Expr>),
}