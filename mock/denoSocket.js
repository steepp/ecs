import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { serveDir, serveFile } from "jsr:@std/http/file-server";

const io = new Server();

io.on("connection", (socket) => {
        console.log(`socket ${socket.id} connected`);

        socket.emit("hello", "world");

        socket.on("disconnect", (reason) => {
                console.log(
                        `socket ${socket.id} disconnected due to ${reason}`,
                );
        });
});

const handler = io.handler((req) => {
        const pathname = new URL(req.url).pathname;

        if (pathname === "/") {
                return serveFile(req, "../index.html");
        }

        if (pathname.startsWith("/css")) {
                return serveDir(req, {
                        fsRoot: "../css/",
                        urlRoot: "css",
                });
        }

        if (pathname.startsWith("/src")) {
                return serveDir(req, {
                        fsRoot: "../src/",
                        urlRoot: "src",
                });
        }

        return new Response("404: Not Found", {
                status: 404,
        });
});

Deno.serve({
        //handler: io.handler(),
        handler,
        port: 3000,
});
