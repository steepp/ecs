export class measureFPS {
    constructor() {
        this.lastTime;
        this.fps;
        this.frameCount = 0;
    }

    getFrames() {
        return this.fps;
    }

    countFrames(newTime) {
        if (this.lastTime === undefined) {
            this.lastTime = newTime;
            return;
        }
        let diffTime = newTime - this.lastTime;
        if (diffTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = newTime;
        }
        this.frameCount++;
    }
}

export function writeMessageOnCanvas(ctx, message, x, y) {
    ctx.save();
    ctx.font = '13pt Calibri';
    ctx.fillStyle = 'rgb(0,255,77)';
    ctx.fillText(message, x, y);
    ctx.restore();
}