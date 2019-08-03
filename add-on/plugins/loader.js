var portToBackground = browser.runtime.connect({ name: "WT_loader"})

// send to background
document.querySelector("#tool").addEventListener("change", () => {
    let mode = document.querySelector("#tool").value;    
    console.log("Sending: " + mode);
    let message = {
        "mode" : mode
    };
    loading();
    browser.runtime.sendMessage(JSON.stringify(message));
});

// recive from background
portToBackground.onMessage.addListener(message => {
    response = JSON.parse(message);
    if (response.mode == "GET_URL") {
        document.getElementById("url").value = response.url;
        document.getElementById("send").style.removeProperty("display");
        document.getElementById("load").style.display = "none";
    }
    else {
        finish();
        document.getElementById("tool-output").value = response.body;
    }
});


// load url
document.getElementById("load").addEventListener("click", () => {
    let message = {
        "mode": "GET_URL"
    };
    browser.runtime.sendMessage(JSON.stringify(message));
    finish();
});

function loading(){
    $('#tool-output').val("");
    $('.tool-text-container').append($('<div class="ui active loader tool-text-loader"></div>'));
    $('.tool-select').addClass('disabled');
}
function finish(){
    $('.tool-text-loader').remove();
    $('.tool-select').removeClass('disabled');
}
