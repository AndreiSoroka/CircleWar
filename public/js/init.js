'use strict';

$(document).ready(function() {
    initialization();
});

function initialization() {
    window.canvas = document.getElementById("CanvasMain"),
    window.ctx = canvas.getContext('2d');
    window.roomsUpdateInterval = 5000;
    window.redrawInterval = 100;
    window.isGameStart = false;
    window.roomPlayers = [];

    connection();
}

function connection() {
    window.socket = io.connect("http://"+window.document.domain+":80", {
        transports : ["websocket"]
    });

    bindSocketEvents();
}

function onSocketConnected() {
    console.log("connected");

    $("#start").click(function () {
        window.username = $("#username").val();

        login();
    });
}

function bindSocketEvents() {
    socket.on("connect", onSocketConnected);
    socket.on('authorization', onAuthorization);
    socket.on('rooms', onRooms);
    socket.on('activities', onActivities);

    $(window).resize(scaleCanvas);
}

function onActivities(data) {
    console.log('Activity', data);
    if(data.type == 'move') {
        var id = getPlayerByUserId(data.userId);
        Game.players[id].move(data);
    }
}