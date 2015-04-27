angular.module("done",[])
.controller("DoneCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
      $scope.reboot = function(){
        console.log("reboot");
        $rootScope.installation.reboot;
      };


}])

angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
      $scope.languages = $window.BiLanguage.available();
    
      $scope.setLanguage = function(lang) {
        console.log(lang);
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
      console.log("error");
      $scope.error = true;
    }
    var updateStatus = function(){
      var status = $rootScope.installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
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
    console.log(params);
    $rootScope.installation = new Installation(params);
    $rootScope.installation.start();
    $scope.currentStep = "";
    statusUpdater = $interval(updateStatus, 1000);



}])

angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){


  /* function ctrl($scope) { */
  /* } */
  
  $scope.advancedPartition = false;
  $scope.actionDialog = false;
  $scope.title = "Installation Target";
  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = 600;
  var partitionState = {
    mountpoint: {
      root : "",
      home : ""
    },
    stateIndex : 0,
    history : [],
      /* action : "", */
      /* prevState : [], */
      /* currentState : [] */
  }
  $scope.switchToAdvancedPartition = function(){
    $scope.advancedPartition = true;
    $scope.title = "PartoEdi";
    console.log($scope.selectedDrive.partitionList);
    // avoid two way binding
    partitionState.history.push({action:"initial", state:angular.copy($scope.selectedDrive.partitionList)});
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    console.log(partitionState);
  }
  $scope.undo = function(){
    if (partitionState.stateIndex > 0) {
      partitionState.currentState = angular.copy(partitionState.history[(partitionState.stateIndex-1)].state);
      $scope.selectedDrive.partitionList = angular.copy(partitionState.history[(partitionState.stateIndex-1)].state);
      console.log($scope.selectedDrive.partitionList);
      partitionState.stateIndex--;
      console.log(partitionState);
      $scope.undoHistory = true;
    }
  }
  $scope.redo = function(){
    if ($scope.undoHistory && partitionState.history[(partitionState.stateIndex+1)]) {
      partitionState.currentState = angular.copy(partitionState.history[(partitionState.stateIndex+1)].state);
      $scope.selectedDrive.partitionList = angular.copy(partitionState.history[(partitionState.stateIndex+1)].state);
      console.log($scope.selectedDrive.partitionList);
      partitionState.stateIndex++;
      console.log(partitionState);
    }
  }
  $scope.switchToSimplePartition = function(){
    $scope.advancedPartition = false;
    $scope.title = "Installation Target";
  }
  $scope.selectInstallationTarget = function(deviceId, partition) {
    console.log(partition.id)
    if (partition.id < 0) {
      partition.id = 0;
      console.log(partition.id)
    }
    $rootScope.installationData.device = deviceId;
    $rootScope.installationData.partition = partition.id;
    $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
    for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
      if ($rootScope.selectedDrive.partitions[j].id === partition.id) {
        if (!$rootScope.selectedDrive.partitions[j].disallow) {
          $rootScope.selectedDrive.partitions[j].selected = true;
          $rootScope.validInstallationTarget = true;
        }
      } else {
        $rootScope.selectedDrive.partitions[j].selected = false;
      }
    }
  }
  $scope.createSliderValue = "0;100";
  $scope.createSliderOptions = {       
    from: 0,
    to: 100,
    step: 1,
  };
  $scope.highlight = function(partition) {
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].highlighted = true;
  }
  $scope.unhighlight = function(partition) {
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].highlighted = false;
  }
  $scope.partitionCreate = function(partition) {
    $scope.createDialog = true;
    $scope.actionDialog = true;
    $scope.createDialogSelected = partition;
    $scope.createDialogSelected.index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.createDialogSelected.sizeOrigin = angular.copy($scope.createDialogSelected.size);
    $scope.createDialogSelected.startOrigin = angular.copy($scope.createDialogSelected.start);
    $scope.createDialogSelected.endOrigin = angular.copy($scope.createDialogSelected.end);
    $scope.createDialogSelected.sizeGbOrigin = angular.copy($scope.createDialogSelected.sizeGb);
  }
  $scope.$watch("createSliderValue", function(value){
    console.log(value);
    var val = value.split(";");
    var offset = val[0];
    var percentage = val[1]-val[0];
    console.log(percentage);
    var start = $scope.createDialogSelected.startOrigin; 
    var end = $scope.createDialogSelected.endOrigin; 
    /* var size = $scope.createDialogSelected.size; */
    $scope.createDialogSelected.size = $scope.createDialogSelected.sizeOrigin*(percentage/100);
    $scope.createDialogSelected.sizeGb = (($scope.createDialogSelected.sizeOrigin/gbSize)*(percentage/100)).toFixed(2);
    $scope.createDialogSelected.percentage = percentage;

  });
  $scope.partitionCreateApply = function(partition){
    console.log(partition);
    console.log(partition.percentage);
    /* if (!partition.percentage || partition.percentage === 100) { */
    /* } */
    // calculate new ID
    $scope.selectedDrive.partitionList[partition.index] = angular.copy(partition);
    $scope.selectedDrive.partitionList[partition.index].type = "DEVICE_PARTITION_TYPE_NORMAL";
    $scope.selectedDrive.partitionList[partition.index].filesystem = "ext4";
    $scope.selectedDrive.partitionList[partition.index].freespace = false;
    $scope.selectedDrive.partitionList[partition.index].normal = true;
    $scope.selectedDrive.partitionList[partition.index].id = 3;
    if ($scope.undoHistory) {
      partitionState.history.splice(index);
    }
    partitionState.history.push({action:"create", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    partitionState.stateIndex++;
    console.log(partitionState);
    $scope.createDialog = false;
    $scope.actionDialog = false;
  }
  $scope.partitionCreateCancel = function(){
    $scope.createDialog = false;
    $scope.actionDialog = false;
  }
  $scope.partitionDelete = function(partition) {
    /* angular.forEach($scope.selectedDrive.partitionList, function(p){ */
    /*   if (p.start === partition.start) { */
        var p = partition;
        var index = $scope.selectedDrive.partitionList.indexOf(partition);
        if (
          $scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
          $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
          ) {
          console.log("hola ganda");
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size + $scope.selectedDrive.partitionList[(index+1)].size;
          var size = $scope.selectedDrive.partitionList[(index-1)].size;
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[(index+1)].end;
          $scope.selectedDrive.partitionList[(index-1)].hidden = false;
          $scope.selectedDrive.partitionList[(index-1)].freespace = true;
          $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,2);
        } else if (
            ($scope.selectedDrive.partitionList[(index+1)] && 
            $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
            $scope.selectedDrive.partitionList[(index+1)].type != "DEVICE_PARTITION_TYPE_FREESPACE") ||
            (!$scope.selectedDrive.partitionList[(index+1)] && 
            $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE") 
          ) {
          console.log("hola awal");
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[index].end;
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size;
          var size = $scope.selectedDrive.partitionList[(index-1)].size;
          $scope.selectedDrive.partitionList[(index-1)].hidden = false;
          $scope.selectedDrive.partitionList[(index-1)].freespace = true;
          $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,1);
        } else if (
          $scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
          $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
          ) {
          console.log("hola akhir");
          $scope.selectedDrive.partitionList[(index+1)].start = $scope.selectedDrive.partitionList[index].start;
          $scope.selectedDrive.partitionList[(index+1)].size += $scope.selectedDrive.partitionList[index].size;
          var size = $scope.selectedDrive.partitionList[(index+1)].size;
          $scope.selectedDrive.partitionList[(index+1)].hidden = false;
          $scope.selectedDrive.partitionList[(index+1)].freespace = true;
          $scope.selectedDrive.partitionList[(index+1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index+1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,1);
        } else {
          console.log("hola else");
          $scope.selectedDrive.partitionList[index].type = "DEVICE_PARTITION_TYPE_FREESPACE"; 
          $scope.selectedDrive.partitionList[index].id = -1;
          $scope.selectedDrive.partitionList[index].filesystem = "";
          $scope.selectedDrive.partitionList[index].description = "";
          $scope.selectedDrive.partitionList[index].freespace = true;
        }
        $timeout(function(){
          if ($scope.undoHistory) {
            partitionState.history.splice(index);
          }
          partitionState.history.push({action:"delete", state:angular.copy($scope.selectedDrive.partitionList)});
          $scope.undoHistory = false;
          partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
          partitionState.stateIndex++;
          console.log(partitionState);
        }, 100);
      /* } */
    /* }); */
  }
  $scope.partitionFormat = function(partition) {
    console.log("format");
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].format = true;
    if ($scope.undoHistory) {
      partitionState.history.splice(index);
    }
    partitionState.history.push({action:"format", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    partitionState.stateIndex++;
    console.log(partitionState);
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      $rootScope.devices = Parted.getDevices();
      /* $rootScope.devices_ = [{"path":"/dev/sda","size":53687091200,"model":"ATA VBOX HARDDISK","label":"msdos","partitions":[{"id":-1,"parent":-1,"start":32256,"end":1048064,"size":1016320,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":15570304512,"size":15569256448,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":2,"parent":-1,"start":15570305024,"end":17780702720,"size":2210398208,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":17780703232,"end":27044871680,"size":9264168960,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":3,"parent":-1,"start":27044872192,"end":53687090688,"size":26642219008,"type":"DEVICE_PARTITION_TYPE_EXTENDED","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872192,"end":27044872192,"size":512,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872704,"end":27045920256,"size":1048064,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":5,"parent":-1,"start":27045920768,"end":50703891968,"size":23657971712,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":50703892480,"end":50704940544,"size":1048576,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":6,"parent":-1,"start":50704941056,"end":53687090688,"size":2982150144,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""}],"$$hashKey":"00T"}]; */
      $scope.scanning = true;
    }, 1000);
  }
  $scope.setDrive = function(path) {
    console.log(JSON.stringify($rootScope.devices));
    $rootScope.validInstallationTarget = false;
    /* $rootScope.devices.forEach(function(drive){ */
    for (i = 0; i < $rootScope.devices.length; i++)
      if ($rootScope.devices[i].path === path) {
        $rootScope.selectedDrive = $rootScope.devices[i];
        $rootScope.selectedDrive.id = i;
        $rootScope.selectedDrive.partitionList = [];
        $rootScope.selectedDrive.driveWidth = 8;
        $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
        /* $rootScope.selectedDrive.partitions.forEach(function(p){ */
        for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
          var p = $rootScope.selectedDrive.partitions[j];
          $rootScope.selectedDrive.partitionList.push(p);
          // filter partition to fit requirements
          if ( 
            (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0) && p.size > (0.01*gbSize)) {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            p.normal = true;
            if (p.type.indexOf("LOGICAL") > 0) {
              p.logical = true;
            } 
            if (p.size < minimumPartitionSize) {
              p.disallow = true;
            }
            if (p.id < 1 && p.type.indexOf("FREESPACE") > 0) {
              p.freespace = true;
            }
          } else {
            if (p.type.indexOf("EXTENDED") > 0) {
              p.extended = true;
              console.log("extended!");
            } else {
              p.hidden = true;
            } 
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

}])

angular.module("timezone",[])
.controller("TimezoneCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope, $watch){

      $("area, timezone-next").click(function(){
        $rootScope.installationData.timezone = $("select").val();
        console.log($rootScope.installationData);
      });
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
  "ngSlider",
  "html",
  "mm.foundation",
  "hello",
  "timezone",
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
        name : "Personalization",
        path : "user"
      },
      {
        seq : 4,
        step : 5,
        name : "Installation Summary",
        path : "summary"
      },
      {
        seq : 5,
        step : 6,
        name : "Installing...",
        path : ""
      },
      {
        seq : 6,
        step : 7,
        name : "Finish`",
        path : ""
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
          /* $timeout(function(){ */
            /* $rootScope.back = false; */
            /* $rootScope.forward = true; */
            /* console.log($rootScope.back); */
          /* }, 1100); */
        }
      }, 100);
    }
    $rootScope.exit = function(){
      Installation.shutdown();
    }
    $timeout(function(){
      console.log($(window).width());
      // Fix layout according to screen size
      $(".page").css("width", ($(window).width()*(70/100)).toString() + "px");
      $(".content").css("height", ($(window).height()*(70/100)).toString() + "px !important");
      $(".page").css("margin-left", ($(window).width()*(7/100)).toString() + "px");
      $(".line").css("height", ($(window).height()*(72/100)).toString() + "px");
      $(".line").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step-container").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step").css("margin-bottom", (($(window).height()*(12/100))-10).toString() + "px");
      $(".step-big").css("margin-bottom", (($(window).height()*(12/100))-30).toString() + "px");
      $state.go($rootScope.states[$rootScope.currentState]);
      $rootScope.started = true;
    }, 500);
    $timeout(function(){
      $rootScope.showStepLine = true;
    }, 1000);
  }
])


