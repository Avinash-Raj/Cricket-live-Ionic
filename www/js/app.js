// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab' : {
          templateUrl: 'templates/home.html'
        }
      }
    })

    .state('tabs.list', {
      url: '/list',
      views: {
        'list-tab' : {
          templateUrl: 'templates/list.html',
          controller: 'ListController'
        }
      }
    })

    .state('tabs.detail', {
      url: '/list/:aId',
      views: {
        'list-tab' : {
          templateUrl: 'templates/detail.html',
          controller: 'DetailsController'
        }
      }
    })

    .state('tabs.calendar', {
      url: '/calendar',
      views: {
        'calendar-tab' : {
          templateUrl: 'templates/calendar.html',
          controller: 'NewsController'
        }
      }
    });


  $urlRouterProvider.otherwise('/tab/home');
})

.controller('NewsController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://cricapi.com/api/cricketNews/').success(function(data) {
      $scope.newsData = data.data;

      $scope.doRefresh =function() {
      $http.get('http://cricapi.com/api/cricketNews/').success(function(data) {
          $scope.calendar = data.data;
          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      $scope.toggleStar = function(item) {
        item.star = !item.star;
      }

    });
}])

.controller('ListController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://cricapi.com/api/cricket/').success(function(data) {
      $scope.matchlist = data.data;
      $scope.whichartist=$state.params.aId;
      $scope.data = { showDelete: false, showReorder: false };

      // $scope.onItemDelete = function(item) {
      //   $scope.artists.splice($scope.artists.indexOf(item), 1);
      // }

      $scope.doRefresh =function() {
      $http.get('http://cricapi.com/api/cricket/').success(function(data) {
          $scope.matchlist = data.data;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      };

    });
}])

.controller('DetailsController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {
    $scope.whichmatch=$state.params.aId;
    $http.get('http://cricapi.com/api/cricketScore', {
      params: {unique_id: $scope.whichmatch}
    }).success(function(data) {
      var match_info = data.score;
      var sc = {};
      var out = match_info.split(/\s*,\s*(?=[^,]*,\s*\d{4}\s*$)/);

      sc.info = out[0];
      sc.day= out[1];
      $scope.score = sc;

      $http.get('http://cricapi.com/api/cricketCommentary', {
        params: {unique_id: $scope.whichmatch}
      }).success(function(data) {
        $scope.commentary = data.commentary.replace(/<.*?>/g, '');
      });

      $scope.doRefresh =function() {
        $http.get('http://cricapi.com/api/cricketScore', {
          params:{unique_id: $scope.whichmatch}
        }).success(function(data1) {
          var ref_info = data1.score;
          var out_1 = ref_info.split(/\s*,\s*(?=[^,]*,\s*\d{4}\s*$)/);
          var sc = {};
          sc.info = out_1[0];
          sc.day = out_1[1];
          $scope.score = sc;
          $scope.$broadcast('scroll.refreshComplete');
        }).error(function(err) {
          alert('Error');
          $scope.error = err;
          alert(err);
        });

        $http.get('http://cricapi.com/api/cricketCommentary', {
          params: {unique_id: $scope.whichmatch}
        }).success(function(data) {
          $scope.commentary = data.commentary.replace(/<.*?>/g, '');
        });

      };

    });

  }]);
