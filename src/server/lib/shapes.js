class Shape {
	constructor(ctx, coordinates, lineWidth, strokeStyle, fillStyle) {
		this.ctx = ctx;
		/*
		this.ctx.lineWidth = lineWidth;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.fillStyle = fillStyle;
		*/
		this.points = coordinates;

		this.lineWidth = lineWidth;
		this.strokeStyle = strokeStyle;
		this.fillStyle = fillStyle;
	}
}

class Polygon extends Shape {
	render(border = false, fill = true) {
		this.ctx.save()

		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.fillStyle = this.fillStyle;

		this.ctx.beginPath();
		let [x, y] = this.points[this.points.length - 1];
		//let [x, y] = this.points[0];
		this.ctx.moveTo(x, y);
		for (let i = 0; i < this.points.length; i++) {
			[x, y] = this.points[i];
			this.ctx.lineTo(x, y);
			if (border) this.ctx.stroke();
		}
		if (fill) this.ctx.fill();
		this.ctx.restore();
	}
}


class Circle {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	collide(other) {
		const type = other.constructor.prototype;
		switch (type) {
			case Circle:
				this.collideWithEnemy(other);
				break;
			case Rectangle:
				this.collideWithRectangle(other);
				break;
			case Bullet:
				throw new Error(`${this.constructor.prototype} colliding with ${type} is not yet implemented!`);
				break;
			default:
				throw new Error(`Object ${type} is not collideable with ${this.constructor.prototype}!`);
		}
	}

	collideWithRectangle(r) {
		// top
		if (r.y > this.y) {
			this.updatePosition(-Math.PI / 2, this.distance);
		}
		// bottom
		if (this.y > (r.y + r.height)) {
			this.updatePosition(-3 / 2 * Math.PI, this.distance);
			//player.y = (p.y + p.height) + player.r;
		}
		// right
		if (this.x > (r.x + r.width)) {
			this.updatePosition(2 * Math.PI, this.distance);
		}
		// left
		if (r.x > this.x) {
			this.updatePosition(Math.PI, this.distance);
		}

	}

	collideWithEnemy(enemy) {
		//calculate the collision vector;
		let vCollision = { x: enemy.x - player.x, y: enemy.y - player.y }

		// get distance between two circles
		let d = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);

		// create a unit vector (lenght = 1)
		let vCollisionNorm = { x: vCollision.x / d, y: vCollision.y / d };

		// calculate relative velocity
		// players has the same speed along both axis
		let s = player.speed - enemy.speed;
		let vRelativeVelocity = { x: s, y: s };

		// get the speed of the collision
		let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
		if (speed <= 0) speed = 1;

		this.x -= speed * vCollisionNorm.x;
		this.y -= speed * vCollisionNorm.y;
	}


}

class Rectangle {
	constructor(x, y, width, height) {
		//this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.lineWidth = 1;
		this.strokeStyle = 'black';
		this.fill = true;
		this.fillStyle = 'rgb(0, 255, 0)';
	}

	accept(visitor) {
		visitor.visitRectangle(this);
	}

	getPointsFromRectangle() {
		// split only those rectangles that overlap search query in the rtree (see below)
		//all points of a rectangle
		let rectsPoints = [
			new Point(this.x, this.y),
			new Point(this.x + this.width, this.y),
			new Point(this.x + this.width, this.y + this.height),
			new Point(this.x, this.y + this.height),
		];
		return rectsPoints;
	}

	/*
	render() {
		this.ctx.save();
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.fillStyle = this.fillStyle;

		if (this.fill) this.ctx.fillRect(this.x, this.y, this.width, this.height);
		else this.ctx.strokeRect(this.x, this.y, this.width, this.height);

		this.ctx.restore();
	}
	*/
}

class Bullet extends Rectangle {
	//TODO
}

class BorderRect extends Rectangle {
	constructor(...args) {
		super(...args);
		this.lineWidth = 3;
		this.strokeStyle = 'red';
		this.fill = false;
	}
}

class Ray {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.direction = p2.substract(p1);
		this.caption = 'not set';
		//this.ctx.lineWidth = lineWidth;
		//this.ctx.strokeStyle = strokeStyle;
	}

	render(ctx, end) {
		ctx.save();
		//ctx.globalCompositeOperation = 'destination-atop';

		ctx.strokeStyle = "#dd3838";
		ctx.fillStyle = "#dd3838";
		// Draw red laser
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		// Draw red dot
		ctx.beginPath();
		ctx.arc(end.x, end.y, 4, 0, 2 * Math.PI, false);
		ctx.fill();
		// Write caption
		ctx.font = '11pt Calibri';
		ctx.fillStyle = 'rgb(0,255,0)';
		ctx.fillText('[ ' + Math.round(end.x) + ', ' + Math.round(end.y) + ' ]', end.x + 5, end.y - 10);

		//Write direction angle
		ctx.font = '11pt Calibri';
		ctx.fillStyle = 'rgb(255,126,0)';
		ctx.fillText('angle: ' + this.caption, end.x + 10, end.y - 25);

		ctx.restore();
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	substract(point) {
		return new Point(this.x - point.x, this.y - point.y);
	}
}

class Segment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.direction = p2.substract(p1);
	}

	render(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.p1);
		ctx.lineTo(this.p2);
		ctx.stroke();
		ctx.restore();
	}
}

module.exports = { Segment, Point, Ray, Polygon, Rectangle };
