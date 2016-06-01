
var socket      = io();
var connections = [];

var user_name       = '';
var last_message    = '';

var msg_received    = new Audio('receive.mp3');
var msg_sent        = new Audio('send.mp3');

// CLIENT

socket.on('chat_message', function(msg) {

    if (msg !== last_message) {

        msg_received.play();
        pushNotification("New Message", msg);

    } else { msg_sent.play(); }

    $('.box_messages').append($('<div id="field_message">').html(msg));
    $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));

});

socket.on('log_con', function(msg) {

    if(msg != user_name) {

        $('.box_messages').append($('<div id="field_message" style="color:green;">').text(msg +" connected."));
        $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));

        connections.push(msg);
        reloadConnectedUsers();

    }

});

socket.on('log_dc', function(msg) {

    if(msg != user_name) {

        $('.box_messages').append($('<div id="field_message" style="color:red;">').text(msg +" disconnected."));
        $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));

        connections.splice(connections.indexOf(msg), 1);
        reloadConnectedUsers();

    }

});

socket.on('connections', function(msg) {

    loadConnectedUsers(msg);

});

// NOTIFICATIONS

document.addEventListener('DOMContentLoaded', function () {

    if (Notification.permission !== "granted") Notification.requestPermission();

});

function pushNotification(title, text) {

    if (!Notification) return;

    if (Notification.permission !== "granted") Notification.requestPermission();
    else {

        var notification = new Notification(
            title,
            {
                icon: 'icon_notification.png',
                body: text
            }
        );

        setTimeout(function() { notification.close(); }, 2500);

    }

}

// APP

$(document).keypress(function(event) {

    if(event.which == 13) {

        if($("#field_message_input").is(":focus"))  sendMessage();
        if($('#field_user_name').is(":focus"))      setUserName();

    }

});

$(document).ready(function() {

    $('#field_user_name').focus();

});

function setUserName() {

    user_name = $('#field_user_name').val();

    if(user_name !== "") {

        $('.register_overlay').remove();
        $('#field_message_input').focus();
        socket.emit('register', user_name);

    }

}

function sendMessage() {

    var input = $('#field_message_input').val();
    $('#field_message_input').val('');

    last_message = user_name + ": " + input;
    socket.emit('chat_message', last_message);

}

function loadConnectedUsers(connected_names) {

    connections = connected_names;
    reloadConnectedUsers();

}

function reloadConnectedUsers() {

    $('.box_active_users').empty();
    for (var i in connections) $('.box_active_users').append($('<div id="field_active_user">').text(connections[i]));

}
