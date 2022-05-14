import { Point } from './polygons.js'

function checkColinearity(ray, seg) {
    let det = (seg.p1.x - ray.p1.x) * ray.direction.y - ray.direction.x * (seg.p2.y - ray.p2.y);
    if (det == 0) return true;
    return false;
}

function calculateIntersectionCramersMethod(ray, segment) {
    let t1, t2;

    if (checkColinearity(ray, segment)) return null;

    const del = ray.direction.x * segment.direction.y - segment.direction.x * ray.direction.y;
    const delT1 = ray.direction.x * segment.direction.y - segment.direction.x * ray.direction.y;
    const delT2 = ray.direction.x * segment.direction.x - segment.direction.x * ray.direction.x;

    //TO-DO: Raise an error if delete by 0
    t1 = delT1 / del;
    t2 = delT2 / del;

    if (0 > t1) return null;
    if (0 > t2 || t2 > 1) return null;

    let x = ray.p1.x + ray.direction.x * t1;
    let y = ray.p1.y + ray.direction.y * t1;

    return new Point(x, y);
}

function calculateAllIntersections(ray, segments) {
    let intersections = [];
    let intersectionPoint;
    for (let i = 0; i < segments.length; i++) {
        intersectionPoint = calculateIntersectionCramersMethod(ray, segments[i]);
        if (intersectionPoint) intersections.push(intersectionPoint);
    }
    return intersections;
}

function calculateDistanceBetweenPoints(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}

function findClosestPoint(origin, points) {
    let closestPoint;
    let closestDistance, newDistance;
    for (let p of points) {
        newDistance = calculateDistanceBetweenPoints(origin, p);
        if (!closestDistance) closestDistance = newDistance;
        if (newDistance < closestDistance) {
            closestDistance = newDistance;
            closestPoint = p;
        }
    }
    return closestPoint;
}

export function findUsingCramers(ray, segments){
		let intersects = calculateAllIntersections(ray, segments);
		let closest = findClosestPoint(ray.p1, intersects);
		return closest;
}