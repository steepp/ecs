const MSG_UPDATE = "update";
const MSG_PLAY = "start";
const MSG_KEYS = "keys";

class Network {
        constructor() {
                if (this.constructor == Network) {
                        throw new Error(
                                "Abstract classes can't be instantiated.",
                        );
                }
        }
        onMessage() {}
        onDisconect() {}
        connect() {}
        sendInput() {}
}

/*global io*/
export class SocketNetwork extends Network {
        constructor() {
                super();
                this.socket = io(); // io is bound to the global scope
        }

        onMessage(cb) {
                this.socket.on(MSG_UPDATE, cb);
        }

        onDisconect(cb) {
                this.socket.on("disconnect", cb);
        }

        connect(nick, cb) {
                this.socket.emit(MSG_PLAY, nick, cb);
        }

        sendInput(payload) {
                this.socket.emit(MSG_KEYS, payload);
        }
}
