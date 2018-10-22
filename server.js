const WebSocket = require('ws');


let history = [
    {
        key: 1,
        name: "Kolyan",
        text: "Hi guys!"
    },
    {
        key: 2,
        name: "Vasya",
        text: "Hi Kolya!"
    }
];

const wss = new WebSocket.Server({ port: 8081 });

wss.broadcast = function broadcast(ws, data) {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function connection(ws) {
    console.log("connect user");
    let historyObject = {
        type: "init",
        data: history.slice(-10)
    };
    ws.send(JSON.stringify(historyObject));

    ws.on('message', function incoming(data) {
        setTimeout(function () {
            let parseData = JSON.parse(data);
            history.push(parseData.data);
            wss.broadcast(ws, data);
            ws.send(JSON.stringify({type: "update_msg", data: parseData.data.key}));
        }, 500);

        console.log("received message:", data);
    });

    ws.on('close', function (evt) {
        console.log("close", evt)
    })
});