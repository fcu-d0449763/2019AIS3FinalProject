$('.menu .item').tab();
$('.ui.dropdown').dropdown();
//$('#convertdropdown').dropdown('set selected', 'md5');
$('.ui.accordion').accordion();

port.onMessage.addListener(message => {
    switch (message.action) {
        case "sendComment":
            comment.append(
                $("<div>", {class: "item"}).append(
                    $("<div>", {class: "content"}).text(message.text)
                )
            );
            break;
    }
});

port.postMessage({
    action: "init",
    tabId: tabId
});

port.postMessage({
    action: "getComment",
    target: "content",
    tabId: tabId
});
