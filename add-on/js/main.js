var port = browser.runtime.connect({name: "content"});
port.postMessage({action: "init"});
port.onDisconnect.addListener(() => {
    port = null;
});

// POST data
function postMessage(url, body) {
    let form = document.createElement("form");
    form.setAttribute('method', "post");
    form.setAttribute('action', url);
    let list = body.split("&");

    for (var index in list) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', list[index].split("=")[0]);
        input.setAttribute('value', list[index].split("=")[1]);
        form.appendChild(input);
    }
    
    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
}

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
        case "POST":
            postMessage(message.url, message.body);
            break

    }
});