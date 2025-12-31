import { Entity } from "./entity.js";
import { EntityComponentMultiArray } from "./component.js";

/* eslint-disable no-unused-vars */

export const last = (xs) => xs[xs.length - 1];

export class SnapshotRepository extends Map {
        constructor(...args) {
                if (args && args > 0) {
                        throw new Error("Use `set` method to add entries.");
                }
                super();
        }

        set(k, v) {
                return super.set(k, v);
        }

        getFirstKey() {
                return Array.from(this.keys())[0];
        }

        getLastKey() {
                return last(Array.from(this.keys()));
        }

        getLatestSnapshot() {
                const k = this.getLastKey();
                return this.get(k);
        }

        /**
         * Truncate the map to fixed SIZE items.
         */
        truncate() {
                const limit = 15;
                if (this.size / limit !== 1) {
                        // TODO: keep only 15 items
                }

                const count = this.size() - limit;
                if (count <= 0) {
                        return false;
                }
                const delCount = count > 0 ? delCount : 0;

                const keys = Array.from(this.keys());
                const keysToDel = keys.splice(0, delCount);
                // remove first delCount items
                keysToDel.forEach((k) => this.delete(k));
                return true;
        }
}

let serverTime,
        clientTime = null;

function setServerTime(t) {
        serverTime = t;
}

function setClientTime() {
        clientTime = Date.now();
}

export function updateClientServerTime(t) {
        setServerTime(t);
        setClientTime();
}

export function getEstimatedServerTime() {
        return serverTime + (Date.now() - clientTime);
}

class AbstractComponent extends Map {}

class ComponentsMap extends AbstractComponent {}

export class EntityContext extends Map {
        add(entityId) {
                this.set(entityId, new ComponentsMap());
        }

        update(entityId, updReq) {
                const cs = super.get(entityId);
                const c = cs.get(updReq.constructor);
                if (!c) {
                        this.set(entityId, updReq);
                        return;
                }
                c.handleUpdate(updReq);
        }

        set(entityId, component) {
                let _ = super.get(entityId);
                _.set(component.constructor, component);
        }

        get(entityId, component) {
                const comp = super.get(entityId).get(component);
                if (!comp) {
                        this.set(entityId, new component());
                }
                return super.get(entityId).get(component);
        }

        delete(entityId, component) {
                if (!component) {
                        super.delete(entityId);
                }
                const entityComponents = super.get(entityId);
                entityComponents.delete(component);
        }
}

function applyFuncAttrs(obj1 = {}, obj2 = {}, interpFunc) {
        let res = {};

        attrs.forEach((attr) => {
                res[attr] = interpFunc(obj1[attr], obj2[attr], alpha);
        });

        return res;
}

/**
 * This acts as a factory and cache for Entity flyweight objects.
 */
export class EntityFactory {
        static createEntity(id) {
                return;
        }
}
