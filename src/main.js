import { fps } from "./fps.js";
import { Position, Color, Radius } from "./entity.js";
import { Renderer, getCanvasCtx, draw } from "./render.js";
import { SocketNetwork } from "./network.js";
import { getControls } from "./controls.js";
import {
        updateClientServerTime,
        getEstimatedServerTime,
        SnapshotRepository,
        EntityContext,
        EntityFactory,
} from "./game.js";

let delta = 0;
let oldTime = 0;
let requestId = null;
let intervalID = null;

const snapshots = new SnapshotRepository();
const network = new SocketNetwork();
const econtext = new EntityContext();
const visitor = new Renderer(getCanvasCtx());
//const updateRequest = new UpdateRequest();

const resolver = {
        x: Position,
        y: Position,
        color: Color,
        r: Radius,
};

let matchingEntityIds = null;
let matchingEntityPairsAttrs = null;

const CL_INTERP = 0;

const computeAlpha = (t, t0, t1) => (t - t0) / (t1 - t0);

const findMatchingEntityId = (s1, s2) =>
        s2.keys().filter((k) => k in s1.keys());

class UpdateRequest {
        constructor() {
                this.req = {};
        }

        init(obj) {
                Object.assign(this.req, obj);
        }

        execute(id, econtext) {
                Object.keys(this.req).forEach((key) => {
                        econtext.get(id, resolver[key])?.update(this.req[key]);
                });
        }

        clear() {
                Object.keys(this.req).forEach((k) => delete this.req[k]);
        }
}

function selectDataForUpdate(id) {
        return matchingEntityPairsAttrs.find((pair) => pair[0][id]);
}

function updateAttributes(entity) {
        const upd = selectDataForUpdate(entity.id);
        let val = null;
        Object.keys(upd).forEach((k) => {
                val = upd[k];
                //iterate through components and update values
        });
}

function mainLoop(currentTime) {
        fps.countFrames(currentTime);

        delta = (currentTime - oldTime) / 1000; // time in seconds
        oldTime = currentTime;

        if (CL_INTERP) {
                const DELAY = 100;
                const t = getEstimatedServerTime() - DELAY;

                const timestamps = Array.from(snapshots.keys()).sort();
                const i = timestamps.findIndex((k) => k <= t);

                const condition = i < 0 || (i == 0 && snapshots.size() == 1);
                if (!condition) {
                        const t0 = timestamps[i];
                        const t1 = timestamps[i + 1];

                        const alpha = computeAlpha(t, t0, t1);

                        const snapshotStartEntities = snapshots.get(t0);
                        const snapshotNextEntities = snapshots.get(t1);

                        matchingEntityIds = findMatchingEntityId(
                                snapshotNextEntities,
                                snapshotStartEntities,
                        );

                        matchingEntityPairsAttrs = matchingEntityIds.forEach(
                                (id) => {
                                        const entityStart =
                                                snapshotStartEntities[id];
                                        const entityNext =
                                                snapshotNextEntities[id];
                                        return [entityStart, entityNext];
                                },
                        );
                }
        }

        //const entities = matchingEntityIds.map(EntityFactory.createEntity);
        //entities.forEach(updateAttributes);
        //entities.forEach((entity) => entity.draw(visitor, econtext));

        draw(snapshots.getLatestSnapshot(), delta);
        //draw(delta);

        requestId = requestAnimationFrame(mainLoop);
}

function updateContext(entity) {
        for (let component of econtext.get(entity).values) {
                // components repository better to be list or map?
                component.handleUpdate(entity);
        }
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

function saveSnapshot(snapshot) {
        const t = snapshot.t;
        let entities = snapshot.data;
        snapshots.set(t, entities);

        if (snapshots.size > 3) {
                snapshots.truncate();
        }
}

function inititLocalEntities(snapshot) {
        const entities = snapshot.data;
        entities.forEach(EntityFactory.createEntity);
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
                saveSnapshot(snapshot);
        });

        const onConnect = (snapshot) => {
                const serverTime = snapshot?.t || Date.now();
                updateClientServerTime(serverTime);
                saveSnapshot(snapshot);
                inititLocalEntities(snapshot);
                startRenderLoop();
        };
        const nickName = "Romulus_" + new Date().toJSON();
        network.connect(nickName, onConnect);
})();
