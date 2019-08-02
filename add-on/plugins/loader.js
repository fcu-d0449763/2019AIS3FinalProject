var portToBackground = browser.runtime.connect({ name: "WT_loader"})

// send to background
document.querySelector("#tool").addEventListener("change", () => {
    let mode = document.querySelector("#tool").value;
    console.log("Sending: " + mode);
    browser.runtime.sendMessage(mode);
});

// recive from background
portToBackground.onMessage.addListener(message => {
    response = JSON.parse(message);
    document.getElementById("tool-output").value = response.body;
});