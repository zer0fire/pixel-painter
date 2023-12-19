import { useState } from "react";
import { Socket } from "socket.io-client";
// import { useState } from "react";

function useOnlineCount(socket: Socket) {
    var [count, setCount] = useState(0);
    socket && socket.on("online-count", setCount);
    return count;
}

function OnlineCount({ socket }: { socket: Socket }) {
    var count = useOnlineCount(socket);

    return <div style={{ margin: "20px" }}>Online people: {count}</div>;
}

export default OnlineCount;
