pub fn to_uppercase(s: &str) -> String {
  s.to_uppercase()
}

pub fn to_lowercase(s: &str) -> String {
  s.to_lowercase()
}

pub fn reverse_string(s: &str) -> String {
  s.chars().rev().collect()
}

pub fn is_palindrome(s: &str) -> bool {
  let sanitized: String = s.chars().filter(|c| c.is_alphanumeric()).collect();
  let reversed: String = sanitized.chars().rev().collect();
  sanitized.eq_ignore_ascii_case(&reversed)
}