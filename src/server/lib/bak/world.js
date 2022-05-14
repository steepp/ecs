import { Rectangle } from './shapes.js'
import { FogOfWar } from './fog.js'



class AbstractWorld {

    constructor(boundary) {
        //this._ctx = ctx;
        this._boundary = boundary;
        this._items = [];
    }

    getItems() {
        return this._items;
    }

    getBoundary() {
        return this._boundary;
    }

    newItem() {
        throw new Error('Method `newItem()` must be implemented');
    }

    create(args = []) {
        for (let i = 0, j = args.length; i < j; i++) {
            this._items.push(this.newItem(args[i]));
        }
    }

    accept() {
        throw new Error('Must be implemented!');
    }

    /*
    render() {
        this._boundary.render();
        for (let i = 0; i < this._items.length; i++) {
            this._items[i].render();
        }
    } */

}


class WorldWithSquares extends AbstractWorld {

    newItem(arg = {}) {
        //if (arg.type !== 'rectangle') throw new Error('arg must be a rectangle!');
        //TODO: check if newly created item is in arena's boundary
        return new Rectangle(arg.x, arg.y, arg.width, arg.height);
    }

}

class WorldWithFog extends WorldWithSquares {
    constructor(boundary) {
        super(boundary);
        this._fogOfWar = new FogOfWar(this._items, subject);
    }

    enableFogOfWar(bool = true) {
        this._fogOfWar = new FogOfWar(this._items, subject);
        this._fogOfWar.isEnabled = bool;
        this._fogOfWar.update();
    }

    accept(visitor) {
        if (this._fogOfWar.isEnabled) this._fogOfWar.accept(visitor);
        this._boundary.accept(visitor);
        for (let i = 0, j = this._items.length; i < j; i++) {
            this._items[i].accept(visitor);
        }
    }

}

function borderRectDecorator(rect) {
    rect.lineWidth = 3;
    rect.strokeStyle = 'red';
    rect.fill = false;
    return rect;
}


export function provider() {
    let boundary = borderRectDecorator(new Rectangle(0, 0, 2000, 1000));
    //let world = new WorldWithFog(boundary);
    //world.enableFogOfWar(false);

    let rWorld = new WorldWithSquares(boundary);
    //rWorld.getItems();
    //rWorld.getBoundary();
    return rWorld;
}
