export class ComponentContainer {
        #items = [];

        #lastIndex() {
                return this.#items.length - 1;
        }

        #checkRange(index) {
                if (index < 0 || index >= this.#items.length) {
                        throw new RangeError(`Index ${index} out of range`);
                }
        }

        add(val) {
                this.#items.push(val);
        }

        get(idx) {
                this.#checkRange(idx);
                return this.#items[idx];
        }

        set(idx, val) {
                this.#checkRange(idx);
                this.#items[idx] = val;
        }

        remove(idx) {
                this.#checkRange(idx);
                this.#items[idx] = this.#items[this.#lastIndex()];
                this.#items.pop();
        }
}

class Index {
        constructor() {
                this.lastIndex = 0;
                this.itemToIndex = {};
        }

        add(key = "") {
                this.itemToIndex[key] = this.lastIndex;
                this.lastIndex++;
        }

        drop(key = "") {
                const idx = this.itemToIndex[key];
                delete this.itemToIndex[key];
                this.lastIndex--;
                return idx;
        }

        getNext() {
                return this.lastIndex;
        }

        getIndex(item) {
                return this.itemToIndex[item];
        }
}

function checkIndexRange(arr, idx) {
        if (idx < 0 || idx >= arr.length) {
                throw new RangeError(`Index out of range`);
        }
}

function swapRemove(arr, idx) {
        arr[idx] = arr[arr.length - 1];
        arr.pop();
        return arr;
}

export class MultiArray {
        constructor() {
                this.multiarr = [];
        }

        get(row, col) {
                return this.multiarr[row][col];
        }

        set(row, col, val) {
                this.multiarr[row][col] = val;
        }

        addRow() {
                this.multiarr.push([]);
        }

        getRow(idx) {
                checkIndexRange(this.multiarr, idx);
                return this.multiarr[idx];
        }

        deleteRow(idx) {
                checkIndexRange(this.multiarr, idx);
                swapRemove(this.multiarr, idx);
        }

        deleteColumn(idx) {
                checkIndexRange(this.multiarr[0], idx);
                this.multiarr.forEach((arr) => swapRemove(arr, idx));
        }
}

export class EntityComponentMultiArray extends MultiArray {
        constructor() {
                super();
                this.componentIndex = new Index();
        }

        addComponent(name) {
                this.componentIndex.add(name);
                this.addRow();
        }

        deleteComponent(name) {
                const offset = this.componentIndex.drop(name);
                this.deleteRow(offset);
        }

        getComponent(componentContainer) {
                this.getRow(this.componentIndex.get(componentContainer));
        }
}
