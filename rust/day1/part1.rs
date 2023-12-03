fn main() {
    // read input file
    let input = std::fs::read_to_string("../input/day1/1.input.txt").unwrap();

    // split input into lines
    let lines: Vec<&str> = input.lines().collect();
    let mut numbers: i32 = 0;

    // iterate over lines
    for line in lines {
        let mut first_digit = -1;
        let mut last_digit = -1;

        line.chars().for_each(|c| {
            // parse char to int
            match c.to_digit(10) {
                Some(digit) => {
                    first_digit = match first_digit {
                        -1 => (digit * 10) as i32,
                        _ => first_digit
                    };
                    last_digit = digit as i32;
                },
                None => ()
            }
        });

        numbers += first_digit + last_digit;
    }

    println!("{}", numbers);
}