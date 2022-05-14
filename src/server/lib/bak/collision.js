export function checkCollisions(...args) {
    if (args.length < 2) return false;

    let isColliding = false;

    if (args.length == 2) {
        isColliding = checkCollision(args[0], args[1]);
        if (isColliding) new CollisionResolver().resolveCollision(args[0], args[1]);
    } else {

        let pairs = makePairs(args);

        for (let i = 0, j = pairs.length; i < j; i++) {
            isColliding = checkCollision(pairs[i][0], pairs[i][1]);
            if (isColliding) new CollisionResolver().resolveCollision(pairs[i][0], pairs[i][1]);
        }
    }
    return true;

    function makePairs(args = []) {
        let pairs = [];
        for (let i = 0; i < args.length; i++) {
            let p1 = args[i];
            for (let j = i + 1; j < args.length; j++) {
                let p2 = args[j];
                pairs.push([p1, p2]);
            }
        }
        return pairs;
    }

    function checkCollision(arg1, arg2) {
        // https://en.wikipedia.org/wiki/Multiple_dispatch#JavaScript 
        const arg1Type = arg1.constructor.name;
        const arg2Type = arg2.constructor.name;
        switch (arg1Type) {
            case 'Player':
                switch (arg2Type) {
                    case 'Player':
                        return circlesOverlap(arg1, arg2);
                    case 'Rectangle':
                        return circRectOverlap(arg1, arg2);
                    case 'Bullet':
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                    default:
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                }
            case 'Rectangle':
                switch (arg2Type) {
                    case 'Player':
                        return circRectOverlap(arg2, arg1);
                    case 'Rectangle':
                        return rectsOverlap(arg1, arg2);
                    case 'Bullet':
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                    default:
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                }
            case 'Bullet':
                break;
            default:
                throw new Error(`Object ${arg1Type} is not collideable!`);
        }

    }
}

class CollisionResolver {

    resolveCollision(arg1, arg2) {
        const arg1Type = arg1.constructor.name;
        const arg2Type = arg2.constructor.name;
        switch (arg1Type) {
            case 'Player':
                switch (arg2Type) {
                    case 'Player':
                        this.resolveCircleCircle(arg1, arg2);
                        break;
                    case 'Rectangle':
                        this.resolveCircleRect(arg1, arg2);
                        break;
                    case 'Bullet':
                        throw new Error(`${arg1Type} colliding with ${arg2Type} is not yet implemented!`);
                    default:
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                }
                break;
            case 'Rectangle':
                switch (arg2Type) {
                    case 'Player':
                        this.resolveCircleRect(arg2, arg1);
                        break;
                    case 'Rectangle':
                        this.resolveRectRect(arg1, arg2);
                        break;
                    case 'Bullet':
                        throw new Error(`${arg1Type} colliding with ${arg2Type} is not yet implemented!`);
                    default:
                        throw new Error(`${arg1Type} can not collide with ${arg2Type}`);
                }
                break;
            case 'Bullet':
                throw new Error(`Object ${arg1Type} is not collideable!`);
            default:
                throw new Error(`Object ${arg1Type} is not collideable!`);
        }

    }

    resolveRectRect(r1, r2) {
        console.log('Rects overlapping resolver');
        //throw new Error("Rectanlges collison resolver is not implemented!");
    }

    resolveCircleRect(player, r) {
        /**
         * @param {Circle} player
         * @param {Rectangle} r
         */
        // top
        if (r.y > player.y) {
            player.updatePosition(-Math.PI / 2);
        }
        // bottom
        if (player.y > (r.y + r.height)) {
            //player.updatePosition(-3 / 2 * Math.PI);
            player.y = (p.y + p.height) + player.r;
        }
        // right
        if (player.x > (r.x + r.width)) {
            player.updatePosition(2 * Math.PI);
        }
        // left
        if (r.x > player.x) {
            player.updatePosition(Math.PI);
        }

        /*
        //inside the rectangle
        if (player.x > r.x && player.x < (r.x + r.width)) {
            if (player.y > r.y && player.y < (r.y + r.height)) {
                debugger;
                // bottom
                if ((player.x + player.r) === (r.y + r.height)) {
                    player.updatePosition(-Math.PI / 2);
                }
                // top
                if ((player.y - player.r) == r.y) {
                    player.updatePosition(-3 / 2 * Math.PI);
                }
                // right
                if ((player.x + player.r) === (r.x + r.width)) {
                    player.updatePosition(2 * Math.PI);
                }
                // left
                if ((player.x - player.r) === r.x) {
                    player.updatePosition(Math.PI);
                }
            }
        }
        */

    }

    resolveCircleCircle(player, enemy) {
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

        x = -speed * vCollisionNorm.x;
        y = -speed * vCollisionNorm.y;

        player.updatePosition(x, y)
    }
}

function rectsOverlap(r1, r2) {
    if ((r1.x > (r2.x + r2.width)) || ((r1.x + r1.width) < r2.x)) return false;
    if ((r1.y > (r2.y + r2.height)) || ((r1.y + r1.height) < r2.y)) return false;
    return true;
}

function circlesOverlap(c1, c2) {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    return ((dx * dx + dy * dy) <= (c1.r + c2.r) * (c1.r + c2.r));
}

function circRectOverlap(c, r) {
    let testX = c.x;
    let testY = c.y;
    if (testX < r.x) testX = r.x;
    if (testX > (r.x + r.width)) testX = r.x + r.width;
    if (testY < r.y) testY = r.y;
    if (testY > (r.y + r.height)) testY = r.y + r.height;
    return (((c.x - testX) * (c.x - testX) + (c.y - testY) * (c.y - testY)) <= c.r * c.r);
}