const id = require('nanoid');


function Weapon() {
    this.rate = 0.1;
    this.range = 1000;
    this.lastRoundTime = 0;
}

Weapon.prototype.shoot = function (x, y, d, t) {
    const elapsed = (t - this.lastRoundTime) / 1000;
    if (elapsed >= this.rate) {
        this.lastRoundTime = t;
        return new Bullet(x, y, d, this.range);
    }
    return null;
}

function Bullet(x, y, d, r) {
    this.id = id.nanoid();
    this.x = x;
    this.y = y;
    this.r = 3;     // radius in pixels
    this.width = this.r*2;
    this.height = this.r*2;
    this.ox = x;
    this.oy = y;
    this.vx = 0;
    this.vy = 0;
    this.speed = 450;
    //this.speed = 250;
    this.damage = 5;
    this.direction = d;
    this.range = r;		// pixels
    this.isActive = true;
}

Bullet.prototype.update = function (t) {
    this.vx = this.speed * Math.cos(this.direction) * t;
    this.vy = this.speed * Math.sin(this.direction) * t;
    this.x += this.vx;
    this.y += this.vy;
    const len = Math.sqrt((this.x - this.ox) ** 2 + (this.y - this.oy) ** 2);
    if (len > this.range) {
        this.isActive = false;
    }
}

module.exports = Weapon;
