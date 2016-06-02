
var socket      = io();
var connections = [];

var user_name       = '';
var last_message    = '';

var msg_received    = new Audio('receive.mp3');
var msg_sent        = new Audio('send.mp3');

// CLIENT

socket.on('chat_message', function(msg) {

    if (msg.user !== user_name) {

        msg_received.play();
        var msg_push = msg.message;
        msg_push = msg_push.split('<br/>').join('\n');
        pushNotification("New Message", msg_push);

    } else { msg_sent.play(); }

    printChatMessage(msg.user,msg.message);

});

socket.on('log_con', function(msg) {

    if(msg != user_name) {
        printSysMessage(msg+" connected.", "green");

        connections.push(msg);
        reloadConnectedUsers();

    }

});

socket.on('log_dc', function(msg) {

    if(msg != user_name) {
        printSysMessage(msg+" disconnected.", "red");

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
        if(!event.shiftKey){
            event.preventDefault();
            if($("#field_message_input").is(":focus"))  sendMessage();
            if($('#field_user_name').is(":focus"))      setUserName();
        }
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

        $('#messaging_holder').css('zIndex',10);
    }

}

function printChatMessage(user,message, custom_color){
    custom_color = custom_color || "#000";
    $('.box_messages').append($('<div id="field_message" style="color:'+custom_color+'">').html(

        "<div class='user'>"+user+"</div>"+
        "<div class='message'>"+message+"</div>"

    ));
    $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));
}
function printMessage(message, custom_color){
    custom_color = custom_color || "#000";
    $('.box_messages').append($('<div id="field_message" style="color:'+custom_color+'">').html(message));
    $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));
}
function printSysMessage(message,custom_color){
    custom_color = custom_color || "#000";
    $('.box_messages').append($('<div id="field_message" style="color:'+custom_color+'">').html(":: "+message));
    $('.box_messages').scrollTop($('.box_chat').prop("scrollHeight"));
}

function sendMessage() {

    var input = $('#field_message_input').val();
    $('#field_message_input').val('');

    last_message = input;
    socket.emit('chat_message', {user:user_name,message:last_message});

}

function loadConnectedUsers(connected_names) {

    connections = connected_names;
    reloadConnectedUsers();

}

function reloadConnectedUsers() {

    $('.box_active_users').empty();
    for (var i in connections) $('.box_active_users').append($('<div id="field_active_user">').text(connections[i]));

}
