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

export class ComponentMultiArray extends ComponentArray {
        constructor() {
                super();
                this.lastIndex = 0;
                this.mapp = {};
                this.multiarr = [];
        }

        add(componentName) {
                this.mapp[componentName] = this.lastIndex;
                super.addVal(new ComponentArray());

                this.multiarr.push(componentName);

                this.lastIndex++;
        }

        updateComponentValueAtIndex(componentName, idx, val) {
                const compOffset = this.mapp[componentName];
                super.getVal(compOffset).updateVal(idx, val);
                //this.multiarr[compOffset].updateVal(idx, val);
        }

        removeIndexValueInAllComponents(idx) {
                this.multiarr.forEach((c) => c.removeVal(idx));
                this.lastIndex--;
        }
}
