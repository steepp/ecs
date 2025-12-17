export class ItemContainer {
        #items = [];

        #lastIndex() {
                return this.#items.length - 1;
        }

        #checkRange(index) {
                if (index < 0 || index >= this.#items.length) {
                        throw new RangeError(`Index ${index} out of range.`);
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

export class ComponentMultiArray {
        constructor() {
                this.lastIndex = 0;
                this.componentToIndex = {};
                this.multiarr = [];
                this.components = [];
        }

        add(componentName) {
                this.componentToIndex[componentName] = this.lastIndex;
                this.components.push(componentName);

                this.multiarr.push(new ItemContainer());

                this.lastIndex++;
        }

        removeComponent(componentName) {
                const offset = this.componentToIndex[componentName];
                this.multiarr[offset] = this.multiarr[this.lastIndex];
                this.multiarr.pop();

                this.components[offset] = this.components[this.lastIndex];
                this.components.pop();

                this.lastIndex--;
        }

        updateComponentValueAtIndex(componentName, idx, val) {
                const compOffset = this.componentToIndex[componentName];
                this.multiarr[compOffset].updateVal(idx, val);
        }

        removeIndexValueInAllComponents(idx) {
                this.multiarr.forEach((c) => c.removeVal(idx));
        }
}
