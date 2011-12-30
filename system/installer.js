var currentSlide = 0;
var totalSlide = 3
var width = window.innerWidth;
var language ="en";
var stepActiveColor ="";
var stepInactiveColor ="";
var selectedPartition = "";
var selectedPartitionColor = "";
var normalPartitionColor = "";
var minimumPartitionSize = 1000;
var nextSlideValidators = {};

var onchangeUpdaterList = [
    "language",
    "computer_name",
    "full_name",
    "user_name",
    "password",
    "password2"
];

var alphaStart = ("a").charCodeAt(0);
var alphaEnd = ("z").charCodeAt(0);

var ALPHAStart = ("A").charCodeAt(0);
var ALPHAEnd = ("Z").charCodeAt(0);
var digitStart = ("0").charCodeAt(0);
var digitEnd = ("9").charCodeAt(0);

function camelize(string) {
    var result = "";
    var capitalize = false;
    for (var i = 0; i < string.length; i++){
        var c = string.charAt(i);
        if (c == '_') {
            capitalize = true;
            continue;
        } else {
            if (capitalize) {
                result += c.toUpperCase();
                capitalize = false;
            } else {
                result += c;
            }
        }
    }
    return result;
}

function onSlideVisibitilyChanged() {
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

function validateCurrentSlide() {
    if (nextSlideValidators[currentSlide]) {
        eval("var canContinue = " + nextSlideValidators[currentSlide]);
      
        if (canContinue) {
            document.getElementById("next").removeAttribute("disabled");
        } else {
            document.getElementById("next").setAttribute("disabled", "disabled");
        }
    }
}

function slide() {
    var pos = currentSlide * width * -1;
    document.getElementById("slider").style.WebkitTransform="translateX(" + pos + "px)";
    onSlideVisibitilyChanged();
    validateCurrentSlide();
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
    var paddingLeft  = 0;
    var paddingRight = 0;

    // Get padding from CSS
    if (document.styleSheets) {
        for (var i = 0; i < document.styleSheets.length; i ++) {
            var sheet = document.styleSheets[i];
            for (var j = 0; j < sheet.cssRules.length; j ++) {
                rules = sheet.cssRules[j];
                if (rules.selectorText == "div.column") {
                    paddingLeft  = rules.style.paddingLeft;
                    paddingRight = rules.style.paddingRight;
                } else if (rules.selectorText == "div.steps") {
                    stepInactiveColor = rules.style.color;
                } else if (rules.selectorText == "div.steps_long") {
                    stepActiveColor = rules.style.color;
                } else if (rules.selectorText == "div.partition") {
                    normalPartitionColor = rules.style.backgroundColor;
                } else if (rules.selectorText == "div.partition_selected") {
                    selectedPartitionColor = rules.style.backgroundColor;
                }
            }
        }
    }

    width = window.innerWidth;
    var columns = document.querySelectorAll("div.column");
    for (var i = 0; i < columns.length; i++){
        columns[i].style.width = (width - parseInt(paddingLeft) - parseInt(paddingRight))+ "px"; 
        columns[i].style.left = (i * width) + "px"; 

        var id = columns[i].id;

        nextSlideValidators[i] = "canContinue" + id.charAt(0).toUpperCase() + id.substring(1, id.length) + "()";
    }
    totalSlide = columns.length;
    getLanguages();
    getRegions();
    getKeyboards();
    getPartitions();
    retranslate();
    setupUpdater();
    onSlideVisibitilyChanged();
    validateCurrentSlide();
}

function onLanguageChanged() {
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

function getLanguages() {

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

function getRegions() {

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

function getKeyboards() {

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

function getPartitions() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var devices = eval("(" + ajax.responseText + ")")
            
            var item = document.getElementById("device_list");
            item.innerHTML = "";
            for (var i = 0;i < devices.length; i ++){
                var device = document.createElement("div");
                device.setAttribute("class", "device");
                var desc = "<b>" + devices[i].model + "</b> (" + devices[i].controller + ":" + devices[i].path + ")  <i>" + devices[i].size + "MB</i>" ;
                var txt = document.createTextNode(desc);
                item.appendChild(device);
                device.innerHTML = desc;
                for (var j = 0; j < devices[i].partitions.length; j ++) {
                    var p = devices[i].partitions[j];
                    if (p.size <= 0) {
                        continue;
                    }

                    var partition = document.createElement("div");
                    partition.setAttribute("class", "partition");
                    var id = "";
                    if (p.filesystem == "free") {
                        id = devices[i].path + "_free";
                    } else {
                        id = devices[i].path + p.id;
                    }
                    partition.setAttribute("id", id);
                    if (p.size > minimumPartitionSize) {
                        partition.setAttribute("onclick", "selectPartition('" + id + "')");
                    }
                    var txt = "";
                    if (p.description) {
                        txt += "<b>" + p.description + "</b><br/>";
                    }
                    txt += id + ": " + p.size + " MB";
                    partition.innerHTML = txt;
                    device.appendChild(partition);
                    if (p.parent != "0") {
                        var parentItem = document.getElementById(devices[i].path + p.parent);
                        if (parentItem != undefined) {
                            parentItem.style.display = "none";
                        }
                    }
                }
            }
        } 
    }
    ajax.open("GET", "http://parted/get_devices");
    ajax.send(null);
}

function selectPartition(partition) {
    var items = document.querySelectorAll("div.partition");
    for (var i = 0; i < items.length; i++){
        if (items[i].id == partition) {
            items[i].style.backgroundColor = selectedPartitionColor;
            continue;
        }
        items[i].style.backgroundColor = normalPartitionColor;
    }
    selectedPartition = partition;
    validateCurrentSlide ();
}

function canContinueLocale() {
    return true;
}

function canContinueTarget() {
    if (selectedPartition != "")
        return true;

    return false;
}

function setupUpdater() {
    for (var i = 0; i < onchangeUpdaterList.length; i ++) {
        var id = onchangeUpdaterList [i];
        var item = document.getElementById(id);
        if (item != undefined) {
            item.setAttribute("onchange", camelize("on_" + id + "Changed") + "(this)");
        }
    }
}

function validateLowerCaseAlphanumeric(string) {
    var result = true;
    for (var i = 0; i < string.length; i ++) {
        var isAlpha = (string.charCodeAt(i) >= alphaStart && string.charCodeAt(i) <= alphaEnd);
        var isDigit = (string.charCodeAt(i) >= digitStart && string.charCodeAt(i) <= digitEnd);
        if (i == 0) {
            if (!isAlpha) {
                result = false;
                break;
            }
        }

        if (!(isAlpha || isDigit)) {
            result = false;
            break;
        }
    }
    return result;
}

function giveFocusIfInvalid(result, item) {
    if (!result) {
        item.focus();
    }
}

function onComputerNameChanged(item) {
    var result = false;

    if (item.value.length > 0) {
        result = true;
    }

    var lowercase = item.value.toLowerCase();
    result = result & validateLowerCaseAlphanumeric (lowercase);
   
    item.value = lowercase;
    displayHint (item, !result);
    giveFocusIfInvalid(item);
    return result;
}

function onUserNameChanged(item) {
    // same validation with computer_name
    return onComputerNameChanged(item);
}

function onPasswordChanged(item) {
    var result = false;

    if (item.value.length > 7) {
        result = true;
    }

    var string = item.value;
    var hasAlpha = false;
    var hasDigit = false;
    var hasALPHA = false;
    if (result) {
        result = false;
        for (var i = 0; i < string.length; i ++) {
            var isAlpha = (string.charCodeAt(i) >= alphaStart && string.charCodeAt(i) <= alphaEnd);
            var isALPHA = (string.charCodeAt(i) >= ALPHAStart && string.charCodeAt(i) <= ALPHAEnd);
            var isDigit = (string.charCodeAt(i) >= digitStart && string.charCodeAt(i) <= digitEnd);
            if (isAlpha) {
                hasAlpha = true;
            }

            if (isALPHA) {
                hasALPHA = true;
            }

            if (isDigit) {
                hasDigit = true;
            }

            if (hasALPHA && hasAlpha && hasDigit) {
                result = true
                break;
            }
        }
    }

    displayHint (item, !result);
    giveFocusIfInvalid(item);
    return true;
}

function onPassword2Changed(item) {
    var result = false;
    var p = document.getElementById("password");
    if (p != undefined) {
        result = (p.value == item.value);    
    }

    displayHint (item, !result);
    giveFocusIfInvalid(item);
    return result;
}

function displayHint(object, display) {
    var id = object.id;
    var item = document.getElementById("hint_" + id);
    if (item != undefined) {
        if (display) {
            item.style.display = "inherit";
        } else {
            item.style.display = "none";
        }
    }
}
