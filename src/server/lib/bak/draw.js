class AbstractVisitor {

	visitPlayer(element) {
		throw new Error('must be implemented');
	}

	visitWeapon(element) {
		throw new Error('must be implemented');
	}
}

export class DrawVisitor extends AbstractVisitor {
	constructor(ctx) {
		this._ctx = ctx;
	}

	visitPlayer(player) {
		//TODO: 
		drawCircle(this._ctx, player);
	}

	visitPolygon(element) {
		drawPolygon(this._ctx, element);
	}

	visitRectangle(element) {
		//TODO:
		drawRectangle(this._ctx, element);
	}

	visitFood(element) {
		drawFood(this._ctx, element);
	}
}

export class LayersFactory {
	constructor(ctx) {
		this._ctx = ctx;
	}

	makeBottomLayer() {
		return new CompositeLayer(this._ctx, 'source-over');
	}

	makeFogLayer() {
		return new CompositeLayer(this._ctx, 'destination-atop');
	}

	makeTopLayer() {
		return new CompositeLayer(this._ctx, 'destination-over');
	}
}

export class Renderer {
	constructor() {
		this._layers = [];
	}

	run() {
		for (let i = 0, j = this._layers.length; i < j; i++) {
			this._layers[i].renderItems();
		}
	}

	addLayers(layer) {
		/**
		 * @param {Layer} layer
		 */
		if (layer instanceof Array) {
			for (let i = 0, j = layer.length; i < j; i++) {
				this._layers.push(layer[i]);
			}
		} else {
			this._layers.push(layer);
		}
	}

}

class CompositeLayer {

	constructor(ctx, compositeOperation) {
		/**
		 * @param {CanvasRenderingContext2D} ctx
		 */
		this._ctx = ctx;
		this._items = [];
		this._composOperation = compositeOperation;
		this._visitor = null;
	}

	getItems() {
		return this._items;
	}

	addItem(item) {
		this._items.push(item);
	}

	addItems(...items) {
		for (let i = 0, j = items.length; i < j; i++) {
			this.addItem(items[i]);
		}
	}

	renderItem(item) {
		item.accept(this._visitor);
	}

	renderItems() {
		this._ctx.save();
		if (this._composOperation) this._ctx.globalCompositeOperation = this._composOperation;
		for (let i = 0, j = this._items.length; i < j; i++) {
			this.renderItem(this._items[i]);
		}
		this._ctx.restore();
	}

	setRenderingVisitor(visitor) {
		//throw new Error('must be implemented');
		this._visitor = visitor;
	}

	setNewSize(width, height) {
		this._ctx.canvas.width = width;
		this._ctx.canvas.height = height;
	}
}

