var DomParser = require('dom-parser');
const sqlite3 = require("sqlite3");
const moment = require("moment");

let db = new sqlite3.Database("./jobs.db", (err) => {
  if (err) {
    console.log("Error Occurred - " + err.message);
  } else {
    console.log("DataBase Connected");
  }
});

async function scrape(lenguaje, fecha){
	fetch(`https://es.indeed.com/ofertas?q=${lenguaje}&l=Espa%C3%B1a&fromage=14&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11`) 
		.then(response => response.text())
	 	.then(text => {
			const parser = new DomParser();
			const htmlDocument = parser.parseFromString(text, "text/html");
			const section = htmlDocument.getElementById('searchCountPages').innerHTML;
			let dato = section.split(" ");
			dato = dato[dato.length - 2];
		
			var params = [lenguaje, dato, fecha];
  			var insertQuery = `INSERT INTO Jobs ( Language , Offers, Date) VALUES (?,?,?);`;
			db.run(insertQuery, params, (err) => {
			if (err) {
				console.log("Error Occurred - " + err.message);
				 return;
			}
			lenguaje.length > 8 ? console.log(`${lenguaje}\t${dato}\t${fecha}`) :  console.log(`${lenguaje}\t\t${dato}\t${fecha}`);
  });


	  })
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

const today = moment().format('YYYY-MM-DD');
lista.forEach((lenguaje) => scrape(lenguaje, today));

