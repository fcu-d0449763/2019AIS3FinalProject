var input, output, type;
var MD5 = new Hashes.MD5;
var SHA1 =  new Hashes.SHA1;
var SHA256 =  new Hashes.SHA256;
functions = {
    "md5": function(s) {
        return MD5.hex(s);
    },
    "sha1": function(s) {
        return SHA1.hex(s);
    },
    "sha256": function(s) {
        return SHA256.hex(s);
    },
    "base64encode": function(s) {
        return btoa(s);
    },
    "base64decode": function(s) {
        return atob(s);
    },
    "urlencode": function(s) {
        return encodeURIComponent(s);
    },
    "urldncode": function(s) {
        return decodeURIComponent(s);
    }
}
function convert(event) {
    output.value = functions[type.value](input.value);
}
document.addEventListener("DOMContentLoaded", () => {
    input = document.querySelector("#input");
    output = document.querySelector("#output");
    type = document.querySelector("#convert");
    input.addEventListener("keyup", convert);
    type.addEventListener("change", convert);
});

$('.menu .item').tab();
$('.ui.dropdown').dropdown();
$('.ui.accordion').accordion();