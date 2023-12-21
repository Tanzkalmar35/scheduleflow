use std::env;

use diesel::{Connection, PgConnection};
use dotenv::dotenv;

#[path = "ops/calendar_ops.rs"]
mod calendar_ops;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("database url must be set.");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
