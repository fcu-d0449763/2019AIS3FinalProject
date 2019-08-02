$('.menu .item').tab();
$('.ui.dropdown').dropdown();
//$('#convertdropdown').dropdown('set selected', 'md5');
$('.ui.accordion').accordion();






// send button click
document.getElementById("send").addEventListener("click", ()=> {
   let message = {
        "mode": document.getElementById("method").innerHTML,
        "url": document.getElementById("url").value,
        "body": document.getElementById("body").value
    } 
    browser.runtime.sendMessage(JSON.stringify(message));
});

// clear button click
document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("url").value = "";
    document.getElementById("send").style.display = "none";
    document.getElementById("load").style.removeProperty("display"); 
});

document.getElementById("url").addEventListener("keyup", (e) => {
    if (e.target.value == ""){
        document.getElementById("send").style.display = "none";
        document.getElementById("load").style.removeProperty("display");
    } else {
        document.getElementById("send").style.removeProperty("display"); 
        document.getElementById("load").style.display = "none";
    }
});
