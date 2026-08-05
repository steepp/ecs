export class SnapshotBuffer {
        constructor(s) {
                if (s <= 0 || !Number.isInteger(s)) {
                        throw new Error("Buffer size must be positive integer");
                }
                this.bufferSize = s;
                this.buffer = [];
                this.writeIndex = 0;
                this.readIndex = 0;
                this.count = 0;
        }

        isEmpty() {
                return this.count === 0;
        }

        read() {
                if (this.count === 0) {
                        throw new Error("Buffer is empty");
                }
                const val = this.buffer[this.readIndex];
                this.readIndex = (this.readIndex + 1) % this.bufferSize;
                this.count--;
                return val;
        }

        write(val) {
                if (this.count === this.bufferSize) {
                        throw new Error("Buffer is full");
                }
                this.buffer[this.writeIndex] = val;
                this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
                this.count++;
        }
}

let serverTime,
        clientTime = null;

export function updateClientServerTime(t) {
        serverTime = t;
        clientTime = Date.now();
}

export function getEstimatedServerTime() {
        return serverTime + (Date.now() - clientTime);
}

const idToIdx = {};
const ids = [];
export const xs = [];
export const ys = [];
export const colors = [];
let lastIndex = 0;

export function upsertEntity(r) {
        if (idToIdx[r.id]) {
                updateEntity(r)
        } else {
                addEntity(r);
        }
}

function updateEntity(r) {
        const idx = idToIdx[r.id];
        if (idx !== undefined) {
                xs[idx] = r.x;
                ys[idx] = r.y;
                colors[idx] = r.color;
        }
}

export function addEntity(r) {
        /**
         * Note: If the entity exists, this will overwrite its data!
         */
        idToIdx[r.id] = lastIndex;
        ids[lastIndex] = r.id;
        xs[lastIndex] = r.x;
        ys[lastIndex] = r.y;
        colors[lastIndex] = r.color;
        lastIndex++;
}