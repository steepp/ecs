
const calculateAngles  = require('./angles.js');
const getClosestIntersection  = require('./intersect2.js');
const { Ray, Point, Segment } = require('./shapes.js');


let FogOfWar = function (staticObjects, subject) {
    //let subjectViewDirection = null;
    let visibleArea = null;

    let createSegmentsFromPoints = function (points) {
        let segmentsList = [];
        let length = points.length;
        //go from the first to one before the last
        for (let i = 0; i < length - 1; i++) {
            segmentsList.push(new Segment(points[i], points[i + 1]));
        }
        //make the last segment
        segmentsList.push(new Segment(points[0], points[length - 1]));
        return segmentsList;
    };

    let sortAngles = function (angles) {
        // weird fix to get around 0, 360 degree problem
        let last = angles[angles.length - 1];
        if (typeof (last) == 'object') {
            let special = angles.pop();
            special.sort(function (a, b) { return b - a });

            angles.sort(function (a, b) { return b - a });

            special = special.concat(angles);
            angles = special;
        } else angles.sort(function (a, b) { return b - a });

        return angles;
    };

    let createRaysFromPosToAngles = function (position, angles=[]) {
        let rays = [];
        for (let a of angles) {
            let p1 = new Point(position.x, position.y);
            let p2 = new Point(position.x + Math.cos(a), position.y + Math.sin(a));
            let ray = new Ray(p1, p2);
            rays.push(ray);
        }
        return rays;
    };

    let createVisibleArea = function () {

        let intersections = []
        let rectPoints = [];
        let segments = [];

        for (let i = 0; i < staticObjects.length; i++) {
            let p = staticObjects[i].getPointsFromRectangle();

            segments = segments.concat(createSegmentsFromPoints(p));
            rectPoints = rectPoints.concat(p);
        }

        //TODO: Use subject.direction inside the function, don't pass it like a parameter?
        let rectsAngles = calculateAngles(subject, rectPoints, subject.direction);
        rectsAngles = sortAngles(rectsAngles);

        let rays = createRaysFromPosToAngles(subject, rectsAngles);

        for (let i = 0; i < rays.length; i++) {
            let c = getClosestIntersection(rays[i], segments);
            //TODO: figure out how to optimize it
            if (c) intersections.push([c.x, c.y]);
        }
        intersections.push([subject.x, subject.y]);
        return intersections;
    };

    return {
        isEnabled: false,
        accept: function(visitor) {
            visitor.visitPolygon(visibleArea);
        },
        update: function () {
            //if (this.isEnabled) visibleArea = createVisibleArea();
            visibleArea = createVisibleArea();
        },
        getVisibleArea: function () {
            return visibleArea;
        },
  }
};

module.exports = FogOfWar;
