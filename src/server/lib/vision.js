/**
 * 
 * TODO: use Point class to create visionPolygonPointsList
 * Figure out how to get info about rectsList whitout passing it over as an argument
 * 
 */
import { calculateAngles } from './angles.js'
import { getClosestIntersection } from './intersect2.js'

import { Ray, Point, Segment } from './shapes.js'


export let createVision = function (rectsList) {
    // https://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjavascript
    let direction = null;
    let visibleAreaPolygon;
    let renderRaysList = [];

    let createSegmentsFromPoints = function (points) {
        /**
         * @param {Array} points
         */

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

    let createRaysFromPosToAngles = function (position, angles) {
        let rays = [];
        for (let a of angles) {
            let p1 = new Point(position.x, position.y);
            let p2 = new Point(position.x + Math.cos(a), position.y + Math.sin(a));
            let ray = new Ray(p1, p2);
            rays.push(ray);
        }
        return rays;
    };

    let createVisionField = function (position) {
        /**
         * Shuold pas all rectanlges points together so they can be sorted and then added to the list
         * otherwise its not possible to sort it
         */
        let intersections = []
        let rectPoints = [];
        let segments = [];
        // extract all points from rectangles
        for (let i = 0; i < rectsList.length; i++) {
            let p = rectsList[i].getPointsFromRectangle();

            segments = segments.concat(createSegmentsFromPoints(p));
            rectPoints = rectPoints.concat(p);
            //let rectAngles = createDirectionAnglesFromToPoints(position, rectPoints);
            //rectAngles = rectAngles.concat(calculateAngles(position, rectPoints));
        }

        // we have to pass all rectangles points
        let rectsAngles = calculateAngles(position, rectPoints, direction);
        rectsAngles = sortAngles(rectsAngles);

        let rays = createRaysFromPosToAngles(position, rectsAngles);
        //let segments = createSegmentsFromPoints(rectPoints);

        renderRaysList = [];
        for (let i = 0; i < rays.length; i++) {
            let c = getClosestIntersection(rays[i], segments);
            //TODO: figure out how to optimize it
            if (c) {
                intersections.push([c.x, c.y]);
                // only for debugging:
                renderRaysList.push([rays[i], c]);
            }
        }
        //make a polygon
        // add to the list player position coordinates (except it's 360 field view)
        // to properly connect polygon
        intersections.push([position.x, position.y]);
        //let vision = new Polygon(ctx, intersections);
        return intersections;
    };

    return {

        setDirection: function(newDirection) {
            direction = newDirection;
        },

        accept: function(visitor) {
            visitor.renderPolygon(visibleAreaPolygon);
        },

        update: function (center) {
            visibleAreaPolygon = createVisionField(center);
        },

        /*
        renderRays: function () {
            for (let i = 0; i < renderRaysList.length; i++) {
                renderRaysList[i][0].render(ctx, renderRaysList[i][1]);
            }
        },

        render: function (fill = true) {
            let colorAliceBlue = 'rgb(240,248,255)';
            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'rgb(0,255,0)';
            ctx.fillStyle = colorAliceBlue;
            ctx.beginPath();
            let [x, y] = visionFieldPoints[0];
            ctx.moveTo(x, y);
            for (let i = 1; i < visionFieldPoints.length; i++) {
                [x, y] = visionFieldPoints[i];
                ctx.lineTo(x, y);
                if (!fill) ctx.stroke();
            }
            [x, y] = visionFieldPoints[0];
            if (!fill) {
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.closePath();
            }
            if (fill) ctx.fill();
            ctx.restore();
        }
        */
    }
};