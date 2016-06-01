
// -- -- -- -- --
// SERVER
// -- -- -- -- --



var express = require("express");
var app     = express();
var http    = require("http").Server(app);
var io      = require("socket.io")(http);

var connections = [];

app.use(express.static('public'));

app.get('/', function(req, res) {

    res.sendfile('index.html');

});

io.on('connection', function(socket) {

    socket.on('chat_message', function(msg) {

        console.log(msg);
        console.log(processMessage(msg));
        console.log("-- -- -- --");

        io.emit('chat_message', processMessage(msg));

    });

    socket.on('register', function(msg) {

        console.log('User ' + msg + ' connected.');
        io.emit('log_con', msg);

        connections.push({
            sc: socket,
            name: msg
        });

        var names = [];
        for (var i in connections) {
            names.push(connections[i].name);
        }

        io.to(socket.id).emit('connections', names);
        names = null;

    });

    socket.on('disconnect', function() {

        var conn_id = -1;

        for (var i in connections) {

            if (connections[i].sc == socket) {

                io.emit('log_dc', connections[i].name);
                conn_id = i;

                break;

            }

        }

        if (conn_id != -1) connections.splice(conn_id, 1);

    });

});

http.listen(3000, function() {

    console.log('Server started on port: 3000');

});



// -- -- -- -- --
// MESSAGE PROCCESSING
// -- -- -- -- --



function processMessage(msg) {

	var last_position  = 0;
	var timeout        = 0;
	var message        = msg;

	while (last_position < msg.length) {

		if(timeout++ > 500) break;

        if (msg.indexOf("http", last_position) > -1 ||
            msg.indexOf("www",  last_position) > -1) {

			var h = msg.indexOf('http',  last_position);
			var w = msg.indexOf('www',   last_position);
			var s = 0;

            if (h != -1) {

                if (w != -1)    start = h < w ? h : w;
                else            start = h;

            } else start = w;

			var end = msg.indexOf(" ", start) != -1 ? msg.indexOf(" ", start) : msg.length;

			// SEPARATE TWO LINKS

            if (msg.indexOf("http", start + "http".length) > -1 ||
                msg.indexOf("www",  start + "www".length)  > -1) {

                    var s2h = msg.indexOf("http", start + "http".length);
                    var s2w = msg.indexOf("www",  start + "www".length);

                    s2h = s2h == -1 ? end : s2h;
                    s2w = s2w == -1 ? end : s2w;

                    if (s2h < end ||
                        s2w < end) {

                            if      (s2h <= s2w && s2h != -1) end = s2h;
                            else if (s2w <= s2h && s2w != -1 && s2w > start + "https://".length) end = s2w;

                        }

                }

            // CONTINUE

            var l = msg.substr(start, end - start);
            var g = l;
            var f = "";

            if (start = w) g = "https://" + g;

			// CHECK IF IMAGE

            if (isIMG(l))   f = "<a href='" + g + "' target='blank'> <img src='" + g +
                                "' style='max-width:100px; max-height:100px;'/></a>";
            else            f = "<a href='" + g + "' target='_blank'>" + l + "</a>";

            // CHECK IF URL

            if (isURL(l)) message = message.replace(l, f);

            // CONTINUE

			last_position = end;

		}

		last_position = msg.length;

	}

    return message;

}

function isURL(str) {

	var pattern = new RegExp(
        '^(https?:\\/\\/)?' +                                   // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +   // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' +                         // or ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                     // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' +                            // query string
        '(\\#[-a-z\\d_]*)?$','i');                              // fragment locator

	return pattern.test(str);

}

function isIMG(url) {

    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);

}
