export class Component {
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
                this.componentsMultiArray = [];
        }

        add(comp) {
                this.componentToIndex[comp] = this.lastIndex;
                this.componentsMultiArray.push(new Component());
                this.lastIndex++;
        }

        getComponent(component) {
                return this.componentsMultiArray[
                        this.componentToIndex[component]
                ];
        }

        updateComponent(id, comp, val) {
                const idx = this.entityToIndex[id];
                this.getComponent(comp).update(idx, val);
        }

        removeComponentValues(removeIndex) {
                this.componentsMultiArray.forEach((c) =>
                        c.removeValAt(removeIndex),
                );
        }
}
