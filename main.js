var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

function templateHTML(list, title, body) {
  return `
      <!doctype html>
      <html>
      ${list}
      <h1>${title}</h1>
      <a href="/create">create</a>
      <p>${body}</p>
      </html>
      `;
}

function templateList(filelist) {
  var list = "<ul>";
  for (var i = 0; i < filelist.length; i++) {
    list += `<li>${filelist[i]}</li>`;
  }
  list += "</ul>";
  return list;
}

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function(err, filelist) {
        var title = "Welcome";
        var description = "Hello Node.js";
        var list = templateList(filelist);
        var template = templateHTML(list, title, description);

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function(err, filelist) {
        var title = queryData.id;
        var list = templateList(filelist);

        var template = templateHTML(list, title, description);

        response.writeHead(200);
        response.end(template);
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function(err, filelist) {
      var title = "Web - create";
      var list = templateList(filelist);
      var description = `
      <form action="/create_process" method="post">
            <p><input type="text" name="text" placeholder="title"/></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit" /></p>
       </form>`;
      var template = templateHTML(list, title, description);

      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function(data) {
      body = body + data;
    });
    request.on("end", function() {
      var post = qs.parse(body);
      var title = post.text;
      var description = post.description;
      console.log(title);
      fs.writeFile(`data/${title}`, description, "utf8", function(err) {
        response.writeHead(200);
        response.end("success");
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
