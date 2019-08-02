let line_number;
let started;

window.onload = function() {
    initConfigurationPage();
}

function initConfigurationPage() {
	initGlobalValue();
	// load configuration from local storage
    loadFromBrowserStorage(['config'],function (result) {
        config = JSON.parse(result.config);
        for (let to_add of config.headers) appendLine(to_add.url_contains,to_add.action,to_add.header_name,to_add.header_value,to_add.comment,to_add.apply_on,to_add.status);
        $('#add_button').click(function (e) {appendLine("","add","-","-","","req","on");});
        $('#save_button').click(function (e) {saveData();});
    });
}

function initGlobalValue()
{
    line_number = 1;
    started = "off";
}

function appendLine(url_contains,action,header_name,header_value,comment,apply_on,status) {
    const template = $('#header-template').clone();

    template.attr("id", `header_${line_number}`);
    template.find('.text.action').text(action);
    template.find('input.header_name').attr("value",header_name);
    template.find('input.header_value').attr("value",header_value);
    template.find('input.comment').attr("value",comment);
    template.find('.text.apply_on').text(apply_on=="res"?"Response":"Request");
    if(status == "on") template.find('.status_toggle').checkbox('check');
    template.find('button.delete_button').click((e)=>{
        template.remove();
    })
    $('#header-content').append(template);
    template.find('.ui.dropdown').dropdown();
    line_number++;
}

function saveData() {
    storeInBrowserStorage({config:create_configuration_data()},function() {
      chrome.runtime.sendMessage("reload");
    });
    return true;
}

function create_configuration_data() {
    let content = $('#header-content');
    let headers = [];
    content.children().each(function(i){
        const node = $(this)
        const action = node.find('.text.action').text();
        const header_name = node.find('input.header_name').val();
        const header_value = node.find('input.header_value').val();
        const comment = node.find('input.comment').val();
        const apply_on = node.find('.text.apply_on').text() == "Response"?"res":"req";
        const status = node.find('.status_toggle').checkbox('is checked')?"on":"off";
        headers.push({url_contains:"",action:action,header_name:header_name,header_value:header_value,comment:comment,apply_on:apply_on,status:status});
    });
    let to_export = {format_version:"1.2",target_page:"*",headers:headers,
                    debug_mode:false,show_comments:false,use_url_contains:false, started:'on'};
    return JSON.stringify(to_export);
}


function loadFromBrowserStorage(item,callback_function) {
    chrome.storage.local.get(item, callback_function);
}

function storeInBrowserStorage(item,callback_function)  {
    chrome.storage.local.set(item,callback_function);
}