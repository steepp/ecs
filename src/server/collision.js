const BULLET = 'Bullet';
const PLAYER = 'Blob';
const RECTANGLE = 'Rectangle';


function collide(a, b) {
    if (checkCollision(a, b)) {
        //a.isColliding = true;
        //b.isColliding = true;
        resolveCollision(a, b);
    }
    //a.isColliding = false;
    //b.isColliding = false;
}

function checkCollision(arg1, arg2) {
    // https://en.wikipedia.org/wiki/Multiple_dispatch#JavaScript 
    const one = arg1.constructor.name;
    const two = arg2.constructor.name;
    switch (one) {
        case PLAYER:
            switch (two) {
                case PLAYER:
                    return circlesOverlap(arg1, arg2);
                case RECTANGLE:
                    return circRectOverlap(arg1, arg2);
                case BULLET:
                    return circlesOverlap(arg1, arg2);
            }
        case RECTANGLE:
            switch (two) {
                case PLAYER:
                    return circRectOverlap(arg2, arg1);
                case RECTANGLE:
                    return rectsOverlap(arg1, arg2);
                case BULLET:
                    return circRectOverlap(arg2, arg1);
                default:
                    throw new Error(`${one} can not collide with ${two}`);
            }
        case BULLET:
            switch (two) {
                case RECTANGLE:
                    return circRectOverlap(arg1, arg2);
                case PLAYER:
                    return circlesOverlap(arg1, arg2);
            }
        //default:
        //throw new Error(`Detector: Object ${one} an ${two} is not collideable!`);
    }
}

function resolveCollision(arg1, arg2) {
    const one = arg1.constructor.name;
    const two = arg2.constructor.name;
    switch (one) {
        case PLAYER:
            switch (two) {
                case PLAYER:
                    resolveCircleCircle(arg1, arg2);
                    break;
                case RECTANGLE:
                    resolveCircleRect(arg1, arg2);
                    break;
                case BULLET:
                    resolveBulletPlayer(arg2, arg1);
                    break;
                default:
                    throw new Error(`${one} can not collide with ${two}`);
            }
            break;
        case RECTANGLE:
            switch (two) {
                case PLAYER:
                    resolveCircleRect(arg2, arg1);
                    break;
                case RECTANGLE:
                    resolveRectRect(arg1, arg2);
                    break;
                case BULLET:
                    resolveBulletRect(arg2, arg1);
                    break;
                default:
                    throw new Error(`${one} can not collide with ${two}`);
            }
            break;
        case BULLET:
            switch (two) {
                case RECTANGLE:
                    resolveBulletRect(arg1, arg2);
                    break;
                case PLAYER:
                    resolveBulletPlayer(arg1, arg2);
                    break;
            }
            break;
        default:
            throw new Error(`Resolver: Object ${one} is not collideable!`);
    }

}

function resolveBulletPlayer(b, p) {
    b.isActive = false;
    p.health -= b.damage;
}

function resolveBulletRect(b, r) {
    b.isActive = false;
}

function resolveRectRect(r1, r2) {
    //console.log('Rects overlapping resolver');
    //throw new Error("Rectanlges collison resolver is not implemented!");
}

function resolveCircleRect(c, r) {
    const nrx = Math.max(r.x, Math.min(r.x + r.width, c.x));
    const nry = Math.max(r.y, Math.min(c.y, r.y + r.height));
    //distande between the nearest rectangle point and circle center
    const dist = { x: c.x - nrx, y: c.y - nry };
    const magnitude = Math.sqrt(dist.x ** 2 + dist.y ** 2);
    // normalize distance vector
    const distUnit = { x: dist.x / magnitude, y: dist.y / magnitude };
    //Since our rectangle is not moving its velocity is 0
    //Then relative velocity equals to circle velocity
    // Find the dot product of direction vector and relative velocity
    const tan = distUnit.x * c.vx + distUnit.y * c.vy;
    if (tan < 0) {
        c.vx -= 1.2 * tan * distUnit.x;
        c.vy -= 1.2 * tan * distUnit.y;
    }
    const penetDepth = c.r - magnitude;
    const penetVector = { x: distUnit.x * penetDepth, y: distUnit.y * penetDepth };
    c.x += penetVector.x;
    c.y += penetVector.y;

}

function resolveCircleCircle(c1, c2) {
    const vx = c2.x - c1.x;
    const vy = c2.y - c1.y;
    const norm = Math.sqrt(vx ** 2 + vy ** 2);
    const uvx = vx / norm;
    const uvy = vy / norm;

    const relv = { x: c1.vx - c2.vx, y: c1.vy - c2.vy }
    let speed = relv.x * uvx + relv.y * uvy;

    if (speed < 0) return;

    c1.vx -= speed * uvx;
    c1.vy -= speed * uvy;
    c2.vx += speed * uvx;
    c2.vy += speed * uvy;
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

module.exports = { collide, rectsOverlap };
