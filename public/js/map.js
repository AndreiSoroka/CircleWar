function Map(data) {
    this.width = data.width;
    this.height = data.height;
    this.objects = data.objects;
    this.respawn = data.respawn;

    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.width);
        ctx.lineTo(this.height, this.width);
        ctx.lineTo(this.height, 0);
        ctx.lineTo(0, 0);
        ctx.lineWidth = 2;

        // set line color
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
}