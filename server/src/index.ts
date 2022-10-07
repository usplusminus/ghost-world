import {setupSocketServer} from "./server";

function main() {
    console.log("Starting socket server for the ghost-world")
    const server = setupSocketServer()
    server.listen(5555);
}

main()
