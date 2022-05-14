import { Point, Rectangle } from './polygons.js'


// Axis-aligned bounding box with half dimension and center
class AABB extends Rectangle {
    containsPoint(point) {
        if (point.x >= this.x && point.y >= this.y) {
            if (point.x <= this.x + this.width && point.y <= this.y + this.height) return true;
        }
        return false;
    }

    intersectsAABB(other) {
        /**
         * @param {AABB} other
         */
        if ((other.x > (this.x + this.width)) || (this.x > (other.x + other.width))) return false;
        if ((other.y > (this.y + this.height)) || (this.y > (other.y + other.height))) return false;
        return true
    }
}

export class QuadTree {
    constructor(boundary) {
        /**
         * @param AABB boundary
         */
        this.QT_NODE_CAPACITY = 1;
        this.points = [];
        this.boundary = boundary;

        this.northWest;
        this.northEast;
        this.southWest;
        this.southEast;
    }

    insert(p) {
        /**
         * Insert a point into the QuadTree
         * @param Point p
         */
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsPoint(p)) return false; // object cannot be added
        // If there is space in this quad tree and if doesn't have subdivisions, add the object here
        if (this.points.length < this.QT_NODE_CAPACITY && this.northWest == null) {
            this.points.push(p);
            return true;
        }
        // Otherwise, subdivide and then add the point to whichever node will accept it
        if (this.northWest == null) this.subdivide();
        //We have to add the points/data contained into this quad array to the new quads if we only want 
        //the last node to hold the data 
        if (this.northWest.insert(p)) return true;
        if (this.northEast.insert(p)) return true;
        if (this.southWest.insert(p)) return true;
        if (this.southEast.insert(p)) return true;
        // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
        return false;
    }

    subdivide() {
        let width = this.boundary.width / 2;
        let height = this.boundary.height / 2;
        let x = this.boundary.x;
        let y = this.boundary.y;

        this.northEast = new QuadTree(new AABB(0, width, y, width + x, height + y));
        this.northWest = new QuadTree(new AABB(0, x, y, width, height));
        this.southWest = new QuadTree(new AABB(0, x, height, width, height + y));
        this.southEast = new QuadTree(new AABB(0, width, height, width + x, height + y));
    }

    queryRange(range) {
        /**
         * Find all points that appear within a range
         * @param AABB range
         */
        let pointsInRange = [];
        // Automatically abort if the range does not intersect this quad
        if (!this.boundary.intersectsAABB(range)) return pointsInRange; // empty list
        // Check objects at this quad level
        for (let p = 0; p < this.points.length; p++) {
            if (range.containsPoint(this.points[p])) {
                pointsInRange.push(this.points[p]);
            }
        }
        // Terminate here, if there are no children
        if (this.northWest == null) return pointsInRange;
        // Otherwise, add the points from the children
        pointsInRange = pointsInRange.concat(this.northEast.queryRange(range));
        pointsInRange = pointsInRange.concat(this.northWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southEast.queryRange(range));
        return pointsInRange;
    }
}
