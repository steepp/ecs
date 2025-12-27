import { fps } from "./fps.js";

function youdied() {
        const element = document.getElementsByTagName("h1")[0];
        element.style.visibility = "visible";
}

export function getCanvasCtx() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        return ctx;
}

/*
        function debounce(time, func) {
                return () => setTimeout(func, time);
        }
        window.addEventListener("resize", debounce(1000, canvasResize));
*/

function canvasResize() {
        const scale = Math.max(1, 800 / window.innerWidth);
        canvas.width = scale * window.innerWidth;
        canvas.height = scale * window.innerHeight;
}

canvasResize();

window.addEventListener("resize", canvasResize);

const drawVisibleAreaAtop = addLayer(drawPolygon, "destination-atop");
//const drawPlayerOver = addLayer(drawPlayer, "destination-over");
//const drawPolygonOver = addLayer(drawPolygon, "destination-over");
const drawRectangleOver = addLayer(drawRectangle, "source-over");

function draw(data, delta) {
        if (!data.player) {
                throw new Error("no player");
        }
        const MAP_SIZE = data.arena;
        const rectangles = data.rectangles;

        //ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        //ctx.fillStyle = 'rgba(228, 241, 254, 1)';

        //ctx.fillStyle = 'rgba(46, 49, 49, 1)';
        //ctx.fillStyle = 'black';
        ctx.fillStyle = "#FFFAFF";

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(
                canvas.width / 2 - data.player.x,
                canvas.height / 2 - data.player.y,
        );

        // TODO: draw vision polygon
        if (data.player.vision) drawVisibleAreaAtop(data.player.vision);
        //if (data.player.vision) drawPolygon(data.player.vision);

        drawBackground(MAP_SIZE.width, MAP_SIZE.height);

        ctx.save();
        //ctx.globalCompositeOperation = "destination-over";
        //ctx.globalCompositeOperation = "source-atop";
        ctx.globalCompositeOperation = "source-atop";
        data.food.forEach((f) => drawFood(f));

        // Draw other players
        data.entities.forEach((element) => {
                drawEnemy(element);
        });

        data.bullets.forEach((b) => drawBullet(b));

        ctx.restore();

        drawPlayer(data.player);

        rectangles.forEach((p) => {
                drawRectangleOver(p);
        });

        ctx.restore();
        writeMessageOnCanvas(ctx, fps.getFrames(), 10, 25);
}

function writeMessageOnCanvas(ctx, message, x, y) {
        ctx.save();
        ctx.font = "13pt Calibri";
        ctx.fillStyle = "rgb(0,255,77)";
        ctx.fillText(message, x, y);
        ctx.restore();
}

function drawHealthBar(p) {
        ctx.save();
        const w = 40;
        const h = 3;
        const x = p.x - w / 2;
        const y = p.y + p.r + h;
        const wFill = (w * p.health) / 100;

        ctx.fillStyle = "green";
        ctx.fillRect(x, y, wFill, h);
        ctx.strokeStyle = "black";

        ctx.lineJoin = "round";
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
}

function drawBackground(width, height) {
        // Draw borders.
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(103, 128, 159, 1)";
        //ctx.strokeStyle = "blue";
        ctx.strokeRect(0, 0, width, height);
        ctx.restore();

        // Draw grid.
        let nr = 100;
        let n = Math.floor(width / nr);

        for (let i = 1; i < n; i++) {
                // vertical
                drawLine([i * nr, 0], [i * nr, height]);
        }
        let nh = Math.floor(height / nr);
        for (let i = 1; i < nh; i++) {
                // horizontal
                drawLine([0, i * nr], [width, i * nr]);
        }
}

function drawBullet(b) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI, true);

        ctx.fillStyle = "#FF7F7F"; // Neutral Grey
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#FF7F7F";

        ctx.fill();
        ctx.restore();
}

function drawLine(start, end) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        //ctx.strokeStyle = "rgba(197, 239, 247, 1)";
        ctx.strokeStyle = "rgba(191, 191, 191, .3)";
        ctx.beginPath();
        ctx.moveTo(...start);
        ctx.lineTo(...end);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
}

function drawPlayer(ctx, player) {
        ctx.save();
        //ctx.rotate(player.direction);
        //ctx.translate(player.x, player.y);
        ctx.beginPath();

        //ctx.fillStyle = "white";
        ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI, true);
        //drawCircle(ctx, player.x, player.y, player.r);
        ctx.shadowBlur = 10;
        //ctx.shadowColor = "#DEFFEF";    // green rainbow pastel
        ctx.shadowColor = "#FF7F7F";

        ctx.fillStyle = player.isColliding ? "rgb(138,7,7)" : "#FF7F7F";
        ctx.fill();
        drawHealthBar(player);
        ctx.restore();
}

/*function drawCircle(x, y, radius) {
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
}*/

function drawNickname(text, x, y) {
        ctx.save();
        ctx.font = "13px";
        ctx.fillStyle = "#5e644f";
        ctx.textAlign = "center";
        ctx.fillText(text, x, y);
        ctx.restore();
}

function drawEnemy(player) {
        drawPlayer(player, "cyan");
        drawNickname(player.nickname, player.x, player.y + player.r + 10);
}

function drawFood(f) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.beginPath();
        ctx.arc(0, 0, f.r, 0, 2 * Math.PI, true);

        // experiment with the shadows
        ctx.fillStyle = "#828382"; // Neutral Grey
        ctx.shadowBlur = 20;
        ctx.shadowColor = "blue";

        ctx.fill();
        ctx.restore();
}

function drawPolygon(points, fill = true) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(0,255,0)";
        //ctx.strokeStyle = "black";
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        let [x, y] = points[0];
        ctx.moveTo(x, y);
        for (let i = 1; i < points.length; i++) {
                [x, y] = points[i];
                ctx.lineTo(x, y);
        }
        [x, y] = points[0];
        ctx.lineTo(x, y);

        if (fill) ctx.fill();
        ctx.restore();
}

function addLayer(drawingFunc, compositeOperation) {
        function newDrawingFunction(args) {
                ctx.save();
                ctx.globalCompositeOperation = compositeOperation;
                drawingFunc(args);
                ctx.restore();
        }
        return newDrawingFunction;
}

function drawRectangle(r, fill = true) {
        ctx.save();
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#DCD6FF";
        ctx.fillStyle = "#DCD6FF"; // rainbow violet pastel
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#DCD6FF";
        if (fill) ctx.fillRect(r.x, r.y, r.width, r.height);
        ctx.restore();
}

class Renderable {
        constructor(ctx) {
                if (this.constructor == Renderable) {
                        throw new Error(
                                "Abstract classes can't be instantiated.",
                        );
                }
                this.ctx = ctx;
        }

        render() {
                throw new Error("Method 'render()' must be implemented.");
        }
}

export class Renderer extends Renderable {
        drawRectangle(r) {
                addLayer(() => drawRectangle(r), "source-over");
        }

        drawPlayer(player) {
                drawPlayer(this.ctx, player);
        }
}
