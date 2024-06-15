pub fn find_max<T: Ord>(list: &[T]) -> Option<&T> {
  list.iter().max()
}

pub fn find_min<T: Ord>(list: &[T]) -> Option<&T> {
  list.iter().min()
}

pub fn sort_vector<T: Ord>(list: &mut [T]) {
  list.sort();
}

pub fn unique_elements<T: Ord + Clone>(list: &[T]) -> Vec<T> {
  let mut unique_list = list.to_vec();
  unique_list.sort();
  unique_list.dedup();
  unique_list
}