import { io } from "socket.io-client";

const URL =
    process.env.NODE_ENV === "production" ? `${process.env.REACT_APP_HOST}` : "";

export const socket = io(URL, {
    autoConnect: false
});
