import { fps } from "./fps.js";

function writeMessageOnCanvas(ctx, message, x, y) {
        ctx.save();
        ctx.font = "13pt Calibri";
        ctx.fillStyle = "rgb(251, 0, 0)";
        ctx.fillText(message, x, y);
        ctx.restore();
}

function drawBackground(width, height) {
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(0, 115, 255)";
        ctx.strokeRect(0, 0, width, height);
        ctx.restore();

        // the grid
        let nr = 100;
        let n = Math.floor(width / nr);

        for (let i = 1; i < n; i++) {
                // vertical bars
                drawLine([i * nr, 0], [i * nr, height]);
        }
        let nh = Math.floor(height / nr);
        for (let i = 1; i < nh; i++) {
                // horizontal bars
                drawLine([0, i * nr], [width, i * nr]);
        }
}

function drawBullet(b) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI, true);

        ctx.fillStyle = "#FF7F7F";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#FF7F7F";

        ctx.fill();
        ctx.restore();
}

function drawLine(start, end) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(191, 191, 191, .3)";
        ctx.beginPath();
        ctx.moveTo(...start);
        ctx.lineTo(...end);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
}

function drawPlayer(player) {
        ctx.save();
        ctx.beginPath();

        ctx.arc(player.x, player.y, player.r || 25, 0, 2 * Math.PI, true);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#000000";

        ctx.fillStyle = player.isColliding
                ? "rgb(138,7,7)"
                : player.color || "#0000FF";
        ctx.fill();
        ctx.restore();
}

function drawNickname(text, x, y) {
        ctx.save();
        ctx.font = "13px";
        ctx.fillStyle = "#5e644f";
        ctx.textAlign = "center";
        ctx.fillText(text, x, y);
        ctx.restore();
}

function canvasResize() {
        const scale = Math.max(1, 800 / window.innerWidth);
        canvas.width = scale * window.innerWidth;
        canvas.height = scale * window.innerHeight;
}

export function getCanvasCtx() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        return ctx;
}

export function draw(data, _delta) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBackground(MAP_SIZE.width, MAP_SIZE.height);

        data.forEach(drawPlayer);

        writeMessageOnCanvas(ctx, fps.getFrames(), 10, 25);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const MAP_SIZE = { width: 1000, height: 1000 };

window.addEventListener("resize", canvasResize);
canvasResize();
