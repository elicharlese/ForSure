pub fn to_uppercase(s: &str) -> String {
  s.to_uppercase()
}

pub fn to_lowercase(s: &str) -> String {
  s.to_lowercase()
}

pub fn reverse(s: &str) -> String {
  s.chars().rev().collect()
}

pub fn is_palindrome(s: &str) -> bool {
  let cleaned: String = s.chars().filter(|c| c.is_alphanumeric()).collect();
  cleaned.eq_ignore_ascii_case(&cleaned.chars().rev().collect::<String>())
}