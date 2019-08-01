function googleHacking(q, t) {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        browser.tabs.create({
            url: `https://www.google.com/search?q=site:${new URL(tabs[0].url).origin} ${q?q:''} ${t&&t!='all'?"filetype:"+t : ""}`
        });
    });
}

$('#search').click(()=>{
    const query = $('#query')[0];
    const type = $('#query-type')[0];
    googleHacking(query.value, type.value);
})

$('.ui.dropdown').dropdown();
$('.ui.accordion').accordion();