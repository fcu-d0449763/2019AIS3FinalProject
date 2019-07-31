function googleHacking(e) {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        browser.tabs.create({
            url: `https://www.google.com/search?q=site:${new URL(tabs[0].url).origin} filetype:${e.target.value}`
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    buttons = document.querySelectorAll(".hack");
    buttons.forEach(e => {
        e.addEventListener("click", googleHacking);
    });
});