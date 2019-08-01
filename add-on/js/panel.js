var input, output, type;
var MD5 = new Hashes.MD5;
var SHA1 = new Hashes.SHA1;
var SHA256 = new Hashes.SHA256;
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
    },
    "ascii2hex": function(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
          var hex = Number(str.charCodeAt(i)).toString(16);
          arr.push(hex);
        }
        return arr.join('');
    },
    "hex2ascii":function(s) {
          var hex = s.toString();
          var str = '';
          for (var i = 0; i < hex.length; i += 2)
              str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          return str;
      },
    "ascii2Bin":function(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
          result.push(str.charCodeAt(i));
        }
        return result;
      },

}
function convert(event) {
    output.value = functions[type.value](input.value);
}
document.addEventListener("DOMContentLoaded", () => {
    input = document.querySelector("#input");
    output = document.querySelector("#output");
    type = document.querySelector("#type");
    input.addEventListener("keyup", convert);
    type.addEventListener("change", convert);
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        console.log(tabs);
    });
});