// tests/stdlib_tests.rs
#[cfg(test)]
mod tests {
    use crate::stdlib::math;
    use crate::stdlib::string;
    use crate::stdlib::collections;

    #[test]
    fn test_add() {
        assert_eq!(math::add(2, 3), 5);
    }

    #[test]
    fn test_subtract() {
        assert_eq!(math::subtract(5, 3), 2);
    }

    #[test]
    fn test_multiply() {
        assert_eq!(math::multiply(4, 2), 8);
    }

    #[test]
    fn test_divide() {
        match math::divide(10, 2) {
            Ok(result) => assert_eq!(result, 5),
            Err(_) => panic!("Error in division"),
        }
    }

    #[test]
    fn test_divide_by_zero() {
        match math::divide(10, 0) {
            Ok(_) => panic!("Expected error, got result"),
            Err(err) => assert_eq!(err, "division by zero".to_string()),
        }
    }

    #[test]
    fn test_concat() {
        assert_eq!(string::concat("Hello", "World"), "HelloWorld");
    }

    #[test]
    fn test_split() {
        let result: Vec<&str> = string::split("Hello World", ' ');
        assert_eq!(result, vec!["Hello", "World"]);
    }

    #[test]
    fn test_push() {
        let mut vec = vec![1, 2, 3];
        collections::push(&mut vec, 4);
        assert_eq!(vec, vec![1, 2, 3, 4]);
    }

    #[test]
    fn test_pop() {
        let mut vec = vec![1, 2, 3];
        match collections::pop(&mut vec) {
            Some(val) => assert_eq!(val, 3),
            None => panic!("Expected value, got None"),
        }
        assert_eq!(vec, vec![1, 2]);
    }

    #[test]
    fn test_pop_empty() {
        let mut vec: Vec<i32> = vec![];
        match collections::pop(&mut vec) {
            Some(_) => panic!("Expected None, got value"),
            None => assert_eq!(vec, vec![]),
        }
    }
}