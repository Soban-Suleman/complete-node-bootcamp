'use strict';
const fs = require('fs');
//for bulding http server
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
//sync way
// const txtInt = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(txtInt);
// const txtOut = `avocado information : ${txtInt} \n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", txtOut);
// console.log("file written");

//Async way
/* fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("file not found");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile(
        "./txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          console.log("data written");
        },
      );
    });
  });
});
console.log("reading file");
 */
//Server

const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8',
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);
const dataObj = JSON.parse(data);
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  // Overview page
  if (pathname === '/overview' || pathname === '/') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(
      '{%PRODUCT_CARD%}',
      cardsHtml,
    );
    response.end(output);
  }

  //Product page
  else if (pathname === '/product') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);
  }

  //Api
  else if (pathname == '/api') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(data);
  }

  //Unknown
  else {
    response.writeHead(404, {
      'Content-Type': 'text/html',
    });
    response.end('<h1>404, Page not found</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('server started, listening to port 8000');
});
