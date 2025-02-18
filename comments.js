// Create web server

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var pathname = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;
  var queryObj = qs.parse(query);
  var filePath = '.' + pathname;
  var extname = path.extname(filePath);
  var contentType = 'text/html';
  var data = '';
  var comment = '';
  var comments = [];
  var commentObj = {};

  if (extname === '.css') {
    contentType = 'text/css';
  }

  if (pathname === '/comments') {
    if (request.method === 'POST') {
      request.on('data', function(chunk) {
        data += chunk;
      });
      request.on('end', function() {
        commentObj = JSON.parse(data);
        console.log(commentObj);
        fs.readFile('./comments.json', function(err, d) {
          comments = JSON.parse(d);
          comments.push(commentObj);
          fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
            if (err) {
              console.log(err);
            }
          });
        });
      });
    } else if (request.method === 'GET') {
      fs.readFile('./comments.json', function(err, d) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(d);
      });
    }
  } else {
    fs.readFile(filePath, function(error, content) {
      if (error) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('404 Not Found');
      } else {
        response.writeHead(200, {'Content-Type': contentType});
        response.end(content, 'utf-8');
      }
    });
  }
});

// Listen on port 8000, IP defaults to