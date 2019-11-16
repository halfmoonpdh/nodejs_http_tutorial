var fs = require("fs");

console.log("a");
fs.readFile("./data/html", "utf8", function(err, result) {
  console.log(result);
});
console.log("b");
