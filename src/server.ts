import app from "./app";
import http from "http";
import { PORT } from "./utils/environment";
import { connectToDB } from "./config/db";

connectToDB();

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});