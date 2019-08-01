var portToBackground = browser.runtime.connect({ name: "WT_loader"})

// send to background
document.getElementById("plugins").addEventListener("change", () => {
    let plugin = document.getElementById("plugins");
    console.log("Sending: " + plugin.value);
    browser.runtime.sendMessage(plugin.value);
});

// recive from background
portToBackground.onMessage.addListener(message => {
    document.getElementById("output").value = message;
});