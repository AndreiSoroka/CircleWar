function playersStatistic() {
    $("#player_list").find('tbody').find('tr').remove();
    for(var i = 0; i < Game.players.length; i++) {
        var pl_static = $('<tr data-id="' + Game.players[i].id + '"></tr>').appendTo("#player_list tbody");
        pl_static.append('<td>' + Game.players[i].id + '</td>');
        pl_static.append('<td>' + Game.players[i].name + '</td>');
        pl_static.append('<td>' + Game.players[i].hp + '</td>');
        pl_static.append('<td>' + Game.players[i].x + '</td>');
        pl_static.append('<td>' + Game.players[i].y + '</td>');
    }
}