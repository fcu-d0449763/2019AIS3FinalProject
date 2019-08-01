var loader_port = browser.runtime.connectNative("WT_loader");

// store every connection
var ports = [];
browser.runtime.onConnect.addListener(p => {
    if (p.name === "WT_loader") {
        ports[p.sender.contextId] = p;
    }
});

// forward native response to dev-tool  
loader_port.onMessage.addListener((response) => {
    for (let p in ports) {
        try {
            ports[p].postMessage(response);
        } catch (error) {
            delete ports[p];
        }
    }
});

// recive message from port
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message == "bfac") {
        browser.tabs.query({currentWindow: true, active: true}).then(([tabinfo]) => {
            loader_port.postMessage(message + "&" + tabinfo.url);
        });
    }
})

var connections = {};

browser.runtime.onConnect.addListener(port => {
    var extensionListener = message => {
        var tabId = port.sender.tab ? port.sender.tab.id : message.tabId;

        if (message.action == "init") {
            if (!connections[tabId]) {
                connections[tabId] = {};
            }
            connections[tabId][port.name] = port;
            return;
        }

        if (message.target) {
            var conn = connections[tabId][message.target];
            if (conn) {
                conn.postMessage(message);
            }
        }
    };

    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(port => {
        var tabs = Object.keys(connections);
        for (var i=0, len=tabs.length; i < len; i++) {
        if (connections[tabs[i]][port.name] === port) {
            delete connections[tabs[i]][port.name];
            if (Object.keys(connections[tabs[i]]).length === 0) {
                delete connections[tabs[i]];
            }
            break;
            }
        }
    });
});