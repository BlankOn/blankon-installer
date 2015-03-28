angular.module("done",[])
.controller("DoneCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])

angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    $rootScope.installationData.lang = lang.id;
    $rootScope.selectedLang = lang.title;
  }
}])

angular.module("install",[])
.controller("InstallCtrl", [
    "$scope", "$window", "$rootScope","$timeout","$interval", 
    function ($scope, $window, $rootScope, $timeout, $interval){
  console.log(JSON.stringify($rootScope.installationData));
    var showError = function(){
      $scope.errorLog = "Error!";
    }
    var updateStatus = function(){
      var status = installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      $scope.progressBarWidth = status.progress;
      if (status.status > 1) {
        console.log("stopped");
        $interval.cancel(statusUpdater);
        if (status.status == 2) {
          console.log("error");
          showError();
        } else {
          console.log("installation finished");
          $rootScope.next();
        }
      }
    }

    var params = "";
    params += "&partition=" + $rootScope.installationData.partition;
    params += "&device=" + $rootScope.installationData.device;
    params += "&hostname=" + $rootScope.installationData.hostname;
    params += "&username=" + $rootScope.installationData.username;
    params += "&fullname=" + $rootScope.installationData.fullname;
    params += "&password=" + $rootScope.installationData.password;
    params += "&language=" + $rootScope.installationData.language;
    params += "&timezone=" + $rootScope.installationData.timezone;
    params += "&keyboard=" + $rootScope.installationData.keyboard;
    params += "&autologin=" + false;
    installation = new Installation(params);
    installation.start();
    $scope.currentStep = "";
    statusUpdater = $interval(updateStatus, 1000);



}])

angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){

  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = (60/100) * $window.innerWidth;
  $scope.selectInstallationTarget = function(deviceId, partition) {
    $rootScope.installationData.device = deviceId;
    $rootScope.installationData.partition = partition.id;
    $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
    for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
      if ($rootScope.selectedDrive.partitions[j].id === partition.id) {
        $rootScope.selectedDrive.partitions[j].selected = true;
        $rootScope.validInstallationTarget = true;
      } else {
        $rootScope.selectedDrive.partitions[j].selected = false;
      }
    }
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      $rootScope.devices = Parted.getDevices();
      $rootScope.devices_ = [
      {
          "path": "/dev/sda",
          "size": 1000204886016,
          "model": "ATA TOSHIBA MQ01ABD1",
          "label": "msdos",
          "partitions": [
              {
                  "id": -1,
                  "parent": -1,
                  "start": 32256,
                  "end": 1048064,
                  "size": 1016320,
                  "type": "DEVICE_PARTITION_TYPE_FREESPACE",
                  "filesystem": "",
                  "description": ""
              },
              {
                  "id": 1,
                  "parent": -1,
                  "start": 1048576,
                  "end": 20972568064,
                  "size": 20971520000,
                  "type": "DEVICE_PARTITION_TYPE_NORMAL",
                  "filesystem": "ext3",
                  "description": "Ubuntu 14.04.1 LTS (14.04)"
              },
              {
                  "id": 2,
                  "parent": -1,
                  "start": 20972568576,
                  "end": 41944088064,
                  "size": 20971520000,
                  "type": "DEVICE_PARTITION_TYPE_NORMAL",
                  "filesystem": "ext4",
                  "description": ""
              },
              {
                  "id": 3,
                  "parent": -1,
                  "start": 41944088576,
                  "end": 62915608064,
                  "size": 20971520000,
                  "type": "DEVICE_PARTITION_TYPE_NORMAL",
                  "filesystem": "ext4",
                  "description": "BlankOn Tambora (Development Branch) (10.0)"
              },
              {
                  "id": 4,
                  "parent": -1,
                  "start": 62915608576,
                  "end": 1000204140032,
                  "size": 937288531968,
                  "type": "DEVICE_PARTITION_TYPE_NORMAL",
                  "filesystem": "ext3",
                  "description": ""
              },
              {
                  "id": -1,
                  "parent": -1,
                  "start": 1000204140544,
                  "end": 1000204885504,
                  "size": 745472,
                  "type": "DEVICE_PARTITION_TYPE_METADATA",
                  "filesystem": "",
                  "description": ""
              }
          ]
      }
    ];  
      $scope.scanning = true;
    }, 1000);
  }
  $scope.setDrive = function(path) {
    $rootScope.validInstallationTarget = false;
    /* $rootScope.devices.forEach(function(drive){ */
    for (i = 0; i < $rootScope.devices.length; i++)
      if ($rootScope.devices[i].path === path) {
        $rootScope.selectedDrive = $rootScope.devices[i];
        $rootScope.selectedDrive.id = i;
        $rootScope.selectedDrive.qualifiedPartitions = [];
        $rootScope.selectedDrive.driveWidth = 16;
        $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
        /* $rootScope.selectedDrive.partitions.forEach(function(p){ */
        for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
          var p = $rootScope.selectedDrive.partitions[j];
          if (p.size <= (0.01*gbSize) ) {
            continue;
          }
          // p.id = j;
          // filter partition to fit requirements
          if ( p.size > minimumPartitionSize
            && (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0)) {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            $rootScope.selectedDrive.qualifiedPartitions.push(p);
          } else {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            p.disabled = true;
            $rootScope.selectedDrive.qualifiedPartitions.push(p);
          }
          if (p.id > 0) {
            
          } else if (p.type.indexOf("FREESPACE") > 0) {
            p.freespace = true;
          }
        }
      }
    } 
  }
])

angular.module("summary",[])
.controller("SummaryCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  $scope.languages = $window.BiLanguage.available();

}])

angular.module("user",[])
.controller("UserCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  $scope.languages = $window.BiLanguage.available();
  $scope.$watch("installationData.hostname", function(value){
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value)
      $scope.installationData.hostname = value.replace(/[^a-zA-Z0-9]/g, "");
    }
  });
  $scope.$watch("installationData.username", function(value){
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value)
      $scope.installationData.username = value.replace(/[^a-zA-Z0-9]/g, "");
    }
  });
  $scope.$watch("installationData.password", function(value){
    $scope.isSamePassword = false;
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value);
      if (value.length >= 8) {
        $scope.validPassword = true;
      } else {
        $scope.passwordStrength = "weak"; 
        $scope.validPassword = false;
      }
      if (value.length >= 8) {
        $scope.passwordStrength = "strong"; 
      }
      if (value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g) && value.length >= 8) {
        $scope.passwordStrength = "veryStrong"; 
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
    if (installationData.hostname && installationData.username && installationData.fullname && validPassword && isSamePassword) {
      $rootScope.next();
    } else {
      $rootScope.personalizationError = true;
    }
  }
}])

'use strict';
angular.module('Biui', [
  "ui.router", 
  "ngAnimate",
  "html",
  "mm.foundation",
  "hello",
  "partition",
  "user",
  "summary",
  "install",
  "done"
])
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

.run([ "$rootScope", "$state", "$stateParams", "$timeout", "$location", 
  function ($rootScope, $state, $stateParams, $timeout, $location) {
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
        name : "Installation Target",
        path : "partition"
      },
      {
        seq : 2,
        step : 3,
        name : "Personalization",
        path : "user"
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
    ]

    $rootScope.goStep = function (seq) {
      /* if (seq < 4) { */
        $rootScope.currentState = seq;
        $location.path($rootScope.steps[seq].path);
      /* } */
    }
    console.log((window.innerWidth*(80/100)));
    /* $(".line").css("height", "800px"); */
    $rootScope.installationData = {};

    $rootScope.states = [
      "hello",
      "partition",
      "user",
      "summary",
      "install",
      "done"
      ];
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
    $rootScope.next = function() {
      $rootScope.back = false;
      $rootScope.forward = true;
        console.log("x", $rootScope.currentState, $rootScope.states.length);
      if ($rootScope.currentState + 1 < $rootScope.states.length) {
        $rootScope.currentState ++;

        var state = $rootScope.states[$rootScope.currentState];
        console.log(state);
        $state.go(state);
      }
    }

    $rootScope.previous = function() {
      $rootScope.back = true;
      $rootScope.forward = false;
      console.log($rootScope.back);
      $timeout(function(){
        if ($rootScope.currentState - 1 >= 0) {
          $rootScope.currentState --;
          $state.go($rootScope.states[$rootScope.currentState], function(){

        });
          $timeout(function(){
            $rootScope.back = false;
            $rootScope.forward = true;
            console.log($rootScope.back);
          }, 1100);
        }
      }, 100);
    }
    $rootScope.exit = function(){
      Installation.shutdown();
    }
    $state.go($rootScope.states[$rootScope.currentState]);
    $rootScope.started = true;
  }
])


