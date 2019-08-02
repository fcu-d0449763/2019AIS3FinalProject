const payloads = {
    "SQLi":{
        "Boolean Base":["b1", "b2"],
        "Error Base":["e1", "e2"]
    },
    "Web_Shell":{
        "PHP":["p1", "p2"],
        "Pyhton":["py1", "py2"]
    },
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
