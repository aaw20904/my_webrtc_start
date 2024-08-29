
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

//create....
const app = express();
const server = http.createServer(app);//http server
 
var wss = new WebSocket.Server({ server });//WS server


// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));


// Start the server
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

var users ={}

function sendTo(conn, message) {
  conn.send(JSON.stringify(message));
}

wss.on('connection', function (connection) {
      console.log("User connected..");
      
      connection.on('message', function (message) {
            var data;
            try {
              data = JSON.parse(message);
            } catch (e) {
              console.log("Error parsing JSON");
              data = {};
            }

            switch (data.type) {
            case "login":
                  console.log("User logged in as", data.name);
                  if (users[data.name]) {
                        sendTo(connection, { type: "login", success: false});
                  } else {
                        users[data.name] = connection;
                        connection.name = data.name;
                        sendTo(connection, {type: "login", success: true});
                  }

            break;
            ///
            case "offer":
                  console.log("Sending offer to", data.name);
                  var conn = users[data.name];
                  if (conn != null) {
                         connection.otherName = data.name;
                  sendTo(conn, {type: "offer",offer: data.offer, name: connection.name});
                  }
            break;
            ///
            case "answer":
                  console.log("Sending answer to", data.name);
                  var conn = users[data.name];
                  if (conn != null) {
                        connection.otherName = data.name;
                        sendTo(conn, { type: "answer", answer: data.answer});
                  }
            break;
            case "candidate":
                  console.log("sEnding candidate to",data.name)
                  var conn = users[data.name];
                  if (conn != null){
                        sendTo(conn, {type:"candidate", candidate:data.candidate})
                  }
            break;
            case 'leave':
             console.log("Disconnecting user from", data.name)
                  var conn = users[data.name]
                  conn.otherName = null;
                  if (conn!= null){
                        sendTo(conn,{type:"leave"})
                  }
            break;
            ///
            default:
                    sendTo(connection, {type: "error",message: "Unrecognized command: " + data.type});
            break;
            }

      });

      connection.on('close', function () {
            if (connection.name) {
            delete users[connection.name];
              if (connection.otherName){
                  console.log("disconnect user from",connection.otherName);
                  var conn = users[connection.otherName]
                  conn.otherName = null;
                  if (conn != null){
                        sendTo(conn,{type:"leave"});
                  }

              }
            }
      });

      //connection.send('Hello World');
});


//page 75.................
