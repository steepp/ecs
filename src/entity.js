class AbstractEntity {}

export class Entity extends AbstractEntity {
        constructor(id) {
                super();
                this.id = id;
        }

        acceptRenderVisitor(visitor, entityContext) {
                let requiredAttrs = Object.assign(
                        {},
                        entityContext.get(this.id, Position),
                );
                Object.assign(
                        requiredAttrs,
                        entityContext.get(this.id, Radius),
                );
                Object.assign(requiredAttrs, entityContext.get(this.id, Color));
                visitor.renderPlayer(requiredAttrs);
        }
}

export class Rectangle {
        constructor(arg) {
                this.x = arg.x;
                this.y = arg.y;
                this.width = arg.width;
                this.height = arg.height;
        }

        acceptRenderVisitor(visitor) {
                visitor.renderPolygon(this);
        }
}

export class Radius {
        constructor(r) {
                this.r = r;
        }
        update(r) {
                this.r = r;
        }
}

class UpdateHandler {
        constructor(succ) {
                this.successor = succ;
        }
        handleUpdate(args) {
                if (this.successor) {
                        this.successor.handleUpdate(args);
                }
        }
}

class UpdateRequest {}
class UpdateColorRequest {}
class UpdatePositionRequest {}

export class Color extends UpdateHandler {
        constructor(color) {
                super();
                this.c = color;
        }

        setColor(c) {
                this.c = c;
        }

        handleUpdate(requestObj) {
                if (Object.hasOwn(requestObj, "color")) {
                        this.setColor(requestObj.color);
                }
                super.handleUpdate(requestObj);
        }
}

export class Position extends UpdateHandler {
        constructor(x, y) {
                super();
                this.x = x;
                this.y = y;
                this.interpolator = null;
        }

        handleUpdate(requestObj) {
                if (Object.hasOwn(requestObj, "x")) {
                        this.x = requestObj.x;
                }
                if (Object.hasOwn(requestObj, "y")) {
                        this.y = requestObj.y;
                }
                super.handleUpdate(requestObj);
        }

        interpolatePosition(pos2, alpha) {
                const x = this.linear(this.x, pos2.x, alpha);
                const y = this.linear(this.y, pos2.y, alpha);
                return new Position(x, y);
        }
}
