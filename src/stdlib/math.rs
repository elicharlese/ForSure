pub fn mean(numbers: &[f64]) -> Option<f64> {
  let sum: f64 = numbers.iter().sum();
  let count = numbers.len();
  if count > 0 {
      Some(sum / count as f64)
  } else {
      None
  }
}

pub fn median(numbers: &mut [f64]) -> Option<f64> {
  numbers.sort_by(|a, b| a.partial_cmp(b).unwrap());
  let len = numbers.len();
  if len > 0 {
      if len % 2 == 0 {
          Some((numbers[len / 2 - 1] + numbers[len / 2]) / 2.0)
      } else {
          Some(numbers[len / 2])
      }
  } else {
      None
  }
}

pub fn factorial(n: u64) -> u64 {
  (1..=n).product()
}