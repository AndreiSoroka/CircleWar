function Player(id,name,x,y,speed) {
    this.id = id;
    this.name = name;
    this.hp = 100;
    this.x = x;
    this.y = y;
    this.moving = false;
    this.moveX = 0;
    this.moveY = 0;
    this.speed = speed;
    this.angle = 0;

    this.draw = function() {
        if(this.moving) {
            this.clientMove();
        }
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+5, this.y);
        ctx.lineTo(this.x+5, this.y+5);
        ctx.lineTo(this.x, this.y+5);
        ctx.closePath();
        ctx.fill();
    };

    this.clientMove = function() {
        var a = this.angle * Math.PI / 180;
        this.moveX = (this.angle != 90 && this.angle != 270) ? (Math.floor(Math.cos(a) * this.movement())) : 0;
        this.moveY = (this.angle != 180 && this.angle != 0) ? -1 * (Math.floor(Math.sin(a) * this.movement())) : 0;
        this.x += this.moveX;
        this.y += this.moveY;
    };

    this.move = function(data) {
        this.x = data.x;
        this.y = data.y;
        this.moving = data.move;
        this.angle = data.angle;
        this.speed = data.speed;
    };

    this.movement = function() {
        return this.speed * redrawInterval / 1000;
    };
}

function getPlayerByUserId(id) {
    for(var i = 0;i<Game.players.length;i++) {
        if(Game.players[i].id == id)
            return i;
    }
}