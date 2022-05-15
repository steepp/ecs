const { Point } = require('./lib/shapes.js');

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isColliding = false;
}

Rectangle.prototype.getPointsFromRectangle = function () {
    return [
        new Point(this.x, this.y),
        new Point(this.x + this.width, this.y),
        new Point(this.x + this.width, this.y + this.height),
        new Point(this.x, this.y + this.height)
    ];
}

module.exports = Rectangle;