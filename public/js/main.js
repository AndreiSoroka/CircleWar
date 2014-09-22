'use strict';

function login() {
    socket.emit('authorization', {
        cookie : username
    });
}

function onAuthorization(data) {
    console.log('Authorization', data);
    switch (data.response) {
        case 1:
            // Connected
            console.log('successful');
            window.userId = data.userId;
            loadLobby();
            break;
        case 2:
            console.log('not found session');
            break;
        case 3:
            // Already Connected
            console.log('open copy');
            break;
    }
}

function scaleCanvas() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();
}

function centerDiv(id) {
    var el = "#"+id;
    $(el).css("left","50%").css("margin-left",'-' + ($(el).width()/2) + 'px');
    $(el).css("top","50%").css("margin-top",'-' + ($(el).height()/2) + 'px');
}