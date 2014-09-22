'use strict';

function roomGetList(data) {
    $("#rooms").find("tbody").find("tr").remove();
    for(var key in data.rooms) {
        var current_room = $('<tr data-id="' + key + '"></tr>').appendTo("#rooms tbody");
        current_room.append('<td>'+ data.rooms[key].name +'</td>');
        current_room.append('<td>'+ data.rooms[key].numPlayers.dark +'</td>');
        current_room.append('<td>'+ data.rooms[key].numPlayers.light +'</td>');
        current_room.append('<td>'+ data.rooms[key].maxPlayers +'</td>');
        current_room.append('<td>'+ data.rooms[key].typeRoom +'</td>');
        current_room.append('<td>'+ data.rooms[key].status +'</td>');
    }
}

function roomList(data) {
    $("#room").find("tbody").find("tr").remove();
    for(var key in data.players) {
        var current_room;
        if(userId == key){
            current_room = $('<tr id="me" data-id="' + key + '"></tr>').appendTo("#room tbody");
        }
        else {
            current_room = $('<tr data-id="' + key + '"></tr>').appendTo("#room tbody");
        }
        current_room.append('<td>' + key + '</td>');
        current_room.append('<td>' + data.players[key].name + '</td>');
        current_room.append('<td>' + data.players[key].status + '</td>');
        current_room.append('<td>' + getRoomTypeName(data.players[key].type) + '</td>');
        current_room.append('<td><i class="fa fa-times"></i></td>');
        data.players[key].userId = parseInt(key);
        roomPlayers.push(data.players[key]);
    }
}

function roomJoin(data) {
    var current_room = $('<tr data-id="' + data.userId + '"></tr>').appendTo("#room tbody");
    current_room.append('<td>' + data.userId + '</td>');
    current_room.append('<td>' + data.player.name + '</td>');
    current_room.append('<td>' + data.player.status + '</td>');
    current_room.append('<td>' + getRoomTypeName(data.player.type) + '</td>');
    if (data.player.status == 2)
        current_room.append('<td><i class="fa fa-check"></i></td>');
    else if (data.player.status == 1)
        current_room.append('<td><i class="fa fa-times"></i></td>');
    data.player.userId = parseInt(data.userId);
    roomPlayers.push(data.player);
}

function roomReady(data) {
    var in_room_players = $("#room").find('tbody').find('tr');
    for(var i = 0;i<in_room_players.length;i++) {
        if($(in_room_players[i]).data('id') == data.userId) {
            if(data.flag) {
                $(in_room_players[i]).find('i').removeClass('fa-times').addClass('fa-check');
            }
            else {
                $(in_room_players[i]).find('i').removeClass('fa-check').addClass('fa-times');
            }
        }
    }
}

function roomLeave(data) {
    var in_room_players = $("#room").find('tbody').find('tr');
    for(var i = 0;i<in_room_players.length;i++) {
        if($(in_room_players[i]).data('id') == data.userId) {
            $(in_room_players[i]).remove();
        }
    }
    for(var i = 0;i<roomPlayers.length;i++) {
        if(roomPlayers[i].userId == data.userId) {
            var index = roomPlayers.indexOf(roomPlayers[i]);
            if (index > -1) {
                roomPlayers.splice(index, 1);
            }
        }
    }
}

function onRooms(data) {
    console.log('Room event',data);
    switch (data.type) {
        case 'get list':
            roomGetList(data);
            break;
        case 'list':
            roomList(data);
            break;
        case 'join':
            roomJoin(data);
            break;
        case 'ready':
            roomReady(data);
            break;
        case 'leave':
            roomLeave(data);
            break;
        case 'start':
            gameStart(data);
            break;
    }
}

function chooseRoom() {
    $("#rooms").hide();
    socket.emit('rooms',{type:'join', idRoom: $(this).data('id')});

    $("#room").show();
    centerDiv('room');
}

function leaveRoom() {
    socket.emit('rooms',{type:'leave'});
    window.roomPlayers = [];
    $("#room").hide();
    socket.emit('rooms',{type:'get list'});
    $("#rooms").show().find('tbody').unbind('click');
    $("#rooms").show().find('tbody').on('click','tr',chooseRoom);
}

function changeStatus() {
    var symble = $('#me').find('i');
    if($(symble).hasClass('fa-times')) {
        $(symble).removeClass('fa-times').addClass('fa-check');
        socket.emit('rooms',{type:'ready', flag:true});
        $(this).html("Not Ready");
    }
    else {
        $(symble).removeClass('fa-check').addClass('fa-times');
        socket.emit('rooms',{type:'ready', flag:false});
        $(this).html("Ready");
    }
}

function getRoomTypeName(type) {
    if(type == 0) {
        return 'Dark';
    }
    else if(type == 1) {
        return 'Light';
    }
    return 'Unknown';
}