export class Player {
    constructor(x, y, radius = 15) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.speed = 200;
        this.isColliding = false;
        this.timePassed = 0;
        this.duration = 1;      // animation duration in seconds
        this.startX = x;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dX, dY, elapsedTime) {
        this.x += dX * this.speed * elapsedTime;
        this.y += dY * this.speed * elapsedTime;
    }
}