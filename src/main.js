import { fps } from "./fps.js";
import { getControls } from "./controls.js";
import { SocketNetwork } from "./network.js";
import { SnapshotBuffer, updateClientServerTime } from "./game.js";
import { drawBackground, drawPlayer, writeMessageOnCanvas } from "./render.js";
const gsbuffer = new SnapshotBuffer(200);
const network = new SocketNetwork();

const idToIdx = {};
const ids = [];
const xs = [];
const ys = [];
const colors = [];
const serverTickRate = 1000 / 30;

let dt = 0;
let lastTime = 0;
let requestId = null;
let lastIndex = 0;
let dtAcc = 0;

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        dt = currentTime - lastTime;
        lastTime = currentTime;

        dtAcc += dt;

        if (dtAcc >= 100) { // handle tab sleep
                dtAcc = serverTickRate;
        }

        if (dtAcc >= serverTickRate) { // send only changes at fixed `serverTickRate` rate

                network.sendInput(getControls());
                dtAcc = 1; // dt fluctuates between 16-17
        }

        drawBackground(1000, 1000);

        if (!gsbuffer.isEmpty()) {
                const gs = gsbuffer.read();
                gs.data.forEach(updateEntity);
        }

        for (let i in xs) {
                drawPlayer(xs[i], ys[i], { "color": colors[i] });
        }

        writeMessageOnCanvas(fps.getFrames(), 10, 25);

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
                stopAnimationFrame();
                network.socket.disconnect();
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
                startAnimationFrame();
        });
})();
