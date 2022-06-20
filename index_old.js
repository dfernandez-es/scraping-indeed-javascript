const puppeteer = require("puppeteer");
const sqlite3 = require("sqlite3");

let db = new sqlite3.Database("./jobs.db", (err) => {
  if (err) {
    console.log("Error Occurred - " + err.message);
  } else {
    console.log("DataBase Connected");
  }
});

async function scrape(lenguaje, today) {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.goto(
    `https://es.indeed.com/ofertas?q=${lenguaje}&l=Espa%C3%B1a&fromage=14&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11`
  );
  await page.waitForSelector("#searchCountPages");
  let result = await page.evaluate(() => {
    let query = document.body
      .querySelector("#searchCountPages")
      .textContent.split(" ");
    return query[query.length - 2];
  });
  var params = [lenguaje, result, today];
  var insertQuery = `INSERT INTO Jobs ( Language , Offers, Date) VALUES (?,?,?);`;
  db.run(insertQuery, params, (err) => {
    if (err) {
      console.log("Error Occurred - " + err.message);
      return;
    }
    console.log(`${lenguaje},${result},${today}`);
  });

  await browser.close();
}

const lista = [
  "java",
  "javascript",
  "node",
  "react",
  "python",
  "spring",
  "typescript",
  "angular",
  ".net",
  "kotlin",
  "linux",
  "aws",
  "php",
];

const date = new Date();
const today = date.toDateString();
lista.forEach((lenguaje) => scrape(lenguaje, today));

// var createQuery =
//   "CREATE TABLE Jobs ( Language TEXT , Offers NUMERIC, Date TEXT);";

// db.run(createQuery, (err) => {
//   if (err) return;

//   // Success
//   console.log("Table Created");
// });
