const Blob = require("./blob");
const Rectangle = require('./rect.js');
const QuadTree = require('@timohausmann/quadtree-js');
const { collide, rectsOverlap } = require('./collision.js');
const fog = require('./lib/fog.js');


class Game {
    constructor() {
        //this.SIZE = { width: 2500, height: 1000 };
        this.SIZE = { width: 1000, height: 1000 };

        this.sockets = {};
        this.players = {};
        this.bullets = {};
        this.clientsInputSequence = [];
        this.latestProccesedInput = {};

        this.quad = new QuadTree({ x: 0, y: 0, width: this.SIZE.width, height: this.SIZE.height });

        this.playersCounter = 0;

        this.rectangles = this.makeRect(this.SIZE.width - 50, this.SIZE.height - 50);
        this.food = Array.from(Array(100), i => new Object({ x: Math.random() * 2500, y: Math.random() * 1000, r: 5 }));

        this.oldTime = Date.now();
        this.timestep = 100;

        //this.proccessInterval = setInterval(this.gameLoop.bind(this), this.timestep);

        // Run game loop at 60 fps
        //setInterval(this.gameLoop.bind(this), 1000 / 60);

        // Run game loop at 30 fps
        setInterval(this.gameLoop.bind(this), 1000 / 30);

        // Send game update every 100 ms
        //setInterval(this.sendGameUpdate.bind(this), 100);
        setInterval(this.sendGameUpdate.bind(this), 1000 / 30);
    }

    makeRect(width, height) {
        let rectsCount = 10;
        let rectsList = [];
        // Use fixed width and height for rects.
        const w = 50;
        const h = 50;

        for (let i = 0; i < rectsCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const n = new Rectangle(x, y, w, h);
            if (!rectsList.some(r => rectsOverlap(r, n))) {
                rectsList.push(n);
            }
        }
        rectsList.push(new Rectangle(500 - (w / 2) / 2, 500 - (h * 2) / 2, w / 2, h * 2));
        return rectsList;
    }

    prepareInitUpdate(socket) {
        return this.prapareUpdate(this.players[socket.id]);
    }

    addPlayer(socket, data) {
        this.sockets[socket.id] = socket;
        this.clientsInputSequence[socket.id] = [];
        this.bullets[socket.id] = [];

        let nickname = "Player " + this.playersCounter;
        if (data) nickname = data;

        const [x, y] = [Math.random() * this.SIZE.width, Math.random() * this.SIZE.height];

        this.players[socket.id] = new Blob(socket.id, nickname, x, y, 15);

        // Initialize vision field for a player
        // add the map as a rectange for corect vision polygon
        let r = [...this.rectangles, new Rectangle(0, 0, this.SIZE.width, this.SIZE.height)];
        let f = fog(r, this.players[socket.id]);
        this.players[socket.id].visionField = f;
        // set vision polygon so client doesn't get error rendering player without vision polygon
        this.players[socket.id].vision = f.getVisibleArea();

        this.playersCounter++;
    }

    addToInputSequence(socket, request) {
        this.clientsInputSequence.push({ id: socket.id, ...request });
    }

    procInput() {
        while (this.clientsInputSequence.length > 1) {
            this.processRequest(this.clientsInputSequence.shift());
        }
    }

    processRequest(input) {
        const id = input.id;
        let player = this.players[id];
        if (!player) return;

        //player.update(input.dx, input.dy, delta);
        player.dx = input.dx;
        player.dy = input.dy;

        if (input.mouseClick) {
            // using client delta time to update bullet, todo: change to server delta time
            const b = player.shoot(input.mouseDirection, input.timeStamp);
            if (b) this.bullets[id].push(b);
        }
        this.bullets[id] = this.bullets[id].filter(b => b.isActive);
        // use mouse direction to calculate vision polygon
        // update player's direction then in player.update() recalculate vision field
        player.direction = input.mouseDirection;
    }

    checkNodes(n) {
        for (let i = 0, l = n.objects.length; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
                collide(n.objects[i], n.objects[j]);
            }
        }
        if (n.nodes.length > 0) {
            n.nodes.forEach(node => this.checkNodes(node));
        }
    }

    checkCol() {
        this.quad.clear();

        // Insert game objects.
        this.rectangles.forEach(r => this.quad.insert(r));

        //Insert bullets
        Object.values(this.bullets).forEach(arr => arr.forEach(b => this.quad.insert(b)));
        // Insert players.
        Object.values(this.players).forEach(p => this.quad.insert(p));

        this.checkNodes(this.quad);
    }

    gameLoop() {
        const time = Date.now();
        const delta = (time - this.oldTime) / 1000;
        this.oldTime = time;

        // update velocities
        this.procInput();

        Object.values(this.players).forEach(p => p.update(delta));
        Object.values(this.bullets).forEach(arr => arr.forEach(b => b.update(delta)));
        //Object.values(this.bullets).forEach(arr => arr.filter(b => b.isActive));

        this.checkCol();
        // send new positions to the clients
        //this.sendGameUpdate();
    }

    prapareUpdate(player) {
        return {
            t: Date.now(),
            player: player,
            players: Object.values(this.players).filter(p => p.id != player.id),
            bullets: Object.values(this.bullets).reduce((acc, c) => [...acc, ...c], []),
            food: this.food,
            rectangles: this.rectangles,
            arena: this.SIZE
        };
    }

    sendGameUpdate() {
        Object.entries(this.players).forEach((entry) => {
            this.sockets[entry[0]].emit("update", this.prapareUpdate(entry[1]));
        });
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        delete this.bullets[socket.id];
        delete this.latestProccesedInput[socket.id];
        this.playersCounter--;
    }
}

module.exports = () => new Game();
