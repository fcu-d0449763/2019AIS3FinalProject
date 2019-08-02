var port = browser.runtime.connect({name: "panel"});
var tabId = browser.devtools.inspectedWindow.tabId;
var input, output, type, comment;
var MD5 = new Hashes.MD5;
var SHA1 = new Hashes.SHA1;
var SHA256 = new Hashes.SHA256;
functions = {
    "md5": function (s) {
        return MD5.hex(s);
    },
    "sha1": function (s) {
        return SHA1.hex(s);
    },
    "sha256": function (s) {
        return SHA256.hex(s);
    },
    "base64encode": function (s) {
        return btoa(s);
    },
    "base64decode": function (s) {
        return atob(s);
    },
    "urlencode": function (s) {
        return encodeURIComponent(s);
    },
    "urldecode": function (s) {
        return decodeURIComponent(s);
    },
    "ascii2hex": function (s) {
        var arr = [];
        for (var i = 0, l = s.length; i < l; i++) {
            var hex = Number(s.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    },
    "hex2ascii": function (s) {
        var hex = s.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },
    "ascii2Bin": function (s) {
        var result = [];
        for (var i = 0; i < s.length; i++) {
            result.push(s.charCodeAt(i));
        }
        return result;
    },
    "toUpper": function (s) {
        return s.toString().toUpperCase();
    },
    "toLower": function (s) {
        return s.toString().toLowerCase();
    },
    "ROTAll": function (s) {
        return rotall(s);
    }
}
function convert(event) {
    output.value = functions[type.value](input.value);
}


document.addEventListener("DOMContentLoaded", () => {
    input = document.querySelector("#input");
    output = document.querySelector("#output");
    type = document.querySelector("#convert");
    comment = $("#comment");
    input.addEventListener("keyup", convert);
    type.addEventListener("change", convert);
});


function rotall(s){
    text = ''
    for (var i =1;i<27;i++){
        text += 'ROT'+i+':' + caesarCipher(s,i) + '\n'
    }
    return text
}

function caesarCipher(str, num) {
    var newString = []
    num = num % 26      // num: 0 ~ 25

    for (var i = 0; i < str.length; i++) {
        var currentCharCode = str.charCodeAt(i)
        var newCharCode

        if (currentCharCode >= 65 && currentCharCode <= 90) {
            newCharCode = currentCharCode + num
            if (newCharCode < 65) {
                newCharCode = newCharCode + 26
            } else if (newCharCode > 90) {
                newCharCode = newCharCode - 26
            }
        } else if (currentCharCode >= 97 && currentCharCode <= 122) {
            newCharCode = currentCharCode + num
            if (newCharCode < 97) {
                newCharCode = newCharCode + 26
            } else if (newCharCode > 122) {
                newCharCode = newCharCode - 26
            }
        } else {
            newCharCode = currentCharCode
        }

        newString.push(String.fromCharCode(newCharCode))
    }
    return newString.join('')

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
