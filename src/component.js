export class ComponentArray {
        #arr = [];

        addVal(val) {
                this.#arr.push(val);
        }

        getVal(index) {
                return this.#arr[index];
        }

        updateVal(index, val) {
                this.#arr[index] = val;
        }

        #lastIndex() {
                return this.#arr.length - 1;
        }

        removeVal(removeIndex) {
                this.#arr[removeIndex] = this.#arr[this.#lastIndex()];
                this.#arr.pop();
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
