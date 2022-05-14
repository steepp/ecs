const Weapon = require('./weapon.js');


class Blob {
	constructor(id, nickname, x, y, radius) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.health = 100;
		this.r = radius;
		this.width = radius * 2;
		this.height = radius * 2;
		this.speed = 100;
		this.hp = 100;
		this.nickname = nickname;
		this.isColliding = false;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.friction = 0.993;
		this.weapon = new Weapon();
		this.dx = 0;
		this.dy = 0;
		this.direction = null;	// mouse direction. updated in Game class
		this.visionField = null;
		this.vision = [];		// array of polygon points [{x:1, y:2}, {...}, ...]
	}

	update(t) {
		//
		// update vision polygon here
		// vision is set in Game class when the player is added to the game
		// Vision field contaings mutable rectangles and player object!
		// we need to update a vision field to recalculate the polygon
		this.visionField.update();
		// this.vision is a polygon that's rendered in client
		this.vision = this.visionField.getVisibleArea();

		// updating positions
		this.ax = this.dx * this.speed;
		this.ay = this.dy * this.speed;

		this.vx += this.ax * t;
		this.vy += this.ay * t;

		this.vx *= this.friction;
		this.vy *= this.friction;

		this.x += this.vx * t;
		this.y += this.vy * t;
	}

	shoot(direction, t) {
		const x = Math.cos(direction) * this.r * 1.5 + this.x;
		const y = Math.sin(direction) * this.r * 1.5 + this.y;
		return this.weapon.shoot(x, y, direction, t);
	}

	createVisionField(rectangles) {
		//AN ALTERNATIVE: call fog here passing rectangles from Game class instead of calling fog in addPlayer()
	}
}

module.exports = Blob;
