const sqlite3 = require("sqlite3");

let db = new sqlite3.Database("./jobs.db", (err) => {
  if (err) {
    console.log("Error Occurred - " + err.message);
  } else {
    console.log("DataBase Connected");
  }
});

var createQuery =
  "CREATE TABLE Jobs ( Language TEXT , Offers NUMERIC, Date DATE, CONSTRAINT unico UNIQUE (Language, Date));";

db.run(createQuery, (err) => {
if (err) {
	console.log(err);
	return;
}
 // Success
	console.log("Table Created");
});