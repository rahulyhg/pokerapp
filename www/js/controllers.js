angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })


  .controller('HomeCtrl', function ($scope, $stateParams, $ionicPopup, $state) {
    $scope.youlose = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Sorry",
        template: "You Lose",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

    $scope.youwin = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Hurray",
        template: "You Won",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    }

    $scope.fold = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Fold",
        template: "Your cards are folded",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    }
  })

  .controller('DealerCtrl', function ($scope, $stateParams, apiService, $interval) {
    // $interval(function () {
    //   $scope.updatePlayers();
    // }, 5000);
    $scope.updatePlayers = function () {
      apiService.getAll(function (data) {
        // $scope.players = data.data.data.playerCards;
        $scope.communityCards = data.data.data.communityCards;
        $scope.playersChunk = _.chunk(data.data.data.playerCards, 4);
      });
    };

    $scope.updatePlayers();
    $scope.showCards = function () {
      apiService.revealCards(function (data) {
        $scope.updatePlayers();
      });
      //revealCards
    };
    //apiService

    var count = 0;
    var counter = 0;
    $scope.selected = '0-0';

    $scope.currentPlayer = 0;

    $scope.move = function (playerNo) {
      apiService.move(function (data) {
        $scope.updatePlayers();
      });

      $scope.selected = '0-0';
      count++;
      counter = count % 4;
      if (0 < count && count < 4) {
        $scope.selected = 0 + '-' + counter;
      } else if (4 <= count && count < 8) {
        $scope.selected = 1 + '-' + counter;
      } else {
        count = 0;

      }
    };

    $scope.foldUser = function () {
      apiService.fold(function (data) {
        $scope.updatePlayers();
      });
    };
  })

  .controller('TableCtrl', function ($scope, $stateParams, apiService) {
    $scope.table1 = false;
    $scope.clickTable = function () {
      $scope.table1 = !$scope.table1;
    };
    $scope.newGame = function () {
      $scope.winnerData = {};
      apiService.newGame(function (data) {
        $scope.updatePlayers();
      });
    };
    $scope.newGame();
    $scope.updatePlayers = function () {
      apiService.getAll(function (data) {
        $scope.players = [];
        var playerData = data.data.data.playerCards;
        $scope.playerData1 = data.data.data.playerCards;
        var playersArr = _.chunk(data.data.data.playerCards, 4);
        $scope.players = playersArr;
        for (var i = 0; i < playerData.length; i++) {
          if (playerData[i].isDealer) {
            $scope.dealerPlayer = playerData[i].playerNo.toString();
          }
        }
        $scope.communityCards = data.data.data.communityCards;
      });
    };

    $scope.updatePlayers();

    $scope.makeDealer = function (tabId) {
      apiService.makeDealer({
        "tabId": tabId
      }, function (data) {
        $scope.updatePlayers();
      });
    };
    $scope.makeActive = function (tabId, status) {
      if (status) {
        apiService.addTab({
          "tabId": tabId
        }, function (data) {
          $scope.updatePlayers();
        });
      } else {
        apiService.removeTab({
          "tabId": tabId
        }, function (data) {
          $scope.updatePlayers();
        });
      }

      //$scope.$digest();
    };
    $scope.tableclick = 'Table 1';
    $scope.playerIds = [1, 2, 3, 4, 5, 6, 7, 8];
  })

  .controller('WinnerCtrl', function ($scope, $stateParams, apiService) {
    $scope.showWinner = function () {
      apiService.showWinner(function (data) {
        $scope.winnerData = data.data.data;
        $scope.getData();
      });
    };
    $scope.showWinner();
    $scope.getData = function () {
      apiService.getAll(function (data) {
        $scope.players = [];
        var playerData = data.data.data.playerCards;
        $scope.playerData1 = data.data.data.playerCards;
        var playersArr = _.chunk(data.data.data.playerCards, 4);
        $scope.players = playersArr;
        for (var i = 0; i < playerData.length; i++) {
          if (playerData[i].isDealer) {
            $scope.dealerPlayer = playerData[i].playerNo.toString();
          }
        }
        $scope.communityCards = data.data.data.communityCards;
      });
    };

  })