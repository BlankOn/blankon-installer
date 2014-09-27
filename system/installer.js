var install = (function(){
    var language = "C";
    var statusUpdater = -1;
    var gbSize = 1073741824;
    var minimumPartitionSize = 4 * gbSize;
    var alphaStart = ("a").charCodeAt(0);
    var alphaEnd = ("z").charCodeAt(0);

    var ALPHAStart = ("A").charCodeAt(0);
    var ALPHAEnd = ("Z").charCodeAt(0);
    var digitStart = ("0").charCodeAt(0);
    var digitEnd = ("9").charCodeAt(0);


    var currentPage = -1;
    var previousPage = -1;
    var mode = 0;
    var strongPassword = false;
    var autoLogin = false;

    // Table to hold the validity of the mandatory inputs
    var formValid = {
        computerName : false,
            userName : false,
            password : false,
           password2 : false,
    };

    // Holds private callback functions 
    var _ = {}
    
    // Holds list of known installable devices
    var devices = [];

    // Returns true if can continue from page "Target"
    _.canContinueTarget = function() {
        return ($("div.ui-partition-selected").length > 0);
    }

    // Returns true if can continue from page "Personalization"
    _.canContinuePersonalization = function() {
        var result = true;
        result = result && formValid.computerName;
        result = result && formValid.userName;
        result = result && formValid.password;
        result = result && formValid.password2;

        if ($("#txt-full-name").val().length < 1) {
            $("#txt-full-name").val($("#txt-user-name").val());
        }
        checkAutoLogin();
        return result;
    }

    // Returns true that we always can get pass the Summary page
    _.canContinueSummary = function() {
        return true;
    }

    // Validates current slide so the "Next" button would be clickable
    var validateCurrentPage = function() {
        if (currentPage < 0) {
            return;
        }
        var p = $(".ui-page").get(currentPage).id;
        var f = "canContinue" + p.charAt(0).toUpperCase() + p.slice(1);
       
        $("#next").addClass("disabled").removeClass("ui-button-toolbar-enabled");
        if (typeof _[f] === "function") {
            if (_[f]() == true) {
                $("#next").addClass("ui-button-toolbar-enabled").removeClass("disabled");
            }
        }
    }

    // Gets partition data of specified deviceId and partitionId
    var getPartitionData = function(deviceId, partitionId) {
        return devices[deviceId].partitions[partitionId]; 
    }

    // Selects partition
    var selectPartition = function() {
        $("div.ui-partition-selected").attr("class", "ui-partition");
        $(this).attr("class", "ui-partition ui-partition-selected");

        validateCurrentPage();
    }

    // Populates partition selection
    var getPartitions = function() {
        var item = $("#device_list");
        item.empty();
        for (var i = 0;i < devices.length; i ++){
            var device = $("<div>", {
                "class": "device"
            });

            var device_txt = createString("<b>{1}</b> ({2}) <i>{3} GB</i>", devices[i].model, devices[i].path, (devices[i].size/gbSize).toFixed(2));
            item.append(device);
            device.html(device_txt);
            for (var j = 0; j < devices[i].partitions.length; j ++) {
                var p = devices[i].partitions[j];
                if (p.size <= (0.01*gbSize)) {
                    continue;
                }

                var partition = $("<div>", {
                    "data-device": i,
                    "data-partition": j
                });
                if (p.size > minimumPartitionSize
                        && (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0)) {
                    partition.click(selectPartition);
                    partition.attr("class", "ui-partition");
                    partition.attr("data-size", p.size);
                    partition.attr("data-device", device_txt);
                } else {
                    partition.attr("class", "ui-partition-disabled");
                }
                if (p.id > 0) {
                    txt = createString("Used partition (ID={1}{2}): {3} {4} GB", devices[i].path, p.id, p.description, (p.size/gbSize).toFixed(2));
                    partition.html(txt);
                    partition.attr("data-info", txt);
                } else if (p.type.indexOf("FREESPACE") > 0) {
                    txt = createString("Free partition: {1} GB", (p.size/gbSize).toFixed(2));
                    partition.attr("data-info", txt);
                    partition.html(txt);
                }
                device.append(partition);
            }
        }
    }

    // Prepares the "target" page
    _.preparePageTarget = function(e) {
        devices = Parted.getDevices();
        if (devices.length > 0) {
            getPartitions(devices);
            $("#waiting_target").hide();
            $("#select_target").show();
        } else {
            $("#waiting_target").hide();
            $("#no_target").show();
        }
    } 

    _.preparePagePersonalization = function(e) {
        var p = $("div.ui-partition-selected");
        $("#txt-computer-name").focus();    
    }

    _.preparePageSummary = function(e) {
        var p = $("div.ui-partition-selected");
        $("#summary-target-device").html(p.attr("data-device"));
        $("#summary-target-partition").html(p.attr("data-info"));
        $("#summary-full-name").text($("#txt-full-name").val());
        $("#summary-computer-name").text($("#txt-computer-name").val());
        $("#summary-user-name").text($("#txt-user-name").val());
        $("#summary-auto-login").text(autoLogin ? "Yes" : "No");
    }

    _.preparePageInstallation = function(e) {
        $("nav.toolbar").css("bottom", "-" + $("nav.toolbar").height() + "px"); 
        setTimeout(sendInstallationData, 1000);
    }

    // Creates string with positional parameters
    var createString = function(string) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length - 1; i ++) {
                string = string.replace("{"+ (i + 1) +"}", arguments[i+1]);
            }
        }
        return string;
    }

    // Animates pages with transition
    var displayPage = function() {
        // We reverse animation if going back through the list
        var reverse = (previousPage > currentPage);
        var animationName = "bounceIn";
        var outgoingAnimationName = "bounceOut";
        var animationSuffix = reverse ? "Left" : "Right";
        var outgoingAnimationSuffix = reverse ? "Right" : "Left";
        var withTransition = true;
        var pages = $(".ui-page");
        var outgoing = null;
        var incoming = null;

        if (arguments.length > 0) {
            previousPage = currentPage;
            outgoing = pages.get(currentPage);
            for (var i = 0; i < pages.length; i++) {
                var p = pages.get(i);
                if (p.id == arguments[0]) {
                    incoming = p;
                    currentPage = i;
                    break;
                }
            }
        } else {
        // get the pages we're interested in
            outgoing = (currentPage < 0) ?
                        null : 
                        (reverse ?
                            pages.get(currentPage + 1) :
                            pages.get(currentPage - 1));
            incoming = pages.get(currentPage);
        }

        if (withTransition) {
            var id = incoming.id;
            var f = "preparePage" + id.charAt(0).toUpperCase() + id.slice(1);
            // apply the pages with the animation styles
            if (outgoing != null) {
                $(outgoing).addClass(outgoingAnimationName + outgoingAnimationSuffix).one("webkitAnimationEnd", function() {
                  $(this).removeClass(outgoingAnimationName + outgoingAnimationSuffix + " active");
                });
                $(outgoing).removeClass(animationName + animationSuffix);
                $(incoming).addClass("active");
                $(incoming).addClass(animationName + animationSuffix + " active").one("webkitAnimationEnd", function() {
                  $(this).removeClass(animationName + animationSuffix);
                  if (typeof _[f] === "function") {
                    // setup function that will be run after transition is finished
                    _[f]();
                  }
                });
            }
        }

        // show navigation toolbar when necessary
        if ($(incoming).attr("data-toolbar") == "no") {
            $("nav.toolbar").css("bottom", "-" + $("nav.toolbar").height() + "px"); 
        } else {
            $("nav.toolbar").css("bottom", "0px"); 
        }
        validateCurrentPage();
    }

    var goPreviousPage = function() {
        if (canGoPreviousPage()) {
            previousPage = currentPage;
            currentPage --;
            displayPage();
        }
    }

    var canGoPreviousPage = function() {
        return true;
    }

    var goNextPage = function() {
        var disabled = $(this).hasClass("disabled");
        if (disabled) {
            e.preventDefault();
            return;
        }

        if (canGoNextPage()) {
            previousPage = currentPage;
            currentPage ++;
            displayPage();
        }
    }

    var canGoNextPage = function() {
        if (currentPage == -1) {
            return true;
        }

        var result = true;

        return result;
    }

    var populateSelection = function(data, label , compareTo) {
        var sel = $("#opt-" + label);  
        for (var i in data) {
            var opt = $("<option>").
                text(data[i]).
                attr("value", i);
            if (i == compareTo) {
                opt.attr("selected", "true");
            }
            sel.append(opt);
        }
    }

    var displayModeSwitchText = function() {
        $("#ui-switch-mode-text").removeClass("ui-switch-mode-hidden").addClass("ui-switch-mode-shown");
    }


    var hideModeSwitchText = function() {
        $("#ui-switch-mode-text").removeClass("ui-switch-mode-shown").addClass("ui-switch-mode-hidden");
    }

    var setupButtons = function() {
        $("#btn-install").click(goNextPage); 
        $(".btn-shutdown").click(Installation.shutdown); 
        $("#btn-reboot").click(Installation.reboot); 
        $("#next").click(goNextPage); 
        $("#prev").click(goPreviousPage); 
        $("#ui-switch-mode-button").mouseover(displayModeSwitchText); 
        $("#ui-switch-mode-button").mouseleave(hideModeSwitchText); 
        $("#ui-switch-mode-button").click(switchMode); 
    }

    var switchMode = function() {
        mode ++;
        if (mode > 1) 
            mode = 0;

        applyMode ();
    }

    var applyMode = function() {
        if (mode == 0) {
            $("#ui-advanced-mode-text").addClass("ui-advanced-mode-text-hidden").removeClass("ui-advanced-mode-text-shown");
            $("#ui-switch-mode-text").text($("#ui-switch-mode-advanced-text").text());
            $(".ui-advanced-options").addClass("ui-advanced-options-hidden").removeClass("ui-advanced-options-shown");
        } else {
            $("#ui-advanced-mode-text").removeClass("ui-advanced-mode-text-hidden").addClass("ui-advanced-mode-text-shown");
            $("#ui-switch-mode-text").text($("#ui-switch-mode-quick-text").text());
            $(".ui-advanced-options").addClass("ui-advanced-options-shown").removeClass("ui-advanced-options-hidden");
        }
    }
        

    var setupAjax = function() {
        $.getJSON("languages.json", function(data) {
            var availableLocale = Installation.getLocaleList();
            var locales = {};
            for (var i = 0; i < availableLocale.length; i ++) {
                var l = availableLocale[i];
                if (typeof data[l] === "undefined") {
                    locales[l] = l;
                } else {
                    locales[l] = data[l];
                }
            }
            populateSelection(locales, "language", language);
        });

	    $.getJSON("keyboards.json", function(data) {
		    populateSelection(data, "keyboard", language);
	    });
    }

    // Displays hint of a field object
    var displayHint = function (object, display) {
        var item = $("#hint-" + object.id);
        if (arguments.length > 2) {
            item = $("#" + arguments[2]);
        }
        if (item.length > 0) {
            if (display) {
                item.css("display", "inherit");
            } else {
                item.css("display", "none");
            }
        }
    }

    // Validates string which only has alphanumeric and in lowercase
    var validateLowerCaseAlphanumeric = function(string) {
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

    // Decorates a field when the value is invalid
    // also gives a focus to it
    var decorateFieldWhenInvalid = function(element, invalid) {
        if (invalid) {
            if ($(element).attr("focused") != "true") {
                element.focus(); 
                $(element).attr("focused", "true");
            }
            $(element).addClass("invalid");
        } else {
            $(element).attr("focused", "");
            $(element).removeClass("invalid");
        }
    }

    var onComputerNameChanged = function() {
        var result = false;

        if (this.value.length > 0) {
            result = true;
        }

        var lowercase = this.value.toLowerCase();
        result = result && validateLowerCaseAlphanumeric (lowercase);
        this.value = lowercase;

        displayHint (this, !result);
        decorateFieldWhenInvalid(this, !result);
        formValid.computerName = result;

        validateCurrentPage();
        return result;
    }

    var onUserNameChanged = function() {
        var result = false;

        if (this.value.length > 0) {
            result = true;
        }

        var lowercase = this.value.toLowerCase();
        result = result && validateLowerCaseAlphanumeric (lowercase);
        this.value = lowercase;

        displayHint (this, !result);
        decorateFieldWhenInvalid(this, !result);
        formValid.userName = result;

        validateCurrentPage();
        return result;
    }

    var onPasswordChanged = function() {
        var result = false;

        if (this.value.length > 0) {
            result = true;
        }

        var string = this.value;

        var hasAlpha = false;
        var hasDigit = false;
        var hasALPHA = false;

        var strongResult = false;
        if (string.length > 7) {
            strongResult = true;
        }

        if (strongResult) {
            strongResult = false;
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
                    strongResult = true
                        break;
                }
            }
        }

        if (strongPassword) {
            result = strongResult;
            displayHint (this, !result, "hint-txt-password-strong");
            displayHint (this, false, "hint-txt-password-warning");
        } else {
            displayHint (this, false, "hint-txt-password-strong");
            displayHint (this, !strongResult, "hint-txt-password-warning");
            displayHint (this, !result);
        }
        decorateFieldWhenInvalid(this, !result);
        formValid.password = result;

        validateCurrentPage();
        return true;
    }

    var onPassword2Changed = function() {
        var result = false;
        result = ($("#txt-password").val() == this.value);    

        displayHint (this, !result);
        decorateFieldWhenInvalid(this, !result);
        formValid.password2 = result;

        validateCurrentPage();
        return result;
    }


    // Checks the strong password option
    var checkStrongPassword = function() {
        strongPassword = ($("#opt-strong-password").get(0).checked);
        $("#txt-password").val("");
        $("#txt-password2").val("");
        formValid.password = false;
        formValid.password2 = false;
    }

    // Checks whether the auto login is selected
    var checkAutoLogin = function() {
        autoLogin = ($("#opt-auto-login").get(0).checked);
    }

    // Changes language 
    var changeLanguage = function() {
        language = $("#opt-language").val();
        Installation.setLocale(language);
        translate();
    }

    // Change timezone selection
    var changeZone = function() {
        var selection = $("#opt-timezone");
        selection.empty();
        selection.show();
        var zone = $("#opt-zone").val();
        var data = Utils.getTimezones(zone);
        var prioritizedCities = ["Jakarta", "Jayapura", "Ujung Pandang", "Pontianak"];

        for (var j = 0; j < prioritizedCities.length; j++) {
          var city = prioritizedCities[j];
          var name = city;
          if (city == "Ujung Pandang") {
            name = "Makassar";
          } 
          var opt = $("<option>").text(name).attr("value", zone + "/" + city);
          selection.append(opt);
          console.log("x");
        }

        for (var i = 0; i < data.length; i ++) {
          var city = data[i].replace("_", " ");
          if (city.indexOf(prioritizedCities) >= 0) {
            continue;
          }
          var opt = $("<option>").
              text(city).
              attr("value", zone + "/" + data[i]);
          selection.append(opt);
        }
    }

    // Change timezone
    var changeTimezone = function() {
        Installation.setTimezone($("#opt-timezone").val());
    }

    // Setups events of the form fields
    var setupForm = function() {
        $("#txt-computer-name").blur(onComputerNameChanged);
        $("#txt-user-name").blur(onUserNameChanged);
        $("#txt-password").blur(onPasswordChanged);
        $("#txt-password2").blur(onPassword2Changed);
        $("#opt-strong-password").blur(checkStrongPassword);
        $("#opt-auto-login").blur(checkAutoLogin);
        $("#opt-language").blur(changeLanguage);
        $("#opt-language").change(changeLanguage);
        $("#opt-zone").change(changeZone);
        $("#opt-zone").blur(changeZone);
        $("#opt-timezone").change(changeTimezone);
        $("#opt-timezone").blur(changeTimezone);
    }

    var sendInstallationData = function() {
        var p = $("div.ui-partition-selected");
        var params = ""
        params += "&partition=" + p.attr("data-partition");
        params += "&device=" + p.attr("data-device");
        params += "&hostname=" + $("#txt-computer-name").val(); 
        params += "&username=" + $("#txt-user-name").val();
        params += "&fullname=" + $("#txt-full-name").val();
        params += "&password=" + $("#txt-password").val();
        params += "&language=" + $("#opt-language").val();
        params += "&timezone="   + $("#opt-timezone").val(); 
        params += "&keyboard=" + $("#opt-keyboard").val(); 
        params += "&autologin=" + (autoLogin ? "true" : "false");
        installation = new Installation(params);
        installation.start();

        updateStatus();
        statusUpdater = setInterval(updateStatus, 5000);
    }

    var updateStatus = function () {
        var status = installation.getStatus(); 
        console.log(status.status + ":" + status.description);
        $("#current-step").html(status.description);
        $("#progress-bar").css("width", status.progress + "%");

        if (status.status > 1) {
            clearInterval (statusUpdater);
            if (status.status == 2) {
                showError();
            } else {
                setTimeout(goNextPage, 2000);
            }
        }
    }

    var showError = function() {
        displayPage("error");  

        $("#log").load("file:////var/log/blankon-installer.log");
    }

    // Translates all <span> element which has
    // translate attribute set to "yes" (if not given
    // then considered as "yes")
    var translate = function() {
        $("span[translate!='no']").text(function(index, text) {
            if (this.hasAttribute("data-string")) {
                text = this.getAttribute("data-string");
            } else {
                this.setAttribute("data-string", text);
            }
            this.innerHTML = gettext(text);
        });
    }

    // Calls the gettext function defined in backend
    var gettext = function(text) {
        return Installation.translate(text);
    }

    var init = function() {
        setupButtons();
        setupForm();
        setupAjax();
        changeZone();
        goNextPage();
        applyMode();
        translate();
    }

    return {
        init: init
    }

}).apply();

$(document).ready(function() {

    install.init ();
});
