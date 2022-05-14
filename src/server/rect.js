function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isColliding = false;
}

Rectangle.prototype.getPointsFromRectangle = function () {
    //fog.js calls this method on rectangles 
    return [
        { x: this.x, y: this.y },
        { x: this.x + this.width, y: this.y },
        { x: this.x + this.width, y: this.y + this.height },
        { x: this.x, y: this.y + this.height },
    ];

}

module.exports = Rectangle;