pub fn sum(vec: &[i32]) -> i32 {
  vec.iter().sum()
}

pub fn product(vec: &[i32]) -> i32 {
  vec.iter().product()
}

pub fn find_max(vec: &[i32]) -> Option<i32> {
  vec.iter().copied().max()
}

pub fn find_min(vec: &[i32]) -> Option<i32> {
  vec.iter().copied().min()
}

pub fn sort(vec: &mut [i32]) {
  vec.sort();
}