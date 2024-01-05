use std::collections::HashMap;

use struct_field_names_as_array::FieldNamesAsArray;

use crate::db::pg_driver::PgDriver;
use crate::db::table_users::User;

/// This module contains the base implementation for the CRUD operations
///
/// Example usage:
/// ```
/// use crate::db::db_actions::Table;
///
/// struct User {
///     id: i32,
///     name: String,
///     email: String,
/// }
///
/// impl Table for User {
///     // User specific implementations
/// }
///
/// fn main() {
///    // Now you can access all base and user specific implementations
///    User::insert([args]);
/// }
pub trait Table {
    /// Inserts a new entry into a given table table.
    ///
    /// # Arguments
    /// * `driver` - The database driver.
    /// * `table` - The table to insert into.
    /// * `cols` - The columns to insert into.
    /// * `vals` - The values to insert into the columns.
    fn insert(mut driver: PgDriver, table: &str, cols: Vec<&str>, vals: Vec<&str>) {
        let cols = cols.iter().map(|c| format!("\"{}\"", c)).collect::<Vec<_>>().join(", ");
        let vals = vals.iter().map(|v| format!("'{}'", v)).collect::<Vec<_>>().join(", ");
        println!("cols: {}, vals: {}", cols, vals);
        driver.exec(&format!("INSERT INTO {} ({}) VALUES ({})", table, cols, vals))
            .expect("Insertion failed.");
    }

    /// Queries a given table.
    ///
    /// # Arguments
    /// * `driver` - The database driver.
    /// * `table` - The table to query.
    /// * `cols` - The columns to query.
    /// * `condition` - The condition to query. Optional.
    fn read(mut driver: PgDriver, table: &str, mut cols: Vec<String>, condition: Option<String>) -> Vec<User> {
        let mut res = vec![];
        let fmt_cols = cols.iter().map(|c| format!("{:?}", c)).collect::<Vec<_>>().join(", ");

        let rows = match condition {
            Some(condition) => driver.query(&format!("SELECT {} FROM {} WHERE {}", fmt_cols, table, condition))?,
            None => driver.query(&format!("SELECT {} FROM {}", fmt_cols, table))?
        };

        for row in rows {
            let mut map = HashMap::new();
            let mut cols = cols.clone();
            if cols.eq("*") {
                cols = Vec::from(User::FIELD_NAMES_AS_ARRAY.iter().map(|fld| return fld.to_string();));
            }
            for (i, col) in cols.iter().enumerate() {
                map.insert(col.clone(), row.get(i));
            }
            res.push(map);
        }
        todo!("Make res a list of users")
    }

    fn update(&self) {
        todo!()
    }

    fn delete(&self) {
        todo!()
    }

    /// The table specific implementation for adding a new entry.
    fn store(&self, driver: PgDriver);

    /// The table specific implementation for retrieving an entry.
    fn retrieve(driver: PgDriver) -> Vec<User>;

    /// The table specific implementation for editing an entry.
    fn edit();

    /// The table specific implementation for removing an entry.
    fn remove();
}
