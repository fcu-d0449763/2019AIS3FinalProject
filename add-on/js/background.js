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
