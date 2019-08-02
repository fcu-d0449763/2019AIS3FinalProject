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
    console.log("Recive:" + response);
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
    if (message === "bfac") {
        browser.tabs.query({currentWindow: true, active: true}).then(([tabinfo]) => {
            let request = {
                "mode": message,
                "sender": sender.contextId,
                "body": tabinfo.url
            }
            console.log(JSON.stringify(request));
            loader_port.postMessage(JSON.stringify(request));
        });
    } else if (message === "sublist3r") {
        browser.tabs.query({currentWindow: true, active: true}).then(([tabinfo]) => {
            let url = tabinfo.url.split(":")[1].split("/").filter(i => i)[0]
            let request = {
                "mode": message,
                "sender": sender.contextId,
                "body": url
            }
            console.log(JSON.stringify(request));
            loader_port.postMessage(JSON.stringify(request));
        });
    } else if (message === "dirsearch") {
        browser.tabs.query({currentWindow: true, active: true}).then(([tabinfo]) => {
            let url_component = tabinfo.url.split("/");
            url_component.pop();
            let url = url_component.join("/");
            let request = {
                "mode": message,
                "sender": sender.contextId,
                "body": url
            }
            console.log(JSON.stringify(request));
            loader_port.postMessage(JSON.stringify(request));
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