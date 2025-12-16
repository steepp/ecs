export class ComponentArray {
        #items = [];

        add(val) {
                this.#items.push(val);
        }

        get(index) {
                return this.#items[index];
        }

        set(index, val) {
                this.#items[index] = val;
        }

        #lastIndex() {
                return this.#items.length - 1;
        }

        remove(idx) {
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

                this.multiarr.push(new ComponentArray());

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
