'use strict';

/**
 * @ngdoc overview
 * @name AngularSharePointApp
 * @description
 * # AngularSharePointApp
 *
 * Main module of the application.
 */

 /*jshint unused:false*/
 /*jshint asi:true*/
 /*global $:true */

angular.module('AngularSharePointApp', ['ngSharePoint', 'ngRoute', 'ngMetro', 'cfp.loadingBar', 'ui.bootstrap'])


.config(['$routeProvider', function ($routeProvider) {

	$routeProvider

	.when('/', {
		controller: 'HomeCtrl',
		templateUrl: 'views/permis/home.html',
	})

	.when('/permis/new', {
		controller: 'PermisNewCtrl',
		templateUrl: 'views/permis/new.html',
	})

	.when('/permis/see', {
		controller: 'PermisSeeCtrl',
		templateUrl: 'views/permis/see.html',
	})

	.when('/permis/copy', {
		controller: 'PermisCopyCtrl',
		templateUrl: 'views/permis/copy.html',
	})

	.when('/permis/dt', {
		controller: 'PermisDTCtrl',
		templateUrl: 'views/permis/dt.html',
	})

	.when('/permis/manage/:id', {
		controller: 'PermisManageCtrl',
		templateUrl: 'views/permis/manage.html',
	})

	.when('/permis/manage-copy/:wor_no/:permis', {
		controller: 'PermisManageCopyCtrl',
		templateUrl: 'views/permis/manage.html',
	})

	.when('/permis/success', {
		templateUrl: 'views/permis/success.html',
	})

}])



.factory('MetiersList', ['SharePoint', function (SharePoint) {
	return new SharePoint.API.List('Metiers ParaChem');
}])

.factory('EntrepreneursList', ['SharePoint', function (SharePoint) {
	return new SharePoint.API.List('Entrepreneurs');
}])



.controller('HomeCtrl', ['$scope', function ($scope) {

	// MetiersList.all('$select=Title').then(function (metiers) {
	// 	console.log(metiers);
	// });

	// EntrepreneursList.all('$select=Title').then(function (ent) {
	// 	console.log(ent);
	// });


	$scope.tiles = [
		{ title: 'Nouveau', icon: 'fa-plus-circle', href: '#/permis/new', color: 'green' },
		{ title: 'Copier', icon: 'fa-files-o', href: '#/permis/copy', color: 'red' },
		{ title: 'Consulter', icon: 'fa-question', href: '#/permis/see', color: 'blue' },
		{ title: 'Non-planifiés', icon: 'fa-list', href: '#/permis/dt', color: 'gray' },
	];

}])



.controller('PermisNewCtrl', ['$scope', 'API', 'cfpLoadingBar', function ($scope, API, cfpLoadingBar) {

	cfpLoadingBar.start();
	API.getDailyPermis().success(function (permis) {
		$scope.permis = permis;
		window.setTimeout(function () {
		  $('[data-toggle="tooltip"]').tooltip();			
		  cfpLoadingBar.complete();
		}, 100);
	});

}])



.controller('PermisSeeCtrl', ['$scope', 'API', 'cfpLoadingBar', 'Utils', function ($scope, API, cfpLoadingBar, Utils) {

	cfpLoadingBar.start();
	API.getAllPermis().success(function (permis) {
		$scope.permis = permis;
		window.setTimeout(function () {
		  $('[data-toggle="tooltip"]').tooltip();
		  cfpLoadingBar.complete();	
		}, 100);
	});

	$scope.print = function (id) {
		var url = 'http://paradevsrv02/reportserver?/permistravail&rs:Command=Render&rc:Toolbar=true&PermisId=' + id;
		Utils.popupWindow(url, 1000, 650);
	};


}])



.controller('PermisCopyCtrl', ['$scope', 'API', 'cfpLoadingBar', '$modal', function ($scope, API, cfpLoadingBar, $modal) {

	cfpLoadingBar.start();
	API.getDailyPermis().success(function (permis) {
		$scope.permis = permis;
		window.setTimeout(function () {
		  $('[data-toggle="tooltip"]').tooltip();			
		  cfpLoadingBar.complete();
		}, 100);
	});

	$scope.open = function (worNo) {

		API.getPermisNumberOnly(worNo).success(function (permisList) {
			if (permisList.length > 0) {
				$modal.open({
					size: 'lg',
					templateUrl: 'views/permis/version.template.html',
					controller: ['$modalInstance', '$scope', '$location', function ($modalInstance, $scope, $location) {

						$scope.list = permisList;

						$scope.cancel = function () {
							$modalInstance.close();
						};

						$scope.goTo = function (permis) {
							$modalInstance.close();
							$location.path('/permis/manage-copy/' + permis.WOR_NO + '/' + permis.PERMIS);
						};

					}],
				});				
			} else {
				window.alert('Ce permis ne possède pas de copie');
			}
		});
	};


}])



.controller('PermisDTCtrl', ['$scope', 'API', 'cfpLoadingBar', 'Utils', function ($scope, API, cfpLoadingBar, Utils) {

	cfpLoadingBar.start();
	API.get('/permisall/all').success(function (permis) {
		$scope.permis = permis;
		window.setTimeout(function () {
		  $('[data-toggle="tooltip"]').tooltip();
		  cfpLoadingBar.complete();	
		}, 100);
	});

	$scope.showPermis = function (id) {
		var url = 'http://paradevsrv02/reportserver?/permistravail&rs:Command=Render&rc:Toolbar=true&PermisId=' + id;
		Utils.popupWindow(url, 1000, 650);
	};

}])




.controller('PermisManageCtrl', ['$scope', '$routeParams', 'API', 'EntrepreneursList', 'MetiersList', '$rootScope', 'Utils', '$location', function ($scope, $routeParams, API, EntrepreneursList, MetiersList, $rootScope, Utils, $location) {

	$scope.action = 'Création d\'un nouveau permis';

	$scope.today = new Date();

	$scope.permis = {
		S2_OP_OA: true,
	};


	$scope.minDate = new Date();

	// EquipmentConditionList.all('$select=Title,Francais,Anglais,Order0,Side&$orderby=Order0').then(function (equipConditions) {
	// 	$scope.conditions = equipConditions;
	// });

	API.getPermisNumberOnly($routeParams.id)
	.success(function (foundPermis) {
		$scope.permis.NO_PERMIS = ''.concat(foundPermis.length + 1);
		API.getPermis($routeParams.id)
		.success(function (permis) {
			if (permis.length < 1) {
				return;
			}
			for (var prop in permis[0]) {
				if (permis[0].hasOwnProperty(prop)) {
					$scope.permis[prop] = permis[0][prop];
				}
			}
			$scope.permis.S1_SECTEUR = permis[0].NIV1_DESCR;
			$scope.permis.PERMIS = $scope.permis.WOR_NO + '-' + $scope.permis.NO_PERMIS;
			$scope.permis.S8_USERNAME = $rootScope.me.get_title();
		});
	});

	$scope.setExec = function () {
		if ($scope.permis.S1_ENTREPRENEURIAT === 'Entrepreneur / contractor') {
			EntrepreneursList.all('$select=Title').then(function (contractors) {
				$scope.execs = contractors;
			});
		} else if ($scope.permis.S1_ENTREPRENEURIAT === 'Parachem') {
			MetiersList.all('$select=Title').then(function (metiers) {
				$scope.execs = metiers;
			});
		}
	};


	$scope.print = function () {
		var day = $scope.today.getDate();
		var year = $scope.today.getFullYear();
		var month = $scope.today.getMonth();

		$scope.permis.S1_DATE_EMISSION = day + '-' + month + '-' + year;

		API.createPermis($scope.permis)
		.success(function (createdPermis) {
			var url = 'http://paradevsrv02/reportserver?/permistravail&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 1000, 650);
			$location.path('/permis/success')
		});

	};


}])




.controller('PermisManageCopyCtrl', ['$routeParams', '$scope', 'API', '$rootScope', 'Utils', '$location', function ($routeParams, $scope, API, $rootScope, Utils, $location) {

	$scope.action = 'Copie d\'un permis existant';
	$scope.pageType = 'copy';
	$scope.today = new Date();

	$scope.permis = {};

	API.getPermisNumberOnly($routeParams.wor_no).success(function (permisList) {
		API.getCopyPermis($routeParams.permis).success(function (foundPermis) {
			$scope.permis = foundPermis[0];
			$scope.permis.NO_PERMIS = ''.concat(permisList.length + 1);
			$scope.permis.PERMIS = $scope.permis.WOR_NO + '-' + $scope.permis.NO_PERMIS;
			$scope.permis.S8_USERNAME = $rootScope.me.get_title();
		});
	});


	$scope.print = function () {
		var day = $scope.today.getDate();
		var year = $scope.today.getFullYear();
		var month = $scope.today.getMonth();

		$scope.permis.S1_DATE_EMISSION = day + '-' + month + '-' + year;
		delete $scope.permis.id;
		delete $scope.permis.createdAt;
		delete $scope.permis.updatedAt;

		API.createPermis($scope.permis)
		.success(function (createdPermis) {
			var url = 'http://paradevsrv02/reportserver?/permistravail&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 1000, 650);
			$location.path('/permis/success')
		});

	};

}])












  .factory('Utils', [function () {

    var service = {};

    service.popupWindow = function (url, width, height) {
      var screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
      var screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
      var outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.body.clientWidth;
      var outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : (document.body.clientHeight-22);
      var left = window.parseInt(screenX + ((outerWidth - width) / 2), 10);
      var top = window.parseInt(screenY + ((outerHeight - height) / 2.5), 10);
      var features = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
      features = features.concat(',scrollbars=no,toolbar=no,menubar=no,status=no,location=no,directories=no');

      var newWindow = window.open(url, '', features);

      if (typeof window.focus !== 'undefined') {
        newWindow.focus();
      }

      return newWindow;
    };

    return service;


  }]); 



// .filter('copiedPermisFilter', function() {
//   return function (input) {
//     return input.PERMIS 
//   };
// });










