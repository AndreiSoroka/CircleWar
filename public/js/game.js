'use strict';

function tempRender(){
var element = document.getElementById("canv"),
c = element.getContext('2d');
// c.fillStyle = 'green';
c.fillRect(0, 0, element.width, element.height);
element.addEventListener('click', getClickXY, false);

function getClickXY(event) {
	var clickX = (event.layerX == undefined ? event.offsetX : event.layerX) + 1;
	var clickY = (event.layerY == undefined ? event.offsetY : event.layerY) + 1;
	console.log('Click: {x: ' + clickX + ', y: ' + clickY + '}');
}

//////////////////////////////
// рисуем стены
var walls = view_maps['test'].objects.walls;
for (var k in walls) {

	// мнимые зоны
	c.fillStyle = '#ffe3e3';
	c.fillRect(walls[k].imaginary.x, walls[k].imaginary.y, walls[k].imaginary.width, walls[k].imaginary.height);

	// стены
	c.beginPath();
	var lastPoint = null;
	for (var point in walls[k].coordinates) {
		if (lastPoint == null) {
			lastPoint = point;
			continue;
		}
		// c.fillStyle = 'green';
		c.moveTo(walls[k].coordinates[lastPoint].x, walls[k].coordinates[lastPoint].y) // перемещает "курсор" в позицию x, y и делает её текущей
		c.lineTo(walls[k].coordinates[point].x, walls[k].coordinates[point].y) // ведёт линию из текущей позиции в указанную, и делает в последствии указанную текущей
		lastPoint = point;
	}
	c.stroke(); // *22
}
}

function gameStart(data) {
    tempRender();
    $("#room").hide();
    window.isGameStart = true;

    loadMap(data.mapId);

    window.Game = [];
    window.Game.players = [];

    for(var i=0;i<roomPlayers.length;i++) {
        var pl = new Player(roomPlayers[i].userId,
            roomPlayers[i].name,
            data.players[roomPlayers[i].userId].x,
            data.players[roomPlayers[i].userId].y,
            data.players[roomPlayers[i].userId].speed);
        Game.players.push(pl);
    }
    $("#player_list").show();
    document.onkeydown = listenKeyBoard;
    document.onkeyup = listenKeyBoard;
    window.gameCycleId = setInterval(gameCycle,redrawInterval);
}

function gameCycle() {
    if(!isGameStart) {
        clearInterval(gameCycleId);
        return;
    }
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Map
    window.map.draw();

    // Draw Players
    for(var i = 0; i < Game.players.length; i++) {
        Game.players[i].draw();
    }

    playersStatistic();
}

function loadMap(mapId) {
    window.map = new Map(view_maps[mapId]);
}