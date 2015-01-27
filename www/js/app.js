angular.module('omg', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('BarcodeController', function($scope, $cordovaBarcodeScanner) {
  document.addEventListener("deviceready", function () {
    $scope.code = 0;
    $scope.scan = function() {
        $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          $scope.code = barcodeData.text;
        }, function(error) {
          alert("error!");
        });
    };
  }, false);
});
