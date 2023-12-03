use std::collections::HashMap;

fn main() {
    // read input file
    let input = std::fs::read_to_string("../input/day1/2.input.txt").unwrap();

    // split input into lines
    let lines: Vec<&str> = input.lines().collect();
    let mut numbers: i32 = 0;

    let mut number_map = HashMap::new();
    number_map.insert("zero", "ze0o");
    number_map.insert("one", "on1e");
    number_map.insert("two", "tw2o");
    number_map.insert("three", "th3ree");
    number_map.insert("four", "fo4ur");
    number_map.insert("five", "fi5ve");
    number_map.insert("six", "si6x");
    number_map.insert("seven", "se7ven");
    number_map.insert("eight", "ei8ght");
    number_map.insert("nine", "ni9ne");


    // iterate over lines
    for line in lines {
        let mut mod_str = line.to_string();
        // iterates ovet number_map
        number_map.iter().for_each(|(key, value)| {
            mod_str = mod_str.replace(key, value);
        });

        let mut first_digit = -1;
        let mut last_digit = -1;

        mod_str.chars().for_each(|c| {
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
