import { prop, last, compose } from "./support.js"
import { measureFPS } from "./misc.js";
import { draw } from "./render.js";
import { input } from "./input.js";

let requestId;
let delta = 0;
let oldTime = 0;

let gameBuffer = [];

let serverTime = null;
let clientTime = null;

const DELAY = 100;
const PROPS_TO_LERP = ['x', 'y'];
const FIELDS_TO_LERP = ['bullets', 'player', 'players'];

export let fps = new measureFPS();

const MSG_UPDATE = "update";
const MSG_DISCON = "disconnect";
const MSG_PLAY = "start";
const MSG_INPUT = "input";

const socket = io();

//socket.on(MSG_UPDATE, (data) => (gameStateBuffer.push(data), (firstServerTimeStamp = data.t)));

socket.on(MSG_UPDATE, (data) => {
    gameBuffer.push(data);
    serverTime = data.t;
    clientTime = Date.now();
});

socket.on(MSG_DISCON, stopAnimationFrame);

socket.emit(MSG_PLAY, "Nickname", (data) => {
    serverTime = data.t;
    clientTime = Date.now();
    gameBuffer.push(data)
    startAnimationFrame();
});

const lerp = (v0, v1, n) => v0 + (v1 - v0) * n;

const mainLoop = (currentTime) => {
    fps.countFrames(currentTime);

    delta = (currentTime - oldTime) / 1000; // time in seconds
    oldTime = currentTime;

    const dx = input.keys.a ? -1 : input.keys.d ? 1 : 0;
    const dy = input.keys.w ? -1 : input.keys.s ? 1 : 0;

    socket.emit(MSG_INPUT, {
        dx,
        dy,
        delta,
        timeStamp: currentTime,
        mouseClick: input.mouse.click,
        mouseDirection: input.mouse.direction
    });

    //if (!gameStateBuffer.length > 1) return last(gameStateBuffer);

    const t = serverTime + (Date.now() - clientTime) - DELAY;

    //let baseIndex = gameStateBuffer.findIndex(s => s.t <= t);
    let baseIndex = getIndex(gameBuffer, t);

    //if (baseIndex < 0 || baseIndex + 1 > gameBuffer.length - 1) {
    if (baseIndex >= 0 && baseIndex + 1 < gameBuffer.length) {
        let baseUpdate = gameBuffer[baseIndex];
        let nextUpdate = gameBuffer[baseIndex + 1];
        // Remove older game states
        if (baseIndex > 0) gameBuffer.splice(0, baseIndex);

        let progress = (t - baseUpdate.t) / (nextUpdate.t - baseUpdate.t);
        let lastLerped = lerpGameState(baseUpdate, nextUpdate, progress);
        let state = last(gameBuffer);
        draw({
            food: state.food,
            rectangles: state.rectangles,
            arena: state.arena,
            player: lastLerped.player,
            entities: lastLerped.players,
            bullets: lastLerped.bullets
        });
    } else {
        let state = last(gameBuffer);
        draw({
            food: state.food,
            rectangles: state.rectangles,
            arena: state.arena,
            player: state.player,
            entities: state.players,
            bullets: state.bullets
        });
    }
    requestId = requestAnimationFrame(mainLoop);
};

function startAnimationFrame() {
    requestId = requestAnimationFrame(mainLoop);
}

function stopAnimationFrame() {
    if (requestId) cancelAnimationFrame(requestId);
}

function lerpObject(obj1 = {}, obj2 = {}, props = [], prog = 0) {
    let ips = {};
    for (let p of props) {
        ips[p] = lerp(obj1[p], obj2[p], prog);
    }
    return ips;
}

function lerpGameState(state1, state2, progress) {
    // lerped state doesn't have other properties used for rendering!
    let res = {};
    FIELDS_TO_LERP.forEach(f => {
        if (!(f in state1)) throw Error('Game state does not have property ' + f);
        if (Array.isArray(state1[f])) {
            //state1.map(o => lerpObject(o, state2.find(o2 => o.id === o2.id), PROPS_TO_LERP, progress));
            res[f] = state1[f].map(o => {
                let o2 = state2[f].find(i => i.id == o.id);
                if (o2) {
                    return { ...o, ...lerpObject(o, o2, PROPS_TO_LERP, progress) };
                }
                return o;
            });//.filter(i => i);
        } else if (typeof state1[f] === 'object') {
            res[f] = { ...state1[f], ...lerpObject(state1[f], state2[f], PROPS_TO_LERP, progress) };
        } else {
            throw Error('Cannot interpolate this property!');
        }
    });
    return res;
}

function getIndex(buffer, timestamp) {
    let baseIndex = -1;
    for (let i = buffer.length - 1; i >= 0; i--) {
        if (buffer[i].t <= timestamp) {
        //if (buffer[i].t <= timestamp && buffer[i + 1].t >= timestamp) {
            baseIndex = i;
            break;
        }
    }
    return baseIndex;
}