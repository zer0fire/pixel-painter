import { useState } from "react";
// import { useState } from "react";

function useOnlineCount(socket: any) {
    var [count, setCount] = useState(0);
    socket.on("online-count", setCount);
    return count;
}

function OnlineCount({ socket }: any) {
    var count = useOnlineCount(socket);

    return <div style={{ margin: "20px" }}>在线人数: {count}</div>;
}

export default OnlineCount;
