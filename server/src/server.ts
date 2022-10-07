import {Server} from "socket.io";


export function setupSocketServer(){
    const server = new Server({
        cors: {
            origin: "*",
        }
    });

    server.on("connection", (socket) => {
        console.log("ID:", socket.id, "connected")
    });
    return server
}

