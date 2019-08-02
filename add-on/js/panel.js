$('.menu .item').tab();
$('.ui.dropdown').dropdown();
//$('#convertdropdown').dropdown('set selected', 'md5');
$('.ui.accordion').accordion();

function getComment() {
    port.postMessage({
        action: "getComment",
        target: "content",
        tabId: tabId
    });
}

port.onMessage.addListener(message => {
    switch (message.action) {
        case "sendComment":
            comment.append(
                $("<div>", {class: "item"}).append(
                    $("<div>", {class: "content"}).text(message.text)
                )
            );
            break;

        case "update":
            comment.empty();
            getComment();
    }
});

port.postMessage({
    action: "init",
    tabId: tabId
});

getComment();