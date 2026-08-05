import { fps } from "./fps.js";
import { getControls } from "./controls.js";
import { SocketNetwork } from "./network.js";
import {
        getEstimatedServerTime,
        SnapshotBuffer,
        updateClientServerTime,
} from "./game.js";
import { drawBackground, drawPlayer, writeMessageOnCanvas } from "./render.js";

const gsbuffer = new SnapshotBuffer(10);
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
let m = performance.now();
let counter = 0;        // frames counter
let m = performance.now();
let requestId = null;

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        dt = currentTime - lastTime;    // milliseconds passed between the frames
        lastTime = currentTime;

        dtAcc += dt;

        if (dtAcc >= 100) {             // handle tab sleep when the time dt between frames is big
                dtAcc = serverTickRate;
        }

        if (dtAcc >= serverTickRate) { // send changes at fixed serverTickRate

                // diagnostics. the rate at which keys are being sent.
                if (DEBUG && currentTime >= m + 1000) {
                        console.log(counter);   // The rate.
                        counter = 0;
                        m = currentTime;
                }
                counter += 1;

                network.sendInput(getControls());
                dtAcc = 1; // dt fluctuates between 16-17
        }

        drawBackground(1000, 1000);

        const { data } = gsbuffer.__read();
        const l = data.length;
        if (data.t === getEstimatedServerTime()) {}
        for (let i = 0; i < l; i++) {
                upsertEntity(data[i]);
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

function upsertEntity(r) {
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

function addEntity(r) {
        idToIdx[r.id] = lastIndex;
        ids[lastIndex] = r.id;
        xs[lastIndex] = r.x;
        ys[lastIndex] = r.y;
        colors[lastIndex] = r.color;
        lastIndex++;
}

(() => {
        network.onDisconnect(() => {
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
