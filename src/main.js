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
let _idx = null;

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        delta = (currentTime - oldTime) / 1000; // time in seconds
        oldTime = currentTime;

        drawBackground(1000, 1000);
        writeMessageOnCanvas(fps.getFrames(), 10, 25);

        for (let i of ids) {
                _idx = idToIdx[i];
                drawPlayer(xs[_idx], ys[_idx]);
        }

        requestId = requestAnimationFrame(mainLoop);
}

function startAnimationFrame() {
        requestId = requestAnimationFrame(mainLoop);
}

function stopAnimationFrame() {
        if (requestId) cancelAnimationFrame(requestId);
}

function dismember(r) {
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
                snapshot.data.map(dismember);

                intervalID = setInterval(() => {
                        network.sendInput(getControls());
                }, 1000 / 30);

                startAnimationFrame();
        });
})();
