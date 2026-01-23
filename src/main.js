import { fps } from "./fps.js";
import { getControls } from "./controls.js";
import { SocketNetwork } from "./network.js";
import { SnapshotBuffer, updateClientServerTime } from "./game.js";
import { drawBackground, drawPlayer, writeMessageOnCanvas } from "./render.js";

const gsbuffer = new SnapshotBuffer(200);
const network = new SocketNetwork();

let delta = 0;
let oldTime = 0;
let requestId = null;
let intervalID = null;

const idToIdx = {};
const ids = [];
const xs = [];
const ys = [];
const colors = [];

let lastIndex = 0;

function mainLoop(currentTime) {
        fps.countFrames(currentTime);
        writeMessageOnCanvas(fps.getFrames(), 10, 25);

        delta = (currentTime - oldTime) / 1000; // time in seconds
        oldTime = currentTime;

        drawBackground(1000, 1000);

        if (!gsbuffer.isEmpty()) {
                const gs = gsbuffer.read();
                gs.data.forEach(updateEntity);
        }

        for (let i in xs) {
                drawPlayer(xs[i], ys[i], { "color": colors[i] });
        }

        requestId = requestAnimationFrame(mainLoop);
}

function startAnimationFrame() {
        requestId = requestAnimationFrame(mainLoop);
}

function stopAnimationFrame() {
        if (requestId) cancelAnimationFrame(requestId);
}

function updateEntity(r) {
        const idx = idToIdx[r.id];
        if (idx !== undefined) {
                xs[idx] = r.x;
                ys[idx] = r.y;
                colors[idx] = r.color;
        } else {
                addEntity(r);
        }
}

function addEntity(r) {
        idToIdx[r.id] = lastIndex;
        ids[lastIndex] = r.id;
        xs[lastIndex] = r.x;
        ys[lastIndex] = r.y;
        colors[lastIndex] = r.color;
        lastIndex++;
}

(() => {
        network.onDisconect(() => {
                console.log("Disconnected from server");
                clearInterval(intervalID);
                stopAnimationFrame();
        });

        network.onMessage((snapshot) => {
                updateClientServerTime(snapshot?.t);
                gsbuffer.write(snapshot);
        });

        const nickName = "Romulus_" + new Date().toJSON();

        network.connect(nickName, (snapshot) => {
                updateClientServerTime(snapshot?.t);
                gsbuffer.write(snapshot);
                snapshot.data.map(addEntity);

                intervalID = setInterval(() => {
                        network.sendInput(getControls());
                }, 1000 / 30);

                startAnimationFrame();
        });
})();
