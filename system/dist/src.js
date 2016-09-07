angular.module("done",[])
.controller("DoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

    $scope.reboot = function(){
      console.log("reboot");
      Installation.reboot();
    };
}])

angular.module("encryption",[])
.controller("EncryptionCtrl", ["$scope", "$window", "$timeout", "$rootScope", 
  function ($scope, $window, $timeout, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);
    
    $rootScope.setLanguage({ id: "en_US.utf8", title: "English US" });
    
    $rootScope.installationData.secureInstallPassphrase = "";
    $rootScope.installationData.secureInstallPassphraseRepeat = "";

    $scope.title = "Encryption Passphrase";
    
    $scope.validate = function() {
      if (!$rootScope.installationData.secureInstallPassphrase) {
        return;
      } else {
        if ($rootScope.installationData.secureInstallPassphrase != $rootScope.installationData.secureInstallPassphraseRepeat) {
          return;
        }
      }
      $rootScope.next();
    }   
    if ($rootScope.quickDebug) {
      $rootScope.installationData.secureInstallPassphrase = "test";
      $rootScope.installationData.secureInstallPassphraseRepeat = "test";
      setTimeout(function(){
        $scope.setDrive($rootScope.devices[0]);
        $rootScope.next();
      }, 1000);
    }
  }
])

angular.module("hello",[])
.controller("HelloCtrl", ["$scope", "$window", "$rootScope", "$translate",
  function ($scope, $window, $rootScope, $translate){
    
    $rootScope.contentHeight = $rootScope.contentHeight || ($(window).height()*(87/100)).toString() + "px"; 
    $(".content").css("height", $rootScope.contentHeight);

    $scope.languages = [
      { id: "en_US.utf8", title: "English US" },
      { id: "id_ID.utf8", title: "Bahasa Indonesia" },
    ];
    
    $rootScope.setLanguage($scope.languages[0]);
    
    if (window.Installation) {
      $rootScope.release = Installation.getRelease();
      $rootScope.notEfi = parseInt(Installation.isEfi()) > 0 ? false : true;
    }
    
    if ($rootScope.quickDebug) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000);
    }
}])

angular.module("install",[])
.controller("InstallCtrl", ["$scope", "$window", "$rootScope","$timeout","$interval",
  function ($scope, $window, $rootScope, $timeout, $interval){
    
    $(".content").css("height", $rootScope.contentHeight);

    console.log(JSON.stringify($rootScope.installationData));
    Installation.setTimezone($rootScope.installationData.timezone);

    var showError = function(){
      console.log("error");
      $scope.error = true;
    }
    var currentProgress;
    var updateStatus = function(){
      var status = $rootScope.installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      if ($scope.currentStep === 'copying_filesystem') {
        if (!currentProgress) {
          currentProgress = 20;
        }
        if (currentProgress < 80) {
          currentProgress += 0.5;
        }
        status.progress = currentProgress;
        console.log(status.progress);
      }
      $scope.progressBarWidth = status.progress;
      if (status.status > 1) {
        $interval.cancel(statusUpdater);
        if (status.status == 2) {
          showError();
        } else {
          $rootScope.next();
        }
      }
    }
    $scope.loadingDot = "";
    $interval(function(){
      if ($scope.loadingDot.length === 8) {
        $scope.loadingDot = "";
      } else {
        $scope.loadingDot += " .";
      }
    }, 500);

    var params = "";
    if ($rootScope.installationData.secureInstall) {
        $rootScope.installationData.partition = 0;
        params += "&secureInstall=" + $rootScope.installationData.secureInstall;
        params += "&secureInstallPassphrase=" + $rootScope.installationData.secureInstallPassphrase;
        params += "&rootPassword=" + $rootScope.installationData.rootPassword;
    }
    params += "&partition=" + $rootScope.installationData.partition;
    params += "&device=" + $rootScope.installationData.device;
    params += "&device_path=" + $rootScope.installationData.device_path;
    params += "&hostname=" + $rootScope.installationData.hostname;
    params += "&username=" + $rootScope.installationData.username;
    params += "&fullname=" + $rootScope.installationData.fullname;
    params += "&password=" + $rootScope.installationData.password;
    params += "&language=" + $rootScope.installationData.language;
    params += "&timezone=" + $rootScope.installationData.timezone;
    params += "&keyboard=" + $rootScope.installationData.keyboard;
    params += "&autologin=" + $rootScope.installationData.autologin;
    params += "&advancedMode=" + $rootScope.advancedPartition;
    if ($rootScope.advancedPartition) {
        params += "&steps=" + $rootScope.partitionSteps;
    }
    
    // give time for view transition
    $timeout(function(){
      console.log(params);
      $rootScope.installation = new Installation(params);
      $rootScope.installation.start();
      $scope.currentStep = "";
      statusUpdater = $interval(updateStatus, 1000);
    }, 1000);

}])

angular.module("partition",[])
.controller("PartitionCtrl", ["$scope", "$window", "$timeout", "$rootScope", 
  function ($scope, $window, $timeout, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);
    
    $rootScope.installationData.secureInstall = true;

    $scope.actionDialog = false;
    $scope.title = "Installation Target";
    var gbSize = 1073741824;
    var minimumPartitionSize = 4 * gbSize;
    var driveBlockWidth = 600;
    
    $scope.validate = function(){
      if ($rootScope.validInstallationTarget) {
        $rootScope.next(); 
      }
    }
  
    if (!$rootScope.installationData.partition) {
      // give time for transition
      $timeout(function(){
        if (window.Parted) {
          $rootScope.devices = Parted.getDevices();
        } else {
          // Used for debugging
          $rootScope.devices = [{"path":"/dev/sda","size":53687091200,"model":"ATA VBOX HARDDISK","label":"msdos","partitions":[{"id":-1,"parent":-1,"start":32256,"end":1048064,"size":1016320,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":15570304512,"size":15569256448,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":2,"parent":-1,"start":15570305024,"end":17780702720,"size":2210398208,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":17780703232,"end":27044871680,"size":9264168960,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":3,"parent":-1,"start":27044872192,"end":53687090688,"size":26642219008,"type":"DEVICE_PARTITION_TYPE_EXTENDED","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872192,"end":27044872192,"size":512,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872704,"end":27045920256,"size":1048064,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":5,"parent":-1,"start":27045920768,"end":50703891968,"size":23657971712,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":50703892480,"end":53687090688,"size":2983198720,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""}],"$$hashKey":"00T"}];
        }
        $scope.scanning = true;
      }, 1000);
    }
    $scope.setDrive = function(drive) {
      $rootScope.validInstallationTarget = true;
      // TODO : reset UI
      $rootScope.installationData.device = $rootScope.devices.indexOf(drive);
      var path = drive.path;
      $rootScope.installationData.device_path = path;
      console.log(JSON.stringify($rootScope.devices));
      for (i = 0; i < $rootScope.devices.length; i++)
        if ($rootScope.devices[i].path === path) {
          $rootScope.selectedDrive = $rootScope.devices[i];
          $rootScope.selectedDrive.id = i;
          $rootScope.selectedDrive.partitionList = [];
          $rootScope.selectedDrive.driveWidth = 8 + 1; // Add 1 pixel tolerance
          $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
          $rootScope.selectedDrive.hasExtended = false;
          for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
            var p = $rootScope.selectedDrive.partitions[j];
            $rootScope.selectedDrive.partitionList.push(p);
            // filter partition to fit requirements
            if ( 
              (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0) && p.size > (0.01*gbSize)) {
              p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
              $rootScope.selectedDrive.driveWidth += (p.blockWidth);
              p.sizeGb = (p.size/gbSize).toFixed(2);
              p.selected = false;
              p.normal = true;
              if (p.type.indexOf("LOGICAL") > 0) {
                p.logical = true;
                if ($rootScope.selectedDrive.hasExtended) {
                  for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
                    if ($rootScope.selectedDrive.partitionList[k].extended &&
                    p.start >= $rootScope.selectedDrive.partitionList[k].start &&
                    p.end <= $rootScope.selectedDrive.partitionList[k].end) {
                      // tell it that it has child(s);
                      $rootScope.selectedDrive.partitionList[k].hasChild = true;
                    }
                  }
                }
              } 
              if (p.size < minimumPartitionSize) {
                p.disallow = true;
              }
              if (p.id < 1 && p.type.indexOf("FREESPACE") > 0) {
                p.freespace = true;
                // is this freespace a child of extended partition?
                if ($rootScope.selectedDrive.hasExtended) {
                  for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
                    if ($rootScope.selectedDrive.partitionList[k].extended &&
                    p.start >= $rootScope.selectedDrive.partitionList[k].start &&
                    p.end <= $rootScope.selectedDrive.partitionList[k].end) {
                      p.logicalFreespace = true;
                    }
                  }
                }
              }
            } else {
              if (p.type.indexOf("EXTENDED") > 0) {
                p.extended = true;
                $rootScope.selectedDrive.hasExtended = true;
              } else {
                p.hidden = true;
              } 
            }
          }
        }
      } 
      if ($rootScope.quickDebug) {
        $rootScope.installationData.secureInstallPassphrase = "test";
        $rootScope.installationData.secureInstallPassphraseRepeat = "test";
        setTimeout(function(){
          $scope.setDrive($rootScope.devices[0]);
          $rootScope.next();
        }, 1000);
      }
    }

])

angular.module("postInstallDone",[])
.controller("PostInstallDoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);
    $scope.done = false;
    $scope.logout = function(){
      if (!$scope.done) {
        return;
      }
      Installation.logout();
    };
    // Give time for transition
    setTimeout(function(){
      var data = "";
      // Assemble the parameter, use space as delimiter
      data += $rootScope.installationData.secureInstallPassphrase + " "; // Encryption passphrase
      data += $rootScope.installationData.rootPassword + " "; // The root password
      data += $rootScope.installationData.hostname + " ";
      data += $rootScope.installationData.fullname + " ";
      data += $rootScope.installationData.username + " ";
      data += $rootScope.installationData.hostname + " ";
      Installation.securePostInstallConfig(data);
      $scope.done = true;
      $scope.$apply();
    }, 2000)    
}])

angular.module("root",[])
.controller("RootCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

    $scope.enforceStrongPassword = false;
    $scope.$watch("enforceStrongPassword", function(value){
      $scope.isSamePassword = false;
      $rootScope.installationData.rootPassword = "";
      $rootScope.installationData.rootPasswordRepeat = "";
      $scope.passwordStrength = false;
    })
    $scope.$watch("installationData.rootPassword", function(value){
      $scope.isSamePassword = false;
      $rootScope.installationData.rootPasswordRepeat = "";
      $rootScope.personalizationError = false;
      if (value && $scope.enforceStrongPassword) {
        console.log(value);
        if (value.length >= 8) {
          $scope.validPassword = true;
        } else {
          $scope.passwordStrength = "weak";
          if ($scope.enforceStrongPassword) {
            $scope.validPassword = false;
          }
        }
        if (value.length >= 8) {
          $scope.passwordStrength = "strong"; 
          if ($scope.enforceStrongPassword) {
            $scope.validPassword = false;
          }
        }
        if (value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g) && value.length >= 8) {
          $scope.passwordStrength = "veryStrong"; 
          $scope.validPassword = true;
        }
        console.log($scope.passwordStrength);
      }
    });
    $scope.$watch("installationData.rootPasswordRepeat", function(value){
      $rootScope.personalizationError = false;
      if (value && value == $scope.installationData.rootPassword) {
        $scope.isSamePassword = true;
      } else {
        $scope.isSamePassword = false;
      }
    });
    $scope.validatePersonalization = function(installationData, validPassword, isSamePassword) {
      $rootScope.personalizationError = false;
      if (isSamePassword) {
        if ($scope.enforceStrongPassword) {
          if (validPassword) {
            $rootScope.next();
          } else {
            $rootScope.personalizationError = true;
          }
        } else {
          $rootScope.next();
        }
      } else {
        $rootScope.personalizationError = true;
      }
    }
    
}])

angular.module("summary",[])
.controller("SummaryCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

}])

angular.module("timezone",[])
.controller("TimezoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope, $watch){
    
    $(".content").css("height", $rootScope.contentHeight);

    $("area, timezone-next").click(function(){
      $rootScope.installationData.timezone = $("select").val();
      console.log($rootScope.installationData);
    });

    if ($rootScope.quickDebug) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000);
    }
}])

angular.module("user",[])
.controller("UserCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

    $scope.enforceStrongPassword = false;
    $rootScope.installationData.autologin = false;
    $scope.$watch("installationData.hostname", function(value){
      $rootScope.personalizationError = false;
      if (value) {
        console.log(value)
        $scope.installationData.hostname = value.replace(/[^a-z0-9-]/g, "");
      }
    });
    $scope.$watch("installationData.fullname", function(value){
      $rootScope.personalizationError = false;
    });
    $scope.$watch("installationData.username", function(value){
      $rootScope.personalizationError = false;
      if (value) {
        console.log(value)
        $scope.installationData.username = value.replace(/[^a-z0-9-]/g, "");
      }
    });
    $scope.$watch("enforceStrongPassword", function(value){
      $scope.isSamePassword = false;
      $rootScope.installationData.password = "";
      $rootScope.installationData.passwordRepeat = "";
      $scope.passwordStrength = false;
    })
    $scope.$watch("installationData.password", function(value){
      $scope.isSamePassword = false;
      $rootScope.installationData.passwordRepeat = "";
      $rootScope.personalizationError = false;
      if (value && $scope.enforceStrongPassword) {
        console.log(value);
        if (value.length >= 8) {
          $scope.validPassword = true;
        } else {
          $scope.passwordStrength = "weak";
          if ($scope.enforceStrongPassword) {
            $scope.validPassword = false;
          }
        }
        if (value.length >= 8) {
          $scope.passwordStrength = "strong"; 
          if ($scope.enforceStrongPassword) {
            $scope.validPassword = false;
          }
        }
        if (value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g) && value.length >= 8) {
          $scope.passwordStrength = "veryStrong"; 
          $scope.validPassword = true;
        }
        console.log($scope.passwordStrength);
      }
    });
    $scope.$watch("installationData.passwordRepeat", function(value){
      $rootScope.personalizationError = false;
      if (value && value == $scope.installationData.password) {
        $scope.isSamePassword = true;
      } else {
        $scope.isSamePassword = false;
      }
    });
    $scope.validatePersonalization = function(installationData, validPassword, isSamePassword) {
      $rootScope.personalizationError = false;
      if (installationData.hostname && installationData.username && installationData.fullname && isSamePassword) {
        if ($scope.enforceStrongPassword) {
          if (validPassword) {
            $rootScope.next();
          } else {
            $rootScope.personalizationError = true;
          }
        } else {
          $rootScope.next();
        }
      } else {
        $rootScope.personalizationError = true;
      }
    }
    
    if ($rootScope.quickDebug) {
      $rootScope.installationData.username = "test";
      $rootScope.installationData.fullname = "test";
      $rootScope.installationData.hostname = "test";
    }
}])

'use strict';
angular.module('Biui', [
  "ui.router",
  "ngAnimate",
  "pascalprecht.translate",
  "angularAwesomeSlider",
  "html",
  "mm.foundation",
  "debounce",
  "hello",
  "timezone",
  "partition",
  "summary",
  "install",
  "done",
  "encryption",
  "root",
  "user",
  "postInstallDone"
])
.config(function ($translateProvider) {
  $translateProvider.translations("en_US.utf8", en);
  $translateProvider.translations("id_ID.utf8", id);
  $translateProvider.preferredLanguage("en_US.utf8");
})
.config(function($stateProvider) {
  $stateProvider
  .state("hello", {
      url: "/hello",
      controller: "HelloCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("hello/hello.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("timezone", {
      url: "/timezone",
      controller: "TimezoneCtrl",
      templateUrl: "timezone.html"
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("partition", {
      url: "/partition",
      controller: "PartitionCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("partition/partition.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("root", {
      url: "/root",
      controller: "RootCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("root/root.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("user", {
      url: "/user",
      controller: "UserCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("user/user.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("summary", {
      url: "/summary",
      controller: "SummaryCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("summary/summary.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("install", {
      url: "/install",
      controller: "InstallCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("install/install.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("done", {
      url: "/done",
      controller: "DoneCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("done/done.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("encryption", {
      url: "/encryption",
      controller: "EncryptionCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("encryption/encryption.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("postInstallDone", {
      url: "/post-install-done",
      controller: "PostInstallDoneCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("post-install-done/post-install-done.html");
      }
    }
  )
})

.run([ "$rootScope", "$state", "$stateParams", "$timeout", "$location", "$translate",
  function ($rootScope, $state, $stateParams, $timeout, $location, $translate) {
    $rootScope.quickDebug = false;
    $rootScope.isEfi = false;
    $translate.use("enUS");
    $rootScope.steps = [
      {
        seq : 0,
        step : 1,
        name : "Introduction",
        path : "hello"
      },
      {
        seq : 1,
        step : 2,
        name : "Timezone",
        path : "timezone"
      },
      {
        seq : 2,
        step : 3,
        name : "Installation Target",
        path : "partition"
      },

      {
        seq : 3,
        step : 4,
        name : "Installation Summary",
        path : "summary"
      },
      {
        seq : 4,
        step : 5,
        name : "Installing...",
        path : ""
      },
      {
        seq : 5,
        step : 6,
        name : "Finish`",
        path : ""
      },
      
      {
        seq : 6,
        step : 7,
        name : "Encryption Passphrase",
        path : "encryption"
      },

      {
        seq : 7,
        step : 8,
        name : "Root Password",
        path : "root"
      },

      {
        seq : 8,
        step : 9,
        name : "Personalization",
        path : "user"
      },
      {
        seq : 9,
        step : 10,
        name : "Post Install Done",
        path : "postInstallDone"
      },

    ]

    $rootScope.goStep = function (seq) {
      if (seq < 4) {
        $rootScope.currentState = seq;
        $location.path($rootScope.steps[seq].path);
      }
    }

    $rootScope.installationData = {};

    $rootScope.states = [
      "hello",
      "timezone",
      "partition",
      "summary",
      "install",
      "done",
      "encryption",
      "root",
      "user",
      "postInstallDone",
    ]

    $rootScope.advancedMode = function() {
      $rootScope.simplePartitioning = false;
    }
    $rootScope.simpleMode = function() {
      $rootScope.simplePartitioning = true;
    }
    $rootScope.currentState = 0;
    $rootScope.simplePartitioning = true;
    $rootScope.back = false;
    $rootScope.forward = true;
    if (window.Installation) {
      $rootScope.isSecurePostInstall = (Installation.isSecurePostInstall() == 'true') ? true : false;
    }
    if ($rootScope.isSecurePostInstall) {
      $rootScope.currentState = 6;
    } else {
      // Set required values for pre installation steps
      var random = Math.random().toString(36).substring(7);
      $rootScope.installationData.rootPassword = random;
      $rootScope.installationData.rootPasswordRepeat = random
      $rootScope.installationData.autologin = true;
      $rootScope.installationData.enforceStrongPassword = false;
      $rootScope.installationData.hostname = random
      $rootScope.installationData.fullname = random
      $rootScope.installationData.username = random
      $rootScope.installationData.password = random
      $rootScope.installationData.secureInstallPassphrase = random;
      $rootScope.installationData.secureInstallPassphraseRepeat = random;
    }

    // initiate partition state early
    $rootScope.partitionState = {
      mountPoint: {},
      stateIndex : 0,
      history : [],
    }

    $rootScope.next = function() {
      $rootScope.back = false;
      $rootScope.forward = true;
      $timeout(function(){
        if ($rootScope.currentState + 1 < $rootScope.states.length) {
          $rootScope.currentState ++;

          var state = $rootScope.states[$rootScope.currentState];
          console.log(state);
          $state.go(state);
        }
      }, 100);
    }

    $rootScope.previous = function() {
      $rootScope.back = true;
      $rootScope.forward = false;
      console.log($rootScope.back);
      $timeout(function(){
        if ($rootScope.currentState - 1 >= 0) {
          $rootScope.currentState--;
          $state.go($rootScope.states[$rootScope.currentState]);
        }
      }, 100);
    }
    $rootScope.exit = function(){
      Installation.shutdown();
    }
    $rootScope.setLanguage = function(lang) {
      console.log(lang);
      $rootScope.installationData.lang = lang.id;
      $rootScope.selectedLang = lang.title;
      $translate.use(lang.id);
      if (window.Installation) {
        Installation.setLocale(lang.id);
      }
    }
    $timeout(function(){
      console.log($(window).width());
      // Fix layout according to screen size
      $(".page").css("width", ($(window).width()*(70/100)).toString() + "px");
      $(".page").css("margin-left", "24px");
      $(".line").css("height", ($(window).height()*(72/100)).toString() + "px");
      $(".line").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step-container").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step").css("margin-bottom", (($(window).height()*(7.6/100))-10).toString() + "px");
      $(".step-big").css("margin-bottom", (($(window).height()*(10.1/100))-30).toString() + "px");
      $rootScope.started = true;
      $state.go($rootScope.states[$rootScope.currentState]);
    }, 250);
    $timeout(function(){
      $rootScope.showStepLine = true;
    }, 1000);
  }
])



var en = {
  welcome_to_program : "Welcome to Xecure installation program.",
  please_choose_lang : "Please choose your language and region below to continue. If your choice is not on the list, you can choose the default values and set again later after the system is fully installed in the Settings application.",
  finish : "Finish",
  installation_finish : "Installation Finish",
  configuring : "Configuring...",
  finish_note : "Installation has been finished. Please click 'Finish' button to quit from installer program.",
  please_wait_configuring : "Please wait.",
  installation_error_occured : "Installation Error Occured.",
  please_take_look : "Please take a look at installion log : /var/log/blankon-installer.log",
  installation : "Installation",
  please_wait_system_scanned : "Please wait while your sistem is being scanned...",
  please_choose_partition : "Please choose the partition on device below which you would like to install Xecure into or use advanced partitioning tool for more control.",
  install_partition : "Installation Target",
  installation_summary : "Installation Summary",
  install_summary_info : "This is our installation summary. Please proceed if you're agree. Beyond this point, the installer will make changes to your system and you can't go.",
  personalization : "Personalization",
  please_enter_personalization : "Please enter your personalization preference below...",
  root_password : "Root Password",
  please_enter_root_password : "Please enter the root password below...",
  computer_name : "Computer Name",
  full_name : "Your Name",
  username : "Username",
  password : "Password",
  repeat_password : "Repeat Password",
  automatically_login : "Automatically login",
  enforced_password : "Enforce strong password",
  enforced_password_requirements : "Your password must contain at least 8 letters, a capital, and a numeric",
  please_fill_required_form : "Please fill all the required form.",
  next : "Next",
  previous : "Previous",
  continue_using_livecd : "Continue using live CD",
  install_blankon : "Install Xecure",
  exit : "Exit",
  install : "Install",
  reboot : "Reboot",
  timezone : "TimeZone",
  select_drive : "Select drive...",
  cancel : "Cancel",
  apply : "Apply",
  use_as_swap : "use as Swap",
  used : "Used",
  too_small : "Too small",
  free_space : "Free space",
  enter_advanced_mode : "Enter Advanced Mode",
  you_are_choosing : "You are choosing",
  to_be_installed_with : "to be installed with Xecure.",
  warning : "WARNING",
  your_system_is_not_an_efi : "Your system was not booted on UEFI mode. You can not install Xecure on current state",
  the_selected_partition_will_be_wiped_out : "The selected partition will be wiped out. Swap partition will be created if you don't have one.",
  exit_advanced_mode : "Exit Advanced Mode",
  are_you_sure_exit_advanced_mode : "Are you sure you want to exit Advanced Mode?",
  if_yes_any_step_will_be : "If yes, any step in PartoEdi will be aborted.",
  no : "No",
  yes : "Yes",
  should_one_partition_as_root : "There should be at least one partition setup as root filesystem.",
  partition : "Partition",
  file_system : "File System",
  mount_point : "Mount Point",
  size : "Size",
  new_partition : "New Partition",
  unallocated : "Unallocated",
  format_as_ext4 : "Format as ext4",
  create : "Create",
  delete : "Delete",
  action : "Action",
  use_as_home : "Use as /home",
  will_be_ext4 : "This will be formatted as ext4 filesystem.",
  will_be_swap : "This will be formatted as swap filesystem.",
  new_size : "New size",
  partition_type : "Partition Type",
  target_device : "Target device",
  target_partition : "Target partition",
  your_system_is_ready : "Your sistem is ready. Please continue to reboot into your newly installed system.",
  installing_filesystem : "Installing filesystem",
  mounting_filesystem : "Mounting filesystem",
  mounting_home_filesystem : "Mounting home filesystem",
  copying_filesystem : "Copying filesystem",
  wipe_disk : "Wiping disk",
  setting_up : "Setting up",
  installing_grub : "Installing GRUB",
  cleaning_up : "Cleaning up",
  create_partition : "Create partition",
  format_partition : "Format Partition",
  secure_installation_summary_1 : "You have been choosen",
  secure_installation_summary_2 : "as installation target. The entiry disk will be wiped out and rearranged to support encrypted installation.",
  please_enter_passphrase : "Please enter the encryption passphrase bellow : ",
  encryption_passphrase : "Encryption passphrase",
  repeat_encryption_passphrase : "Repeat encryption passphrase",
  preparing_encrypted_filesystem : "Preparing encrypted filesystem",
  please_reboot : "Please reboot",
  need_to_reboot : "Half of the installation process has been done. You need to reboot now to continue the instalation."
}

var id = {
  welcome_to_program : "Selamat datang di program pemasang Xecure.",
  please_choose_lang : "Silakan pilih bahasa untuk melanjutkan. Jika bahasa yang Anda inginkan tidak terdaftar, gunakan pilihan bawaan dan atur kembali setelah sistem terpasang pada aplikasi Pengaturan.",
  finish : "Finish",
  installation_finish : "Pemasangan selesai",
  configuring : "Mengkonfigurasi sistem...",
  finish_note : "Pemasangan sistem telah selesai. Silakan klik tombol 'Selesai' untuk keluar dari program pemasang.",
  please_wait_configuring : "Mohon menunggu.",
  installation_error_occured : "Terjadi galat saat pemasangan",
  please_take_look : "Silakan lihat di log pemasangan : /var/log/blankon-installer.log",
  installation : "Pemasangan",
  please_wait_system_scanned : "Sistem sedang dipindai...",
  please_choose_partition : "Silakan pilih partisi pada diska di bawah ini untuk memasang Xecure atau gunakan pemartisi untuk kontrol lebih.",
  install_partition : "Tujuan pemasangan",
  installation_summary : "Ringkasan Pemasangan",
  install_summary_info : "Ini adalah ringkasan pemasangan. Lanjutkan jika Anda setuju. Setelah ini, Pemasang akan membuat perubahan pada sistem Anda dan Anda tidak dapat membatalkannya.",
  personalization  : "Personalisasi",
  please_enter_personalization : "Masukkan preferensi personal Anda di bawah ini ...",
  root_password : "Kata sandi Root",
  please_enter_root_password : "Masukkan kata sandi Root pada isian di bawah ini...",
  computer_name : "Nama komputer",
  full_name : "Nama",
  username : "Nama pengguna",
  password : "Kata sandi",
  repeat_password : "Ulangi kata sandi",
  automatically_login : "Masuk secara otomatis",
  enforced_password : "Gunakan kata sandi kuat",
  enforced_password_requirements : "Kata sandi Anda harus terdiri dari minimal 8 huruf, satu huruf besar dan satu angka.",
  please_fill_required_form : "Silakan melengkapi semua isian yang diperlukan.",
  next : "Lanjut",
  previous : "Kembali",
  continue_using_livecd : "Lanjut menggunakan sistem dalam moda live",
  install_blankon : "Pasang Xecure",
  exit : "Keluar",
  install : "Pasang Xecure",
  reboot : "Mula Ulang",
  timezone : "Zona Waktu",
  select_drive : "Pilih diska...",
  cancel : "Batal",
  apply : "Terapkan",
  use_as_swap : "gunakan sebagai Swap",
  used : "Sudah digunakan",
  too_small : "Terlalu kecil",
  free_space : "Ruang kosong",
  enter_advanced_mode : "Masuk ke moda mahir",
  you_are_choosing : "Anda memilih",
  to_be_installed_with : "untuk dipasang dengan Xecure.",
  warning : "PERINGATAN",
  your_system_is_not_an_efi : "Sistem komputer Anda tidak dinyalakan pada moda UEFI. Xecure tidak dapat dipasang saat ini.",
  the_selected_partition_will_be_wiped_out : "Partisi terpilih akan dihapus. Partisi Swap akan dibuat jika tidak ada.",
  exit_advanced_mode : "Keluar dari moda mahir",
  are_you_sure_exit_advanced_mode : "Anda yakin ingin keluar dari moda mahir?",
  if_yes_any_step_will_be : "Jika iya, setiap langkah yang sudah dipilih di PartoEdi akan dibatalkan.",
  no : "Tidak",
  yes : "Ya",
  should_one_partition_as_root : "Harus ada satu partisi dengan sistem berkas root.",
  partition : "Partisi",
  file_system : "Sistem berkas",
  mount_point : "Kaitan",
  size : "Ukuran",
  new_partition : "Partisi Baru",
  unallocated : "Belum ditentukan",
  format_as_ext4 : "Format sebagai ext4",
  create : "Buat",
  delete : "Hapus",
  action : "Aksi",
  use_as_home : "Gunakan sebagai /home",
  will_be_ext4 : "Partisi ini akan diformat sebagai sistem berkas ext4.",
  will_be_swap : "Partisi ini akan diformat sebagai sistem berkas swap.",
  new_size : "Ukuran baru",
  partition_type : "Jenis Partisi",
  target_device : "Diska tujuan",
  target_partition : "Partisi tujuan",
  your_system_is_ready : "Sistem Anda sudah siap. Silakan memula ulang untuk masuk ke sistem Anda yang baru.",
  installing_filesystem : "Memasang sistem berkas",
  mounting_filesystem : "Mengkaitkan sistem berkas",
  mounting_home_filesystem : "Mengkaitkan sistem berkas /home",
  copying_filesystem : "Menyalin berkas",
  wipe_disk : "Membersihkan ulang diska",
  setting_up : "Menerapkan pengaturan awal",
  installing_grub : "Memasang GRUB",
  cleaning_up : "Merapikan sistem",
  create_partition : "Buat partisi",
  format_partition : "Format Partisi",
  secure_installation_summary_1 : "Anda telah memilih",
  secure_installation_summary_2 : "sebagai tujuan pemasangan. Seluruh isi diska akan dibersihkan dan diatur ulang untuk mendukung pemasangan terenkripsi.",
  please_enter_passphrase : "Silakan masukkan kata sandi enkripsi : ",
  encryption_passphrase : "Kata sandi enkripsi",
  repeat_encryption_passphrase : "Ulangi kata sandi enkripsi",
  preparing_encrypted_filesystem : "Mempersiapkan sistem berkas terenkripsi",
  please_reboot : "Silakan mula ulang",
  need_to_reboot : "Setengah dari proses pemasangan telah selesai. Anda perlu memula ulang komputer untuk lanjut ke tahap berikutnya."
}
