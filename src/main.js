import { fps } from "./fps.js";
import { draw } from "./render.js";
import { SocketNetwork } from "./network.js";
import { getControls } from "./controls.js";
import {
        updateClientServerTime,
        getEstimatedServerTime,
        SnapshotBuffer,
} from "./game.js";

let delta = 0;
let oldTime = 0;
let requestId = null;
let intervalID = null;

const snapshots = new SnapshotBuffer(200);
const network = new SocketNetwork();

let tmp;

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        delta = (currentTime - oldTime) / 1000; // time in seconds
        oldTime = currentTime;

        try {
                if (snapshots.count > 0) {
                        tmp = snapshots.read()["data"];
                }
        } catch (err) {
                console.log(err);
        }

        draw(tmp || [], delta);

        requestId = requestAnimationFrame(mainLoop);
}

/**
 * The frequency of calls to the callback function will generally
 * match the display refresh rate. `requestAnimationFrame()` calls
 * are paused in most browsers when running in background tabs or
 * hidden <iframe>s, in order to improve performance and battery life.
 */
function startAnimationFrame() {
        requestId = requestAnimationFrame(mainLoop);
}

function stopAnimationFrame() {
        if (requestId) cancelAnimationFrame(requestId);
}

/**
 * Start the game loop.
 */
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
