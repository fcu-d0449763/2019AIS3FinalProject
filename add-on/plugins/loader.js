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

function loading(){
    $('.tool-text-container').append($('<div class="ui active loader tool-text-loader"></div>'));
    $('.tool-select').addClass('disabled');
}
function finish(){
    $('.tool-text-loader').remove();
    $('.tool-select').removeClass('disabled');
}
