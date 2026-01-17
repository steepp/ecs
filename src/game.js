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
