import { fps } from "./fps.js";
import { draw } from "./render.js";
import { SocketNetwork } from "./network.js";
import { getControls } from "./controls.js";
import { updateClientServerTime, SnapshotBuffer } from "./game.js";

let delta = 0;
let oldTime = 0;
let requestId = null;
let intervalID = null;

const snapshots = new SnapshotBuffer(200);
const network = new SocketNetwork();

let tmp = [];

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        delta = (currentTime - oldTime) / 1000; // time in seconds
        oldTime = currentTime;

        if (snapshots.count > 0) {
                tmp = snapshots.read()["data"];
        }

        draw(tmp, delta);

        requestId = requestAnimationFrame(mainLoop);
}

function startAnimationFrame() {
        requestId = requestAnimationFrame(mainLoop);
}

function stopAnimationFrame() {
        if (requestId) cancelAnimationFrame(requestId);
}

function startRenderLoop() {
        const delay = 1000 / 30;
        intervalID = setInterval(() => {
                const userKeys = getControls();
                network.sendInput(userKeys);
        }, delay);
        startAnimationFrame();
}

(() => {
        network.onDisconect(() => {
                console.log("Disconnected from server.");
                clearInterval(intervalID);
                stopAnimationFrame();
        });

        network.onMessage((snapshot) => {
                updateClientServerTime(snapshot?.t || Date.now());
                snapshots.write(snapshot);
        });

        const onConnect = (snapshot) => {
                const serverTime = snapshot?.t || Date.now();
                updateClientServerTime(serverTime);
                snapshots.write(snapshot);
                startRenderLoop();
        };
        const nickName = "Romulus_" + new Date().toJSON();
        network.connect(nickName, onConnect);
})();
