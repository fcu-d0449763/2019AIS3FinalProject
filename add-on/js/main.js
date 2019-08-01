var port = browser.runtime.connect({name: "content"});
port.postMessage({action: "init"});
port.onDisconnect.addListener(() => {
    port = null;
});

port.onMessage.addListener(message => {
    switch (message.action) {
        case "getComment":
            let iterator = document.createNodeIterator(document, NodeFilter.SHOW_COMMENT, () => NodeFilter.FILTER_ACCEPT);
            let node;
            while (node = iterator.nextNode()) {
                port.postMessage({
                    action: "sendComment",
                    target: "panel",
                    text: node.textContent
                });
            }
            break;
    }
});