var currentSlide = 0;
var totalSlide = 3
var width = window.innerWidth;
var language ="en";
var stepActiveColor ="";
var stepInactiveColor ="";
var targetPartition = "";
var nextSlideValidators = {};

var targetDevice = "";
var targetPartitionSize = 0;

var targetDeviceId = -1;
var targetPartitionId = -1;

var statusUpdater = -1;
var translations = {};
var devices = [];
var gbSize = 1073741824;
var minimumPartitionSize = 4 * gbSize;

var onchangeUpdaterList = [
    "language",
    "computer_name",
    "full_name",
    "user_name",
    "password",
    "password2"
];

// Table to hold the validity of the mandatory inputs
var personalizationValidation = {
    computerName : false,
        userName : false,
        password : false,
       password2 : false,
};

// Table to hold the readyness of each data source
var dataReady = {
    partitions : false,
     languages : false,
       regions : false,
     keyboards : false,

};

var alphaStart = ("a").charCodeAt(0);
var alphaEnd = ("z").charCodeAt(0);

var ALPHAStart = ("A").charCodeAt(0);
var ALPHAEnd = ("Z").charCodeAt(0);
var digitStart = ("0").charCodeAt(0);
var digitEnd = ("9").charCodeAt(0);

/* SETUP */
function setupUpdater() {
    for (var i = 0; i < onchangeUpdaterList.length; i ++) {
        var id = onchangeUpdaterList [i];
        var item = document.getElementById(id);
        if (item != undefined) {
            item.setAttribute("onchange", camelize("on_" + id + "Changed") + "(this)");
        }
    }
}

function setup(resizing) {
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
                }
            }
        }
    }

    width = window.innerWidth;
    document.getElementById("error_frame").style.marginTop = window.innerHeight;
    var columns = document.querySelectorAll("div.column");
    var navigationBar = document.getElementById("toolbar");
    for (var i = 0; i < columns.length; i++){
        columns[i].style.width = (width - parseInt(paddingLeft) - parseInt(paddingRight))+ "px"; 
        columns[i].style.left = (i * width) + "px"; 

        if (resizing == false) {
            var id = columns[i].id;

            nextSlideValidators[i] = camelize("canContinue_" + id) + "()";

            var toolbarStep = document.createElement("div");
            toolbarStep.setAttribute("class", "steps");
            toolbarStep.setAttribute("id", "step" + (i + 1));
            toolbarStep.innerHTML = (i + 1);
            var toolbarDescription = document.createElement("div");
            toolbarDescription.setAttribute("class", "steps_long");
            toolbarDescription.setAttribute("id", "step" + (i + 1) + "_long");

            var h1 = columns[i].getElementsByTagName("h1");
            for (var j = 0; j < h1.length; j ++) {
                toolbarDescription.innerHTML = h1[j].innerHTML;
                break;
            }
            navigationBar.appendChild(toolbarStep);
            navigationBar.appendChild(toolbarDescription);
        }
    }

    if (resizing)
        return;

    totalSlide = columns.length;
    retranslate();
    getLanguages();
    getRegions();
    getKeyboards();
    getPartitions();
    setupUpdater();
    updateSlideVisibility();
    validateCurrentSlide();
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
            dataReady.languages = true;
            baseIsReady();
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
            dataReady.regions = true;
            baseIsReady();
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
            dataReady.keyboards = true;
            baseIsReady();
        } 
    }
    ajax.open("GET", "keyboards.json");
    ajax.send(null);
}

function getPartitions() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            devices = eval("(" + ajax.responseText + ")")
            
            var item = document.getElementById("device_list");
            item.innerHTML = "";
            for (var i = 0;i < devices.length; i ++){
                var device = document.createElement("div");
                device.setAttribute("class", "device");
                var txt = create_string("txt_device_info_line", "<b>{1}</b> ({2}) <i>{3} GB</i>", devices[i].model, devices[i].path, (devices[i].size/gbSize).toFixed(2));
                item.appendChild(device);
                device.appendChild(txt);
                for (var j = 0; j < devices[i].partitions.length; j ++) {
                    var p = devices[i].partitions[j];
                    if (p.size <= (0.01*gbSize)) {
                        continue;
                    }

                    var partition = document.createElement("div");
                    partition.setAttribute("id", i + ":" + j);
                    if (p.size > minimumPartitionSize
                        && (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0)) {
                        partition.setAttribute("onclick", "selectPartition('" + i + "', '" + j + "')");
                        partition.setAttribute("class", "partition");
                    } else {
                        partition.setAttribute("class", "partition_disabled");
                    }
                    if (p.id > 0) {
                        txt = create_string("txt_device_partition_line", "Used partition (ID={1}{2}): {3} {4} GB", devices[i].path, p.id, p.description, (p.size/gbSize).toFixed(2));
                        partition.appendChild(txt);
                    } else if (p.type.indexOf("FREESPACE") > 0) {
                        txt = create_string("txt_device_free_partition_line", "Free partition: {1} GB", (p.size/gbSize).toFixed(2));
                        partition.appendChild(txt);
                    }
                    device.appendChild(partition);
                }
            }

            dataReady.partitions = true;
            baseIsReady();
        } 
    }
    ajax.open("GET", "http://parted/get_devices");
    ajax.send(null);
}

function getPartitionData(deviceId, partitionId) {
    return devices[deviceId].partitions[partitionId]; 
}

function selectPartition(deviceId, partitionId) {
    var items = document.querySelectorAll("div.partition");
    for (var i = 0; i < items.length; i++){
        if (items[i].id == deviceId + ":" + partitionId) {
            items[i].setAttribute("class", "partition_selected");
            continue;
        }
        items[i].setAttribute("class", "partition");
    }
    targetPartition = getPartitionData(deviceId, partitionId).id;

    if (getPartitionData(deviceId, partitionId).type.indexOf("FREESPACE") > 0) {
        targetPartition = translate("Free partition");
    }
    targetPartitionSize = getPartitionData(deviceId, partitionId).size;
    targetDevice = devices[deviceId].model;
    targetDeviceId = deviceId;
    targetPartitionId = partitionId;
    validateCurrentSlide ();
}

function canContinueLocale() {
    return true;
}

function canContinueTarget() {
    if (targetPartition != "")
        return true;

    return false;
}

function canContinuePersonalization() {
    var result = true;
    result = result && personalizationValidation.computerName;
    result = result && personalizationValidation.userName;
    result = result && personalizationValidation.password;
    result = result && personalizationValidation.password2;

    return result;
}

function canContinueSummary() {
   
    document.getElementById("summary_target_device").innerHTML = targetDevice;
    document.getElementById("summary_target_partition").innerHTML = targetPartition + " (" + targetPartitionSize + "MB)";
    document.getElementById("summary_target_hostname").innerHTML = document.getElementById("computer_name").value;
    document.getElementById("summary_target_username").innerHTML = document.getElementById("user_name").value;
    return true;
}

function canContinueInstallation() {
    sendInstallationData();
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    return false;
}


function canContinueDone() {
    return false;
}

/* EVENTS */
function onComputerNameChanged(item) {
    var result = false;

    if (item.value.length > 0) {
        result = true;
    }

    var lowercase = item.value.toLowerCase();
    result = result && validateLowerCaseAlphanumeric (lowercase);
   
    item.value = lowercase;
    displayHint (item, !result);
    giveFocusIfInvalid(item);
    personalizationValidation.computerName = result;

    validateCurrentSlide();
    return result;
}

function onUserNameChanged(item) {
    // same validation with computer_name
    var result = onComputerNameChanged(item);
    personalizationValidation.userName = result;

    validateCurrentSlide();
    return result;
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
    personalizationValidation.password = result;

    validateCurrentSlide();
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
    personalizationValidation.password2 = result;

    validateCurrentSlide();
    return result;
}

function onLanguageChanged() {
    var item = document.querySelector("select#language");
    language = item.options[item.selectedIndex].value; 
    retranslate();
}

/* UTILITIES */

function translate(string) {
    if (language == "C") {
        return string;
    }

    if (translations[string] == undefined) {
        return string;
    }
    return translations[string];
}

function retranslate() {
    if (language == "C") {
        return;
    }

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        var success = false;
        if (ajax.readyState==4 && ajax.responseText) {
            translations = eval("(" + ajax.responseText + ")")
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

function updateSlideVisibility() {
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

    if (currentSlide == 0) {
        document.getElementById("next").style.display = "none";
        document.getElementById("prev").style.display = "none";
    } else {
        document.getElementById("next").style.display = "inherit";
        document.getElementById("prev").style.display = "inherit";
    }
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
    updateSlideVisibility();
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

function sendInstallationData() {
    var ajax = new XMLHttpRequest();
    var params = ""
    params += "&partition=" + targetPartitionId;
    params += "&device=" + targetDeviceId;
    params += "&hostname=" + document.getElementById("computer_name").value; 
    params += "&username=" + document.getElementById("user_name").value;
    params += "&fullname=" + document.getElementById("full_name").value;
    params += "&password=" + document.getElementById("password").value;
    params += "&language=" + language;
    params += "&region=" + document.getElementById("region").value;
    params += "&keyboard=" + document.getElementById("keyboard").value;
    ajax.open("GET", "http://install/start?" + params);

    ajax.send(null);

    updateStatus();
    statusUpdater = setInterval("updateStatus()", 5000);
}

function shutdown() {
    var ajax = new XMLHttpRequest();

    
    ajax.open("GET", "http://shutdown");
    ajax.send(null);
}

function baseIsReady() {
    if (dataReady.partitions &&
        dataReady.languages &&
        dataReady.regions &&
        dataReady.keyboards) {
        document.getElementById("base").style.opacity = "1";
    }
}

function updateStatus() {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState==4 && ajax.responseText) {
            var status = eval("(" + ajax.responseText + ")")
            console.log(ajax.responseText);
            console.log(status.status + ":" + status.description);
            document.getElementById("current_step").innerHTML = status.description;

            if (status.status > 1) {
                clearInterval (statusUpdater);
                if (status.status == 2) {
                    showError();
                } else {
                    nextSlide();
                }
            }
        } 

    }
    ajax.open("GET", "http://install/status?");
    ajax.send(null);

}

function showError() {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState==4 && ajax.responseText) {
            document.getElementById("log").innerHTML = ajax.responseText; 
        } 
    }
    ajax.open("GET", "http://install/show_log?");
    ajax.send(null);

    document.getElementById("error_frame").style.marginTop = "0px";
    document.getElementById("viewport").style.opacity = "0";
    document.getElementById("toolbar").style.display = "none";

}

function create_string(logical, string) {
    var obj = document.createElement("span");
    obj.setAttribute("id", logical);
    if (arguments.length > 2) {
        for (var i = 0; i < arguments.length - 2; i ++) {
            string = string.replace("{"+ (i + 1) +"}", arguments[i+2]);
        }
    }
    obj.innerHTML = string;
    return obj;
}
