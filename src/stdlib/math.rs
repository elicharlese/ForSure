pub fn add(a: i32, b: i32) -> i32 {
  a + b
}

pub fn subtract(a: i32, b: i32) -> i32 {
  a - b
}

pub fn multiply(a: i32, b: i32) -> i32 {
  a * b
}

pub fn divide(a: i32, b: i32) -> Option<i32> {
  if b != 0 {
      Some(a / b)
  } else {
      None
  }
}

pub fn factorial(n: u32) -> u32 {
  (1..=n).product()
}

pub fn power(base: i32, exp: u32) -> i32 {
  (0..exp).fold(1, |acc, _| acc * base)
}