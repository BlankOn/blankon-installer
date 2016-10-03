angular.module("done",[])
.controller("DoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

    $scope.reboot = function(){
      console.log("reboot");
      Installation.reboot();
    };
}])

angular.module("hello",[])
.controller("HelloCtrl", ["$scope", "$window", "$rootScope", "$translate",
  function ($scope, $window, $rootScope, $translate){
    
    $rootScope.contentHeight = $rootScope.contentHeight || ($(window).height()*(87/100)).toString() + "px"; 
    $(".content").css("height", $rootScope.contentHeight);

    $scope.languages = [
      { id: "en_US.utf8", title: "English US" },
      { id: "id_ID.utf8", title: "Bahasa Indonesia" },
    ];
    $scope.setLanguage = function(lang) {
      console.log(lang);
      $rootScope.installationData.lang = lang.id;
      $rootScope.selectedLang = lang.title;
      $translate.use(lang.id);
      if (window.Installation) {
        Installation.setLocale(lang.id);
      }
    }
    if (window.Installation) {
      $rootScope.isEfi = parseInt(Installation.isEfi())==1 ? true : false;
      $rootScope.isESPExists = Installation.isESPExists()=='true' ? true : false ;
      $rootScope.isBiosBootExists = Installation.isBiosBootExists()=='true' ? true : false;
      $rootScope.debug = Installation.debug()=='true' ? true : false;
      $rootScope.autofill = Installation.autofill()=='true' ? true : false;
      $rootScope.scenario = Installation.getScenario();
    }

    if ($rootScope.autofill) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
    }

    $scope.setLanguage($scope.languages[0]);
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
   
    // password value got reset after next(). Refill it.
    if ($rootScope.autofill) {
      $rootScope.installationData.password = 'test';
    }

    var params = "";
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
    if (
      (!$rootScope.isEfi && $rootScope.currentPartitionTable === 'gpt' && !$rootScope.isBiosBootExists) ||
      ($rootScope.isEfi && $rootScope.currentPartitionTable === 'gpt' && !$rootScope.isESPExists)
    ) {
      // The installer will create one.
      params += "&createESPPartition=true";
    }
    if ($rootScope.cleanInstall) {
      params += "&cleanInstall=true";
      if ($rootScope.isEfi) {
        // There is no EFI partition. Instaler will create one;
        params += "&efiPartition=false";
      }
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
   
    $scope.cleanInstall = false;
    $scope.slider = {
    	start : 0,
    	end : 1.0,
    	currentMode : 'start',
    	currentMiddle : 0,
    	windowRelativeStart : 60,
    	windowRelativeEnd : 50,
    }
    $scope.slidebarInit = function() {
    	$scope.slider.start = 0;
    	$scope.slider.end = 1.0;
      $scope.slider.bar = document.getElementById('bar');
      $scope.slider.slider = document.getElementById('slider');
      $scope.slider.bar.addEventListener('mousedown', $scope.slider.startSlide, false); 
      $scope.slider.bar.addEventListener('mouseup', $scope.slider.stopSlide, false);
      
      $scope.slider.slider.style.marginLeft = ($scope.slider.start & 100) + '%';
      $scope.slider.slider.style.width = ($scope.slider.end * 100) + '%';
    }
    $scope.slider.startSlide = function(event) {
		  	
			if ($scope.updating) return;
			$scope.updating = true;
	
      var set_perc = ((((event.clientX - $scope.slider.windowRelativeStart - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
    	$scope.slider.currentMiddle = ((parseFloat($scope.slider.end)-parseFloat($scope.slider.start))/2) + parseFloat($scope.slider.start);
      if (set_perc <= $scope.slider.currentMiddle) {
        set_perc = ((((event.clientX - $scope.slider.windowRelativeStart + 4 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
    		console.log('$scope.slider.start side');
        currentMode = '$scope.slider.start';
        $scope.slider.slider.style.width = ((parseFloat($scope.slider.end)-parseFloat(set_perc)) * 100) + '%';
        $scope.slider.slider.style.marginLeft = (parseFloat(set_perc) * 100) + '%';
      } else {
        set_perc = ((((event.clientX - $scope.slider.windowRelativeEnd - 3 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
    		console.log('$scope.slider.end side');
        currentMode = '$scope.slider.end';
        $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
        $scope.slider.slider.style.width = ((parseFloat(set_perc) - parseFloat($scope.slider.start)) * 100) + '%';
      }
      $scope.slider.bar.addEventListener('mousemove', $scope.slider.moveSlide, false);  
    }
    $scope.slider.moveSlide = function(event) {
      if (event.clientX > 542) {
        return $scope.slider.stopSlide(event);
      } 
      if (event.clientX < 66) {
        return $scope.slider.stopSlide(event);
      }
      var set_perc = ((((event.clientX - $scope.slider.windowRelativeStart - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
      if (currentMode === '$scope.slider.start') {
        set_perc = ((((event.clientX - $scope.slider.windowRelativeStart + 4 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
        $scope.slider.slider.style.width = ((parseFloat($scope.slider.end)-parseFloat(set_perc)) * 100) + '%';
        $scope.slider.slider.style.marginLeft = (parseFloat(set_perc) * 100) + '%';
      } else if (currentMode === '$scope.slider.end') {
        set_perc = ((((event.clientX - $scope.slider.windowRelativeEnd - 3 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
        $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
        $scope.slider.slider.style.width = ((parseFloat(set_perc) - parseFloat($scope.slider.start)) * 100) + '%';
      }
    }
    $scope.slider.stopSlide = function(event){
      
      console.log(event.clientX);

			$scope.updatingTimeout = $timeout(function(){ $scope.updating = false; }, 200);
			
			var clientX = event.clientX;
      if (clientX > 543) {
        clientX = 542;
      } 
      if (clientX < 66) {
        clientX = 66;
      }

      var set_perc = ((((clientX - $scope.slider.windowRelativeStart - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
			console.log('stopSlide ' + set_perc);
      $scope.slider.bar.removeEventListener('mousemove', $scope.slider.moveSlide, false);
      if (currentMode === '$scope.slider.start') {
        set_perc = ((((clientX - $scope.slider.windowRelativeStart + 4 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
        $scope.slider.slider.style.width = ((parseFloat($scope.slider.end)-parseFloat(set_perc)) * 100) + '%';
        $scope.slider.slider.style.marginLeft = (parseFloat(set_perc) * 100) + '%';
        $scope.slider.start = parseFloat(set_perc);
      } else if (currentMode === '$scope.slider.end') {
        set_perc = ((((clientX - $scope.slider.windowRelativeEnd - 3 - $scope.slider.bar.offsetLeft) / $scope.slider.bar.offsetWidth)));
        $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
        $scope.slider.slider.style.width = ((parseFloat(set_perc) - parseFloat($scope.slider.start)) * 100) + '%';
        $scope.slider.end = parseFloat(set_perc);
      }
			console.log('slider start ' + $scope.slider.start);
			console.log('slider end ' + $scope.slider.end);

      // Allow createSliderValue to be updated
			$scope.updating = false;

    	$scope.createSliderValue = ($scope.slider.start * 100) + ';' + ($scope.slider.end * 100);
    	$scope.$apply();
    }

    /*
    There are 4 basic action for the current version of partoedi :
    - Delete
    - Create
    - Format
    - Mountpoint

    ## Some important notes : 

    partitionState scope is contains this object :

    { 
      currentState :            // Object of current partition state, it contains the layout of partition and other important attributes
      history : Array,          // An array of partition state(s) to support redo/undo capability
      stateIndex : Number,      // The state sequence in history. if an undo performed, it should decreased by 1, otherwise, increased by 1
      mountpoint : {            // Set a string if these special partition has been settled up
        root : String or null,
        home : String or null,
        swap : String or null
      }
    }

    */
  
    $scope.actionDialog = false;
    $scope.title = "Installation Target";
    var gbSize = 1073741824;
    var minimumPartitionSize = 4 * gbSize;
    var driveBlockWidth = 600;
    
    $scope.partitionSimpleNext = function(){
      console.log($rootScope.selectedInstallationTarget);
      console.log($scope.cleanInstall);
      if ($rootScope.selectedInstallationTarget || $scope.cleanInstall) {
        $rootScope.cleanInstall = $scope.cleanInstall;
        $rootScope.next(); 
      }
    }
  
    


    $scope.switchToAdvancedPartition = function(){
      // reset selected target
      $rootScope.validInstallationTarget = false;
      $rootScope.selectedInstallationTarget = false;
      for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
        $rootScope.selectedDrive.partitions[j].selected = false;
        console.log("false!");
      }
      $rootScope.installationData.partition = null;
  
      $rootScope.advancedPartition = true;
      $scope.title = "PartoEdi";
      console.log($scope.selectedDrive.partitionList);
      // avoid two way binding
      $rootScope.partitionState.history.push({action:"initial", state:angular.copy($scope.selectedDrive.partitionList)});
      $rootScope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
      console.log($rootScope.partitionState);
    }
    $scope.undo = function(){
      if ($rootScope.partitionState.stateIndex > 0) {
        $rootScope.partitionState.currentState = angular.copy($rootScope.partitionState.history[($rootScope.partitionState.stateIndex-1)].state);
        $scope.selectedDrive.partitionList = angular.copy($rootScope.partitionState.history[($rootScope.partitionState.stateIndex-1)].state);
        console.log($scope.selectedDrive.partitionList);
        $rootScope.partitionState.stateIndex--;
        console.log($rootScope.partitionState);
        $scope.undoHistory = true;
      }
      // check mountpoint
      $rootScope.partitionState.mountPoint.root = false;
      $rootScope.partitionState.mountPoint.home = false;
      for (var i = 0;i < $rootScope.selectedDrive.partitionList.length;i++) {
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/") {
          if ($rootScope.selectedDrive.partitionList[i].id > 0) {
            $rootScope.partitionState.mountPoint.root = $rootScope.selectedDrive.path + $rootScope.selectedDrive.partitionList[i].id;
          } else {
            $rootScope.partitionState.mountPoint.root = "newly created partition";
          }
        }
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/home") {
          if ($rootScope.selectedDrive.partitionList[i].id > 0) {
            $rootScope.partitionState.mountPoint.home = $rootScope.selectedDrive.path + $rootScope.selectedDrive.partitionList[i].id;
          } else {
            $rootScope.partitionState.mountPoint.home = "newly created partition";
          }
        }
      }
    }
    $scope.redo = function(){
      if ($scope.undoHistory && $rootScope.partitionState.history[($rootScope.partitionState.stateIndex+1)]) {
        $rootScope.partitionState.currentState = angular.copy($rootScope.partitionState.history[($rootScope.partitionState.stateIndex+1)].state);
        $scope.selectedDrive.partitionList = angular.copy($rootScope.partitionState.history[($rootScope.partitionState.stateIndex+1)].state);
        console.log($scope.selectedDrive.partitionList);
        $rootScope.partitionState.stateIndex++;
        console.log($rootScope.partitionState);
      }
      // check mountpoint
      $rootScope.partitionState.mountPoint.root = false;
      $rootScope.partitionState.mountPoint.home = false;
      for (var i = 0;i < $rootScope.selectedDrive.partitionList.length;i++) {
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/") {
          if ($rootScope.selectedDrive.partitionList[i].id > 0) {
            $rootScope.partitionState.mountPoint.root = $rootScope.selectedDrive.path + $rootScope.selectedDrive.partitionList[i].id;
          } else {
            $rootScope.partitionState.mountPoint.root = "newly created partition";
          }
        }
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/home") {
          if ($rootScope.selectedDrive.partitionList[i].id > 0) {
            $rootScope.partitionState.mountPoint.home = $rootScope.selectedDrive.path + $rootScope.selectedDrive.partitionList[i].id;
          } else {
            $rootScope.partitionState.mountPoint.home = "newly created partition";
          }
        }
      }
    }
    $scope.switchToSimplePartitionWarning = function(){
      $scope.exitAdvancedModeMessage = true;
    }
    $scope.switchToSimplePartition = function(){
      $rootScope.partitionState.mountPoint.root = false;
      $rootScope.partitionState.mountPoint.home = false;
      $scope.exitAdvancedModeMessage = false;
      $rootScope.advancedPartition = false;
      $scope.title = "Installation Target";
      $rootScope.partitionState.currentState = angular.copy($rootScope.partitionState.history[0].state);
      $scope.selectedDrive.partitionList = angular.copy($rootScope.partitionState.history[0].state);
      $rootScope.partitionState.stateIndex = 0;
    }
    $scope.hidePartoEdiMessage = function(){
      $scope.exitAdvancedModeMessage = false;
      $scope.applyAdvancedModeMessage = false;
    }
    $scope.selectInstallationTarget = function(partition) {
      console.log(partition)
      if (!partition.disallow) {
        $rootScope.installationData.partition = $rootScope.selectedDrive.partitionList.indexOf(partition);
        if (partition.id > 0) {
          $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
        } else {
          $rootScope.selectedInstallationTarget = "a freespace partition";
        }
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
    $scope.createDialogSelected = {};
    $scope.partitionCreate = function(partition) {
      // if primary/extended has reach the limit (4), abort this function.
      var primExt = 0;
      for (var i = 0; i < $scope.selectedDrive.partitionList.length;i++) {
        if ($scope.selectedDrive.partitionList[i].type === "DEVICE_PARTITION_TYPE_NORMAL" || 
        $scope.selectedDrive.partitionList[i].type === "DEVICE_PARTITION_TYPE_EXTENDED") {
          primExt++;
        }
      }
      console.log("primext " + primExt);
      if (primExt < 4 || partition.logicalFreespace) {
        $scope.createSliderValue = "0;100";
        console.log("dialog");
        console.log(partition);
        $scope.createDialog = true;
        $scope.actionDialog = true;
        $scope.createDialogSelected = angular.copy(partition);
        $scope.createDialogSelected.index = $scope.selectedDrive.partitionList.indexOf(partition);
        $scope.createDialogSelected.sizeOrigin = angular.copy($scope.createDialogSelected.size);
        $scope.createDialogSelected.startOrigin = angular.copy($scope.createDialogSelected.start);
        $scope.createDialogSelected.endOrigin = angular.copy($scope.createDialogSelected.end);
        $scope.createDialogSelected.sizeGbOrigin = angular.copy($scope.createDialogSelected.sizeGb);
        $scope.createDialogSelected.blockWidthOrigin = angular.copy($scope.createDialogSelected.blockWidth);
        clearTimeout($scope.updatingTimeout); 
        $timeout(function(){
				  $scope.slidebarInit();
        }, 500)
      }
    }
    var percentage;
    $scope.$watch("createSliderValue", function(value){
			if ($scope.updating) return;
			$scope.updating = true;
			$scope.updatingTimeout = $timeout(function(){ $scope.updating = false; }, 200);

			console.log('watch createSliderValue');
      console.log(value);
      var val = value.split(";");
      var offset = val[0];
      percentage = val[1]-val[0];
      console.log(percentage);
      var start = $scope.createDialogSelected.startOrigin; 
      var end = $scope.createDialogSelected.endOrigin; 
      var size = $scope.createDialogSelected.size;
      var sizeOrigin = $scope.createDialogSelected.sizeOrigin;

			// Update values
      $scope.createDialogSelected.start = start + Math.round(sizeOrigin*(parseFloat(val[0])/100));
      $scope.createDialogSelected.end = end - Math.round(sizeOrigin*((100-parseFloat(val[1]))/100));
      $scope.createDialogSelected.size = $scope.createDialogSelected.end - $scope.createDialogSelected.start;
      $scope.createDialogSelected.sizeGb = ($scope.createDialogSelected.size/gbSize).toFixed(2);
      $scope.createDialogSelected.sizeGbBefore = (Math.round(sizeOrigin*(parseFloat(val[0])/100))/gbSize).toFixed(2);
      $scope.createDialogSelected.sizeGbAfter = (Math.round(sizeOrigin*((100-parseFloat(val[1]))/100))/gbSize).toFixed(2);
      $scope.createDialogSelected.percentage = percentage;
    });
		$scope.$watch("createDialogSelected.sizeGb", function(value) {
			if ($scope.updating) return;
			$scope.updating = true;
			$scope.updatingTimeout = $timeout(function(){ $scope.updating = false; }, 200);
			
			console.log('watch sizeGb');
			console.log(value);
			// Measure the percentage
			var percentage = (((value*gbSize)/$scope.createDialogSelected.sizeOrigin) * 100);
			if (percentage > 100) {
				percentage = 100;
			}
			// keep start, but update end
			$scope.slider.end = ((parseFloat($scope.slider.start)*100) + (parseFloat(percentage))) / 100;
      if ($scope.slider.end > 1) {
        $scope.slider.start += $scope.slider.end 
        $scope.slider.end = 1;
      }
			
			// Update slider
      $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
      $scope.slider.slider.style.width = (parseFloat($scope.slider.end) - parseFloat($scope.slider.start)) * 100 + '%';

			// Update values
			var value = parseFloat($scope.slider.start)*100 + ';' + parseFloat($scope.slider.end)*100;
			var val = value.split(";");
      var offset = val[0];
      percentage = val[1]-val[0];
      var start = $scope.createDialogSelected.startOrigin; 
      var end = $scope.createDialogSelected.endOrigin; 
      var size = $scope.createDialogSelected.size;
      var sizeOrigin = $scope.createDialogSelected.sizeOrigin;

      $scope.createDialogSelected.start = start + Math.round(sizeOrigin*(parseFloat(val[0])/100));
      $scope.createDialogSelected.end = end - Math.round(sizeOrigin*((100-parseFloat(val[1]))/100));
      $scope.createDialogSelected.size = $scope.createDialogSelected.end - $scope.createDialogSelected.start;
      /* $scope.createDialogSelected.sizeGb = ($scope.createDialogSelected.size/gbSize).toFixed(2); */
      $scope.createDialogSelected.sizeGbBefore = (Math.round(sizeOrigin*(parseFloat(val[0])/100))/gbSize).toFixed(2);
      $scope.createDialogSelected.sizeGbAfter = (Math.round(sizeOrigin*((100-parseFloat(val[1]))/100))/gbSize).toFixed(2);
      $scope.createDialogSelected.percentage = percentage;
    	$scope.createSliderValue = ($scope.slider.start * 100) + ';' + ($scope.slider.end * 100);
		});
		$scope.$watch("createDialogSelected.sizeGbAfter", function(value) {
			if ($scope.updating) return;
			$scope.updating = true;
			$scope.updatingTimeout = $timeout(function(){ $scope.updating = false; }, 200);
			
			console.log('watch sizeGbAfter');
			console.log(value);
			// Measure the percentage
			var percentage = (((value*gbSize)/$scope.createDialogSelected.sizeOrigin) * 100);
			percentage = 100 - percentage;
			if (percentage > 100) {
				percentage = 100;
			}
			// keep start, but update end
			$scope.slider.end = parseFloat(percentage) / 100;
			
			// Update slider
      $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
      $scope.slider.slider.style.width = (parseFloat($scope.slider.end) - parseFloat($scope.slider.start)) * 100 + '%';

			// Update values
			var value = parseFloat($scope.slider.start)*100 + ';' + parseFloat($scope.slider.end)*100;
			var val = value.split(";");
      var offset = val[0];
      percentage = val[1]-val[0];
      var start = $scope.createDialogSelected.startOrigin; 
      var end = $scope.createDialogSelected.endOrigin; 
      var size = $scope.createDialogSelected.size;
      var sizeOrigin = $scope.createDialogSelected.sizeOrigin;

      $scope.createDialogSelected.start = start + Math.round(sizeOrigin*(parseFloat(val[0])/100));
      $scope.createDialogSelected.end = end - Math.round(sizeOrigin*((100-parseFloat(val[1]))/100));
      $scope.createDialogSelected.size = $scope.createDialogSelected.end - $scope.createDialogSelected.start;
      $scope.createDialogSelected.sizeGb = ($scope.createDialogSelected.size/gbSize).toFixed(2);
      $scope.createDialogSelected.sizeGbBefore = (Math.round(sizeOrigin*(parseFloat(val[0])/100))/gbSize).toFixed(2);
      /* $scope.createDialogSelected.sizeGbAfter = (Math.round(sizeOrigin*((100-parseFloat(val[1]))/100))/gbSize).toFixed(2); */
      $scope.createDialogSelected.percentage = percentage;
    	$scope.createSliderValue = ($scope.slider.start * 100) + ';' + ($scope.slider.end * 100);
		});
		$scope.$watch("createDialogSelected.sizeGbBefore", function(value) {
			if ($scope.updating) return;
			$scope.updating = true;
			$scope.updatingTimeout = $timeout(function(){ $scope.updating = false; }, 200);
			
			console.log('watch sizeGbBefore');
			console.log(value);
			// Measure the percentage
			var percentage = 100 - (((value*gbSize)/$scope.createDialogSelected.sizeOrigin) * 100);
			percentage = 100 - percentage;
			if (percentage > 100) {
				percentage = 100;
			}
			// keep end, but update start
			$scope.slider.start = parseFloat(percentage) / 100;
			
			// Update slider
      $scope.slider.slider.style.marginLeft = (parseFloat($scope.slider.start) * 100) + '%';
      $scope.slider.slider.style.width = (parseFloat($scope.slider.end) - parseFloat($scope.slider.start)) * 100 + '%';

			// Update values
			var value = parseFloat($scope.slider.start)*100 + ';' + parseFloat($scope.slider.end)*100;
			var val = value.split(";");
      var offset = val[0];
      percentage = val[1]-val[0];
      var start = $scope.createDialogSelected.startOrigin; 
      var end = $scope.createDialogSelected.endOrigin; 
      var size = $scope.createDialogSelected.size;
      var sizeOrigin = $scope.createDialogSelected.sizeOrigin;

      $scope.createDialogSelected.start = start + Math.round(sizeOrigin*(parseFloat(val[0])/100));
      $scope.createDialogSelected.end = end - Math.round(sizeOrigin*((100-parseFloat(val[1]))/100));
      $scope.createDialogSelected.size = $scope.createDialogSelected.end - $scope.createDialogSelected.start;
      $scope.createDialogSelected.sizeGb = ($scope.createDialogSelected.size/gbSize).toFixed(2);
      /* $scope.createDialogSelected.sizeGbBefore = (Math.round(sizeOrigin*(parseFloat(val[0])/100))/gbSize).toFixed(2); */
      $scope.createDialogSelected.sizeGbAfter = (Math.round(sizeOrigin*((100-parseFloat(val[1]))/100))/gbSize).toFixed(2);
      $scope.createDialogSelected.percentage = percentage;
    	$scope.createSliderValue = ($scope.slider.start * 100) + ';' + ($scope.slider.end * 100);
		});


    $scope.partitionCreateApply = function(partition){
      var step = {
        action : "create",
      }
      //disabled class doesnt work well click event, validate again
      if ((partition.type === "DEVICE_PARTITION_TYPE_NORMAL" && partition.mountPoint) || partition.type === "DEVICE_PARTITION_TYPE_EXTENDED" || (partition.logicalFreespace && partition.mountPoint)) {
        if (partition.logicalFreespace) var logical = true;
        console.log("apply");
        console.log(partition);
        var mountPoint;
        if (partition.mountPoint === "/") {
          $rootScope.partitionState.mountPoint.root = "newly created partition";
          mountPoint = "root";
        } else if (partition.mountPoint === "/home") {
          $rootScope.partitionState.mountPoint.home = "newly created partition";
          mountPoint = "home";
        } else if (partition.mountPoint === "swap") {
          $rootScope.partitionState.mountPoint.swap = "newly created partition";
          mountPoint = "swap";
        } 
        $scope.selectedDrive.partitionList[partition.index] = angular.copy(partition);
        $scope.selectedDrive.partitionList[partition.index].new = true;
        if (partition.type != "DEVICE_PARTITION_TYPE_EXTENDED") {
          // if it is created from logicalFreespace, flag them as logical
          if (partition.logicalFreespace) {
            step.action += ";logical";
            $scope.selectedDrive.partitionList[partition.index].logical = true;
            // and tell the parent that they has a child
            /* if ($rootScope.selectedDrive.hasExtended) { */
              for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
                if ($rootScope.selectedDrive.partitionList[k].extended &&
                partition.start >= $rootScope.selectedDrive.partitionList[k].start &&
                partition.end <= $rootScope.selectedDrive.partitionList[k].end &&
                $rootScope.selectedDrive.partitionList[k].type != "DEVICE_PARTITION_TYPE_FREESPACE"
                ) {
                  $rootScope.selectedDrive.partitionList[k].hasChild = true;
                }
              }
            /* } */
          } else {
            step.action += ";normal";
          }
          $scope.selectedDrive.partitionList[partition.index].filesystem = "ext4";
          $scope.selectedDrive.partitionList[partition.index].normal = true;
          $scope.selectedDrive.partitionList[partition.index].freespace = false;
          $scope.selectedDrive.partitionList[partition.index].format = true;
          $scope.selectedDrive.partitionList[partition.index].blockWidth = parseInt(((partition.size/partition.sizeOrigin)*partition.blockWidth));
        } else {
          step.action += ";extended";
          $scope.selectedDrive.partitionList[partition.index].freespace = false;
          $scope.selectedDrive.partitionList[partition.index].extended = true;
          $scope.selectedDrive.partitionList[partition.index].normal = false;
          // create freespace under this extended partition range
          var extendedFreespace = {
            type : "DEVICE_PARTITION_TYPE_FREESPACE",
            freespace : true,
            normal : true,
            new : true,
            logicalFreespace : true,
            hidden : false,
            start : partition.start,
            end : partition.end,
            size : partition.end - partition.start,
            sizeGb : ((partition.end - partition.start)/gbSize).toFixed(2),
            id : -1,
          }
          extendedFreespace.blockWidth = parseInt(((partition.size/partition.sizeOrigin)*partition.blockWidth));
          $scope.selectedDrive.partitionList.splice((partition.index+1),0, extendedFreespace);
          $scope.selectedDrive.partitionList[partition.index].blockWidth = 0;
        }
        // if there is a freespace before newly created partition, then set it as valid freespace
        if (parseInt($scope.createSliderValue.split(";")[0]) > 0 ) {
          before = {
            type : "DEVICE_PARTITION_TYPE_FREESPACE",
            freespace : true,
            normal : false,
            hidden : false,
            start : partition.startOrigin,
            end : partition.start - 1,
            size : ($scope.selectedDrive.partitionList[partition.index].start - 1) - $scope.selectedDrive.partitionList[partition.index].startOrigin,
            sizeGb : ((($scope.selectedDrive.partitionList[partition.index].start - 1) - $scope.selectedDrive.partitionList[partition.index].startOrigin)/gbSize).toFixed(2),
            id : -1,
            blockWidth : (($scope.createSliderValue.split(";")[0]/100)*partition.blockWidthOrigin),
          }
          if (logical) before.logicalFreespace = true;
          $scope.selectedDrive.partitionList.splice((partition.index),0, before)
        }
        // or, after...
        if ((100 - parseInt($scope.createSliderValue.split(";")[1])) > 0 ) {
          after = {
            type : "DEVICE_PARTITION_TYPE_FREESPACE",
            freespace : true,
            normal : false,
            hidden : false,
            end : partition.endOrigin,
            start : partition.end + 1,
            size : partition.endOrigin - (partition.end + 1),
            sizeGb : ((partition.endOrigin - (partition.end + 1))/gbSize).toFixed(2),
            id : -1,
            blockWidth : (((100-$scope.createSliderValue.split(";")[1])/100)*partition.blockWidthOrigin),
          }
          if (logical) after.logicalFreespace = true;
          console.log("after");
          console.log(after);
          var afterIndex = partition.index;
          if (partition.type === "DEVICE_PARTITION_TYPE_EXTENDED") {
            afterIndex++;
          }
          if (parseInt($scope.createSliderValue.split(";")[0]) > 0 ) {
            afterIndex += 2;
          } else {
            afterIndex++;
          }
          $scope.selectedDrive.partitionList.splice(afterIndex,0, after);
        }
    
        var index = $scope.selectedDrive.partitionList.indexOf(partition);
        if ($scope.undoHistory) {
          $rootScope.partitionState.history.splice($rootScope.partitionState.stateIndex+1);
        }
        step.state = angular.copy($scope.selectedDrive.partitionList);
        if (mountPoint === "swap") {
          step.action += ";linux-swap";
        } else {
          step.action += ";ext4";
        }
        step.action += ";" + partition.start + "-" + partition.end;
        if (mountPoint) {
          step.action += ";" + mountPoint;
        }
        $rootScope.partitionState.history.push(step);
        $scope.undoHistory = false;
        $rootScope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
        $rootScope.partitionState.stateIndex++;
        console.log($rootScope.partitionState);
        $scope.createDialog = false;
        $scope.actionDialog = false;
      }
    }
    // end of partitionCreateApply
  
    $scope.partitionCreateCancel = function(){
      $scope.createDialog = false;
      $scope.actionDialog = false;
    }
    $scope.partitionDelete = function(partition) {
      var step = {
        action : "delete;"+ partition.id,
      }
      console.log(partition);
      var p = partition;
      var index = $scope.selectedDrive.partitionList.indexOf(partition);
      var extended = false;
      if (p.extended) {
        extended = true;
        step.action += ";extended";
        partition.extended = false;
        partition.freespace = true;
        partition.type = "DEVICE_PARTITION_TYPE_FREESPACE";
        partition.id = -1;
        for (var i = 0; i < $rootScope.selectedDrive.partitionList.length; i++) {
          var current = $rootScope.selectedDrive.partitionList[i];
          if (current.type != "DEVICE_PARTITION_TYPE_EXTENDED" &&
          current.start != partition.start &&
          current.start >= p.start &&
          current.end <= p.end) {
            $rootScope.selectedDrive.partitionList.splice(i,1);
            i = 0;
          }
        }
      }
      // if the deleted partition is a logical, check if there is another sibling
      // if so, tell the parent
      if (p.logical) {
        for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
          if ($rootScope.selectedDrive.partitionList[k].extended) {
            // reset
            $rootScope.selectedDrive.partitionList[k].hasChild = false;
            // loop through the whole partitionList
            for (var i = 0; i < $rootScope.selectedDrive.partitionList.length; i++) {
              var current = $rootScope.selectedDrive.partitionList[i];
              if (current.type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
              current.type != "DEVICE_PARTITION_TYPE_EXTENDED" &&
              current.start != partition.start &&
              current.start >= $rootScope.selectedDrive.partitionList[k].start &&
              current.end <= $rootScope.selectedDrive.partitionList[k].end) {
                $rootScope.selectedDrive.partitionList[k].hasChild = true;
              }
            }
          }
        }
      }

      if (
        $scope.selectedDrive.partitionList[(index+1)] && 
        $scope.selectedDrive.partitionList[(index-1)] && 
        $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
        $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
      ) {
        // the prev and next partition of this partition are freespace. merge them.
        console.log('// the prev and next partition of this partition are freespace. merge them.');
        //////////////////////
        if (extended) {
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size;
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[index].end;
        } else {
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size + $scope.selectedDrive.partitionList[(index+1)].size;
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[(index+1)].end;
        }
        var size = $scope.selectedDrive.partitionList[(index-1)].size;
        $scope.selectedDrive.partitionList[(index-1)].hidden = false;
        $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        $scope.selectedDrive.partitionList[(index-1)].freespace = true;
        $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index-1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index-1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,2);
      } else if (
        ($scope.selectedDrive.partitionList[(index+1)] && 
        $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE") 
      ) {
        // the next partition of this partition are freespace. merge them.
        console.log('// the next partition of this partition are freespace. merge them.');
        if (extended) {
          $scope.selectedDrive.partitionList[index].size += $scope.selectedDrive.partitionList[(index+1)].size;
          $scope.selectedDrive.partitionList[index].end = $scope.selectedDrive.partitionList[(index+1)].end;
        } else {
          $scope.selectedDrive.partitionList[index].size += $scope.selectedDrive.partitionList[(index+1)].size;
          $scope.selectedDrive.partitionList[index].end = $scope.selectedDrive.partitionList[(index+1)].end;
        }
        var size = $scope.selectedDrive.partitionList[index].size;
        $scope.selectedDrive.partitionList[index].hidden = false;
        $scope.selectedDrive.partitionList[index].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        if ($scope.selectedDrive.partitionList[(index+1)].freespace) {
        }

        $scope.selectedDrive.partitionList[index].freespace = true;
        $scope.selectedDrive.partitionList[index].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[index].logicalFreespace = true;
          $scope.selectedDrive.partitionList[index].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice((index+1),1);
      } else if (
      $scope.selectedDrive.partitionList[(index-1)] && 
      ($scope.selectedDrive.partitionList[(index+1)] && 
      $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
      $scope.selectedDrive.partitionList[(index+1)].type != "DEVICE_PARTITION_TYPE_FREESPACE") ||
      (!$scope.selectedDrive.partitionList[(index+1)] && 
      $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE") 
      ) {
        // the prev partition of this partition is free spacei, the next is exists.
        console.log('// the prev partition of this partition is free space, the next is exists.')
        $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[index].end;
        $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size;
        var size = $scope.selectedDrive.partitionList[(index-1)].size;
        $scope.selectedDrive.partitionList[(index-1)].hidden = false;
        $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        $scope.selectedDrive.partitionList[(index-1)].freespace = true;
        $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index-1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index-1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,1);
      } else if (
      $scope.selectedDrive.partitionList[(index-1)] && 
      $scope.selectedDrive.partitionList[(index+1)] && 
      $scope.selectedDrive.partitionList[(index-1)].type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
      $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
      ) {
        // the next partition of this partition is free space, the prev is exists.
        console.log('// the next partition of this partition is free space, the prev is exists.');
        $scope.selectedDrive.partitionList[(index+1)].start = $scope.selectedDrive.partitionList[index].start;
        // if it is an extended partition, the next is a logical freespace. it should be sliced without merging the size
        if (!extended) {
          $scope.selectedDrive.partitionList[(index+1)].size += $scope.selectedDrive.partitionList[index].size;
        }
        var size = $scope.selectedDrive.partitionList[(index+1)].size;
        $scope.selectedDrive.partitionList[(index+1)].hidden = false;
        $scope.selectedDrive.partitionList[(index+1)].freespace = true;
        $scope.selectedDrive.partitionList[(index+1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        $scope.selectedDrive.partitionList[(index+1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index+1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index+1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,1);
      } else {
        console.log('else, just make this partitition a freespace');
        $scope.selectedDrive.partitionList[index].type = "DEVICE_PARTITION_TYPE_FREESPACE"; 
        $scope.selectedDrive.partitionList[index].id = -1;
        $scope.selectedDrive.partitionList[index].filesystem = "";
        $scope.selectedDrive.partitionList[index].description = "";
        $scope.selectedDrive.partitionList[index].freespace = true;
      }
      $timeout(function(){
        if ($scope.undoHistory) {
          /* $rootScope.partitionState.history.splice(index); */
          $rootScope.partitionState.history.splice($rootScope.partitionState.stateIndex+1);
        }
        step.state = angular.copy($scope.selectedDrive.partitionList);
        $rootScope.partitionState.history.push(step);
        $scope.undoHistory = false;
        $rootScope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
        $rootScope.partitionState.stateIndex++;
        console.log($rootScope.partitionState);
      }, 400);
    }
    $scope.partitionFormat = function(partition) {
      console.log(partition);
      formatIndex = $scope.selectedDrive.partitionList.indexOf(partition);
      $scope.formatDialogSelected = angular.copy(partition);
      $scope.formatDialog = true;
      $scope.actionDialog = true;
    }
    $scope.partitionFormatApply = function(partition) {
      $scope.selectedDrive.partitionList[formatIndex] = angular.copy(partition);
      $scope.selectedDrive.partitionList[formatIndex].format = true;
      if ($scope.undoHistory) {
        /* $rootScope.partitionState.history.splice(formatIndex); */
        $rootScope.partitionState.history.splice($rootScope.partitionState.stateIndex+1);
      }
      // example : "format;2;ext4;/home"
      var step = {
        action:"format", 
        state:angular.copy($scope.selectedDrive.partitionList)
      }
      step.action += ";" + partition.id;
      if (partition.mountPoint === "swap") {
        step.action += ";linux-swap"; 
      } else {
        step.action += ";ext4";
        if (partition.mountPoint === "/") {
          $rootScope.partitionState.mountPoint.root = $rootScope.selectedDrive.path + partition.id;
          step.action +=";root";
        } else if (partition.mountPoint === "/home") {
          $rootScope.partitionState.mountPoint.home = $rootScope.selectedDrive.path + partition.id;
          step.action +=";home";
        }
      }
      $timeout(function(){
        if ($scope.undoHistory) {
          $rootScope.partitionState.history.splice($rootScope.partitionState.stateIndex+1);
        }
        step.state = angular.copy($scope.selectedDrive.partitionList);
        $rootScope.partitionState.history.push(step);
        $scope.undoHistory = false;
        $rootScope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
        $rootScope.partitionState.stateIndex++;
        console.log($rootScope.partitionState);
        $scope.formatDialog = false;
        $scope.actionDialog = false;
      }, 100);
    }
  
    $scope.partitionFormatCancel = function() {
      $scope.formatDialog = false;
      $scope.actionDialog = false;
    }
    
    $scope.partitionMountAsHome = function(partition) {
      var index = $scope.selectedDrive.partitionList.indexOf(partition);
      $scope.selectedDrive.partitionList[index] = angular.copy(partition);
      $scope.selectedDrive.partitionList[index].mountPoint = "/home";
      if ($scope.undoHistory) {
        $rootScope.partitionState.history.splice(index);
      }
      var step = {
        action:"home", 
        state:angular.copy($scope.selectedDrive.partitionList)
      }
      $rootScope.partitionState.mountPoint.home = $rootScope.selectedDrive.path + partition.id;
      step.action += ";" + partition.id + ";" + partition.filesystem;
  
      if ($scope.undoHistory) {
        $rootScope.partitionState.history.splice($rootScope.partitionState.stateIndex+1);
      }
      step.state = angular.copy($scope.selectedDrive.partitionList);
      $rootScope.partitionState.history.push(step);
      $scope.undoHistory = false;
      $rootScope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
      $rootScope.partitionState.stateIndex++;
      console.log($rootScope.partitionState);
      $scope.formatDialog = false;
      $scope.actionDialog = false;
    }
  
    $scope.partitionApply = function() {
      if ($rootScope.partitionState.mountPoint.root) {
        $rootScope.partitionSteps = [];
        // Avoid duplicated step
        var tmp = [];
        for (var i in $rootScope.partitionState.history) {
          if (tmp.indexOf($rootScope.partitionState.history[i].action) > -1) {
            $rootScope.partitionState.history.splice(i, 1);
          } else {
            tmp.push($rootScope.partitionState.history[i].action);
          }
        }
        for (var i = 1; i < $rootScope.partitionState.history.length; i++) {
          $rootScope.partitionSteps[i-1] = $rootScope.partitionState.history[i].action;
        }
        console.log($rootScope.partitionSteps);
        $rootScope.next();
      } else {
        //should shout a warning
        $scope.applyAdvancedModeMessage = true;
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
        /* Other example with existing EFI partition

[{"path":"/dev/sda","size":8589934592,"model":"ATA VBOX HARDDISK","label":"gpt","partitions":[{"id":-1,"parent":-1,"start":17408,"end":1048064,"size":1031168,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":104857600,"size":103809536,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"","description":""},{"id":2,"parent":-1,"start":104858112,"end":1178598912,"size":1073741312,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"linux-swap(v1)","description":""},{"id":3,"parent":-1,"start":1178599424,"end":8589917184,"size":7411318272,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":8589917696,"end":8589934080,"size":16896,"type":"DEVICE_PARTITION_TYPE_METADATA","filesystem":"","description":""}],"$$hashKey":"00Q"}]i
        */


        $scope.scanning = true;
      }, 1000);
    }
    $scope.setDrive = function(drive) {
      // TODO : reset UI
      var path = drive.path;
      $rootScope.currentPartitionTable = drive.label;
      $rootScope.installationData.device = $rootScope.devices.indexOf(drive);
      $rootScope.installationData.device_path = path;
      // If it's not a GPT and booted up on UEFI system, do the clean install
      $scope.cleanInstall = ($rootScope.currentPartitionTable !== 'gpt' && $rootScope.isEfi);
      console.log(JSON.stringify($rootScope.devices));
      $rootScope.validInstallationTarget = false;
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
      
      // BIFT
  
      if ($rootScope.scenario && $rootScope.scenario.length > 0) {
        var scenario = JSON.parse($rootScope.scenario);
        console.log('Scenario');
        console.log(scenario);
        var keys = Object.keys(scenario.data);
        for (var i in keys) {
          $rootScope.installationData[keys[i]] = scenario.data[keys[i]];
          console.log($rootScope.installationData[keys[i]]);
          // Some values are not included in installationData object, catch it
          if (keys[i] === 'cleanInstall' || keys[i] === 'partitionSteps' || keys[i] === 'advancedPartition') {
            $rootScope[keys[i]] = scenario.data[keys[i]]
          }
        }
        $rootScope.next();
      }
    }

])

angular.module("summary",[])
.controller("SummaryCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);
    
    if ($rootScope.autofill) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
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
    
    if ($rootScope.autofill) {
      $rootScope.installationData.hostname = 'test';
      $rootScope.installationData.fullname = 'test';
      $rootScope.installationData.username = 'test';
      $rootScope.installationData.password = 'test';
      $rootScope.installationData.repeatPassword = 'test';
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
    }
}])

angular.module("timezone",[])
.controller("TimezoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope, $watch){
    
    $(".content").css("height", $rootScope.contentHeight);

    $("area, timezone-next").click(function(){
      $rootScope.installationData.timezone = $("select").val();
      console.log($rootScope.installationData);
    });
    
    if ($rootScope.autofill) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
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
  "user",
  "summary",
  "install",
  "done"
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

.run([ "$rootScope", "$state", "$stateParams", "$timeout", "$location", "$translate",
  function ($rootScope, $state, $stateParams, $timeout, $location, $translate) {
    if (window.Installation) {
      $rootScope.release = Installation.getRelease();
    }
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
    $timeout(function(){
      console.log($(window).width());
      // Fix layout according to screen size
      $(".page").css("width", ($(window).width()*(70/100)).toString() + "px");
      $(".page").css("margin-left", "24px");
      $(".line").css("height", ($(window).height()*(72/100)).toString() + "px");
      $(".line").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step-container").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step").css("margin-bottom", (($(window).height()*(12/100))-10).toString() + "px");
      $(".step-big").css("margin-bottom", (($(window).height()*(12/100))-30).toString() + "px");
      $state.go($rootScope.states[$rootScope.currentState]);
      $rootScope.started = true;
    }, 250);
    $timeout(function(){
      $rootScope.showStepLine = true;
    }, 1000);
  }
])



var en = {
  welcome_to_program : "Welcome to BlankOn installation program.",
  installation_finish : "Installation Finish.",
  installation_error_occured : "Installation Error Occured.",
  please_take_look : "Please take a look at installion log : /var/log/blankon-installer.log",
  installation : "Installation",
  please_wait_system_scanned : "Please wait while your sistem is being scanned...",
  please_choose_partition : "Please choose the partition on device below which you would like to install BlankOn into or use advanced partitioning tool for more control.",
  install_partition : "Installation Target",
  installation_summary : "Installation Summary",
  install_summary_info : "This is our installation summary. Please proceed if you're agree. Beyond this point, the installer will make changes to your system and you can't go.",
  personalization : "Personalization",
  please_enter_personalization : "Please enter your personalization preference below...",
  computer_name : "Computer Name",
  full_name : "Your Name",
  username : "Username",
  password : "password",
  repeat_password : "Repeat Password",
  automatically_login : "Automatically login",
  enforced_password : "Enforce strong password",
  enforced_password_requirements : "Your password must contain at least 8 letters, a capital, and a numeric",
  please_fill_required_form : "Please fill all the required form.",
  next : "Next",
  previous : "Previous",
  continue_using_livecd : "Continue using live CD",
  install_blankon : "Install BlankOn",
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
  to_be_installed_with : "to bee installed with BlankOn.",
  warning : "WARNING",
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
  setting_up : "Setting up",
  installing_grub : "Installing GRUB",
  cleaning_up : "Cleaning up",
  create_partition : "Create partition",
  format_partition : "Format Partition",
  partitioning_in_advancedMode : "Partitioning",
}

var id = {
  welcome_to_program : "Selamat datang di program pemasang BlankOn.",
  installation_finish : "Pemasangan selesai.",
  installation_error_occured : "Terjadi galat saat pemasangan",
  please_take_look : "Silakan lihat di log pemasangan : /var/log/blankon-installer.log",
  installation : "Pemasangan",
  please_wait_system_scanned : "Sistem sedang dipindai...",
  please_choose_partition : "Silakan pilih partisi pada diska di bawah ini untuk memasang BlankOn atau gunakan pemartisi untuk kontrol lebih.",
  install_partition : "Tujuan pemasangan",
  installation_summary : "Ringkasan Pemasangan",
  install_summary_info : "Ini adalah ringkasan pemasangan. Lanjutkan jika Anda setuju. Setelah ini, Pemasang akan membuat perubahan pada sistem Anda dan Anda tidak dapat membatalkannya.",
  personalization  : "Personalisasi",
  please_enter_personalization : "Masukkan preferensi personal Anda di bawah ini ...",
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
  install_blankon : "Pasang BlankOn",
  exit : "Keluar",
  install : "Pasang BlankOn",
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
  to_be_installed_with : "untuk dipasang dengan BlankOn.",
  warning : "PERINGATAN",
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
  setting_up : "Menerapkan pengaturan awal",
  installing_grub : "Memasang GRUB",
  cleaning_up : "Merapikan sistem",
  create_partition : "Buat partisi",
  format_partition : "Format Partisi",
  partitioning_in_advancedMode : "Mengatur Partisi",
}
