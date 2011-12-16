var currentSlide = 0;
var totalSlide = 3
var width = window.innerWidth;
var language="en";
var stepActiveColor="";
var stepInactiveColor="";

function update_slide_visibility() {
    var items = document.querySelectorAll("div.steps_long");
    for (var i = 0; i < items.length; i++){
        if (i == currentSlide)
            continue;
        items[i].style.maxWidth = "0px";
    }
    items[currentSlide].style.maxWidth = "500px";

    items = document.querySelectorAll("div.steps");
    for (var i = 0; i < items.length; i++){
        items[i].style.color = stepInactiveColor;
    }
    items[currentSlide].style.color = stepActiveColor;

}

function slide() {
    var pos = currentSlide * width * -1;
    document.getElementById("slider").style.WebkitTransform="translateX(" + pos + "px)";
    update_slide_visibility();
}

function nextSlide() {
    if (currentSlide + 1 >= totalSlide)
        return;

    currentSlide ++;
    slide();
}

function previousSlide() {
    if (currentSlide - 1 < 0)
        return;

    currentSlide --;
    slide();
}

function setup() {
    var padding_left  = 0;
    var padding_right = 0;

    // Get padding from CSS
    if (document.styleSheets) {
        for (var i = 0; i < document.styleSheets.length; i ++) {
            var sheet = document.styleSheets[i];
            for (var j = 0; j < sheet.cssRules.length; j ++) {
                rules = sheet.cssRules[j];
                if (rules.selectorText == "div.column") {
                    padding_left  = rules.style.paddingLeft;
                    padding_right = rules.style.paddingRight;
                } else if (rules.selectorText == "div.steps") {
                    stepInactiveColor = rules.style.color;
                } else if (rules.selectorText == "div.steps_long") {
                    stepActiveColor = rules.style.color;
                }
            }
        }
    }

    console.log(padding_left);
    width = window.innerWidth;
    var columns = document.querySelectorAll("div.column");
    for (var i = 0; i < columns.length; i++){
        columns[i].style.width = (width - padding_left - padding_right)+ "px"; 
        columns[i].style.left = (i * width) + "px"; 
    }
    totalSlide = columns.length;
    get_languages();
    get_regions();
    get_keyboards();
    retranslate();
    update_slide_visibility();
}

function update_language() {
    var item = document.querySelector("select#language");
    language = item.options[item.selectedIndex].value; 
    retranslate();
}

function retranslate() {
    if (language == "C") {
        return;
    }

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        var success = false;
        if (ajax.readyState==4 && ajax.responseText) {
            var translations = eval("(" + ajax.responseText + ")")
                var items = document.querySelectorAll("span");
            for (var i = 0; i < items.length; i++){
                if (translations[items[i].id] != undefined) {
                    items[i].innerHTML = translations[items[i].id];
                }
            }
            success = true;
        } 

        if (success) {
            language = "C";
        } 
    }
    ajax.open("GET", "translations." + language + ".json");
    ajax.send(null);
}

function get_languages() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var languages = eval("(" + ajax.responseText + ")")
                var item = document.querySelector("select#language");
            item.options.length = 0;
            for (var lang in languages) {
                var option = document.createElement("option");
                if (lang == language)
                    option.selected = true;
                option.text = languages[lang];
                option.value = lang;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "languages.json");
    ajax.send(null);
}

function get_regions() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var regions = eval("(" + ajax.responseText + ")")
                var item = document.querySelector("select#region");
            item.options.length = 0;
            for (var region in regions) {
                var option = document.createElement("option");
                if (region == language)
                    option.selected = true;
                option.text = regions[region];
                option.value = region;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "regions.json");
    ajax.send(null);
}

function get_keyboards() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var keyboards = eval("(" + ajax.responseText + ")")
                var item = document.querySelector("select#keyboard");
            item.options.length = 0;
            for (var keyboard in keyboards) {
                var option = document.createElement("option");
                if (keyboard == language)
                    option.selected = true;
                option.text = keyboards[keyboard];
                option.value = keyboard;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "keyboards.json");
    ajax.send(null);
}


