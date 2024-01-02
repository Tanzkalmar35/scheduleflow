use struct_field_names_as_array::FieldNamesAsArray;

use crate::db::db_actions::Table;
use crate::db::pg_driver::PgDriver;

#[derive(FieldNamesAsArray)]
struct User {
    lastname: String,
    firstname: String,
    address: String,
    city: String,
}

impl User {
    /// Creates a new user.
    fn new(lastname: String, firstname: String, address: String, city: String) -> Self {
        Self {
            lastname,
            firstname,
            address,
            city,
        }
    }

    /// Provides the values of the user formatted as a vector of &str.
    fn vals(&self) -> Vec<&str> {
        vec![&self.lastname, &self.firstname, &self.address, &self.city]
    }
}

impl Table for User {
    fn store(&self, driver: PgDriver) {
        let cols = Vec::from(User::FIELD_NAMES_AS_ARRAY);
        let vals = self.vals();
        User::insert(
            driver,
            "users",
            cols,
            vals,
        );
    }

    fn retrieve() {
        todo!()
    }

    fn edit() {
        todo!()
    }

    fn remove() {
        todo!()
    }
}

#[test]
pub fn test_user_insertion() {
    let user = User::new(
        String::from("Max"),
        String::from("Mustermann"),
        String::from("Musterstr. 1"),
        String::from("Mustercity"),
    );
    let mut driver = PgDriver::setup().unwrap();
    driver.connect().unwrap();
    user.store(driver);
}
