'use strict';

function loadLobby() {
    $("#startBox").hide();
    scaleCanvas();
    $("#CanvasMain").fadeIn().css("display","block");
    socket.emit('rooms',{type:'get list'});

    $("#rooms").show().find('tbody').unbind('click');
    $("#rooms").show().find('tbody').on('click','tr',chooseRoom);
    centerDiv('rooms');
    $("#ready").click(changeStatus);
    $("#leave").click(leaveRoom);
}