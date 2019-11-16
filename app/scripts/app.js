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

	.when('/permis/see/:id', {
		controller: 'PermisManageSeeCtrl',
		templateUrl: 'views/permis/manage-v3.html',
	})

	.when('/permis/copy', {
		controller: 'PermisCopyCtrl',
		templateUrl: 'views/permis/copy.html',
	})

	.when('/permis/dt', {
		controller: 'PermisDTCtrl',
		templateUrl: 'views/permis/dt.html',
	})


	.when('/permis/managedt/:id', {
		controller: 'PermisManageDTCtrl',
		templateUrl: 'views/permis/manage-v3.html',
	})

	.when('/permis/manage/:id', {
		controller: 'PermisManageCtrl',
		templateUrl: 'views/permis/manage-v3.html',
	})

	.when('/permis/manage-copy/:wor_no/:permis', {
		controller: 'PermisManageCopyCtrl',
		templateUrl: 'views/permis/manage-v3.html',
	})

	.when('/permis/success', {
		templateUrl: 'views/permis/success.html',
	})

	.when('/permis/blank', {
		controller: 'PermisBlankCtrl',
		templateUrl: 'views/permis/manage-v3.html',
	})

}])



.factory('MetiersList', ['SharePoint', function (SharePoint) {
	return new SharePoint.API.List('Metiers ParaChem');
}])

.factory('EntrepreneursList', ['SharePoint', function (SharePoint) {
	return new SharePoint.API.List('Entrepreneurs');
}])

.factory('MasterList', ['SharePoint', function (SharePoint) {
	return new SharePoint.API.List('Liste Maitres Permis');
}])



.controller('HomeCtrl', ['$scope', 'Utils', function ($scope, Utils) {


	$scope.permisTiles = [
		{ title: 'Nouveau', icon: 'fa-plus-circle', href: '#/permis/new', color: 'darkGreen' },
		{ title: 'Copier', icon: 'fa-files-o', href: '#/permis/copy', color: 'darkRed' },
		{ title: 'Consulter', icon: 'fa-question', href: '#/permis/see', color: 'darkBlue' },
		{ title: 'Non-planifiés', icon: 'fa-list', href: '#/permis/dt', color: 'gray' },
		{ title: 'Permis sans DT', icon: 'fa-pencil', href: '#/permis/blank', color: 'black' },
	];


	$scope.openMetiers = function () {
		var url = 'http://intranet/_layouts/15/start.aspx#/Lists/Metiers%20ParaChem/AllItems.aspx';
		Utils.popupWindow(url, 1200, 700, false);		
	};

	$scope.openEntrepreneurs = function () {
		var url = 'http://intranet/_layouts/15/start.aspx#/Lists/Entrepreneurs/AllItems.aspx';
		Utils.popupWindow(url, 1200, 700, false);		
	};

	$scope.openMaitres = function () {
		var url = 'http://intranet/_layouts/15/start.aspx#/Lists/Liste%20Maitres%20Permis/AllItems.aspx';
		Utils.popupWindow(url, 1200, 700, false);		
	};

	$scope.openFiches = function () {
		var url = 'http://parasrv12.parachem.ca:8005';
		Utils.popupWindow(url, 1200, 700, false);		
	};



}])








.controller('PermisNewCtrl', ['$scope', 'API', 'cfpLoadingBar', '$http', function ($scope, API, cfpLoadingBar, $http) {

	$('input[autofocus]').focus();

	cfpLoadingBar.start();
	API.getDailyPermis().success(function (permis) {
		$scope.permis = permis;
		
		$scope.permis.forEach(function (p) {
			$http
			.get('http://parasrv12.parachem.ca:8005/equipementfiche?Equipement_Code=' + p.FUN_CODE)
			.success(function (f) {
				if (f.length > 0) {
					p.fiche = f[0];
				}
			});
			cfpLoadingBar.complete();
		})

	});

}])



.controller('PermisSeeCtrl', ['$scope', 'API', 'cfpLoadingBar', 'Utils', function ($scope, API, cfpLoadingBar, Utils) {

	$('input[autofocus]').focus();


	cfpLoadingBar.start();
	API.getAllPermis().success(function (permis) {
		$scope.permis = permis;
		// window.setTimeout(function () {
		//   $('[data-toggle="tooltip"]').tooltip();
		  cfpLoadingBar.complete();	
		// }, 100);
	});

	// $scope.print = function (id) {
	// 	var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId=' + id + '&CharCode=251';
	// 	Utils.popupWindow(url, 1000, 1000, false);
	// };


}])



.controller('PermisCopyCtrl', ['$scope', 'API', 'cfpLoadingBar', '$modal', '$location', '$http', function ($scope, API, cfpLoadingBar, $modal, $location, $http) {

	$('input[autofocus]').focus();


	cfpLoadingBar.start();
	API.getDailyPermis().success(function (permis) {
		$scope.permis = permis;

		$scope.permis.forEach(function (p) {
			$http
			.get('http://parasrv12.parachem.ca:8005/equipementfiche?Equipement_Code=' + p.FUN_CODE)
			.success(function (f) {
				if (f.length > 0) {
					p.fiche = f[0];
				}
			});
			cfpLoadingBar.complete();
		})


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
				if (window.confirm('Ce permis ne possède pas de copie, voulez-vous en créer un nouveau?')) {
					$location.path('/permis/manage/' + worNo);
				}
			}
		});
	};


}])



.controller('PermisDTCtrl', ['$scope', 'API', 'cfpLoadingBar', 'Utils', '$http', function ($scope, API, cfpLoadingBar, Utils, $http) {

	$('input[autofocus]').focus();


	cfpLoadingBar.start();
	API.get('/permisall/all').success(function (permis) {
		$scope.permis = permis;
		$scope.permis.forEach(function (p) {
			$http
			.get('http://parasrv12.parachem.ca:8005/equipementfiche?Equipement_Code=' + p.FUN_CODE)
			.success(function (f) {
				if (f.length > 0) {
					p.fiche = f[0];
				}
			});
			cfpLoadingBar.complete();
		});
	});

	$scope.showPermis = function (id) {
		var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId=' + id + '&CharCode=251';
		Utils.popupWindow(url, 600, 10);
	};

}])




.controller('PermisManageCtrl', ['$scope', '$routeParams', 'API', 'EntrepreneursList', 'MetiersList', '$rootScope', 'Utils', '$location', 'MasterList', function ($scope, $routeParams, API, EntrepreneursList, MetiersList, $rootScope, Utils, $location, MasterList) {

	$scope.action = 'Création d\'un nouveau permis';

	$scope.today = new Date();

	$scope.permis = {
		S2_OP_OA: true,
		S1_HEURE_DE: '7.00',
		S1_HEURE_A: '17.30',
	};


	$scope.minDate = new Date();


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
			// $scope.permis.S1_HEURE_DE = '7.00';
			// $scope.permis.S1_HEURE_A = '17.30';
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
			var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 600, 10);
			$location.path('/')
		});

	};


	$scope.currentMaster = true;

	$scope.chooseOtherMaster = function () {
		MasterList
		.all('$expand=Maitre&$select=Maitre/Title')
		.then(function (masters) {
			$scope.masters = masters
			// $scope.permis.S8_USERNAME = '';
			$scope.currentMaster = false;
		})
	};

	$scope.chooseCurrentMaster = function () {
		$scope.currentMaster = true;
		$scope.permis.S8_USERNAME = $rootScope.me.get_title();
	};


}])




.controller('PermisManageCopyCtrl', ['$routeParams', '$scope', 'API', '$rootScope', 'Utils', '$location', 'MasterList', function ($routeParams, $scope, API, $rootScope, Utils, $location, MasterList) {

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
			var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 600, 10);
			$location.path('/')
		});
	};


	$scope.currentMaster = true;

	$scope.chooseOtherMaster = function () {
		MasterList
		.all('$expand=Maitre&$select=Maitre/Title')
		.then(function (masters) {
			$scope.masters = masters
			// $scope.permis.S8_USERNAME = '';
			$scope.currentMaster = false;
		})
	};

	$scope.chooseCurrentMaster = function () {
		$scope.currentMaster = true;
		$scope.permis.S8_USERNAME = $rootScope.me.get_title();
	};


}])





.controller('PermisManageDTCtrl', ['$scope', '$routeParams', 'API', 'EntrepreneursList', 'MetiersList', '$rootScope', 'Utils', '$location', 'MasterList',function ($scope, $routeParams, API, EntrepreneursList, MetiersList, $rootScope, Utils, $location, MasterList) {

	$scope.action = 'Création d\'un nouveau permis';

	$scope.today = new Date();

	$scope.permis = {
		S2_OP_OA: true,
		S1_HEURE_DE: '7.00',
		S1_HEURE_A: '17.30',
	};


	$scope.minDate = new Date();

	API.getPermisNumberOnly($routeParams.id)
	.success(function (foundPermis) {
		$scope.permis.NO_PERMIS = ''.concat(foundPermis.length + 1);
		API.getPermisDt($routeParams.id)
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
			var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 600, 10);
			$location.path('/')
		});

	};


	$scope.currentMaster = true;

	$scope.chooseOtherMaster = function () {
		MasterList
		.all('$expand=Maitre&$select=Maitre/Title')
		.then(function (masters) {
			$scope.masters = masters
			// $scope.permis.S8_USERNAME = '';
			$scope.currentMaster = false;
		})
	};

	$scope.chooseCurrentMaster = function () {
		$scope.currentMaster = true;
		$scope.permis.S8_USERNAME = $rootScope.me.get_title();
	};

}])







.controller('PermisBlankCtrl', ['$scope', '$routeParams', 'API', 'EntrepreneursList', 'MetiersList', '$rootScope', 'Utils', '$location', '$http', 'MasterList', function ($scope, $routeParams, API, EntrepreneursList, MetiersList, $rootScope, Utils, $location, $http, MasterList) {

	$scope.action = 'Création d\'un nouveau permis sans DT';

	$scope.today = new Date();

	$scope.pageType = 'blank';
	$scope.minDate = new Date();

	$http
	.get('http://parasrv12.parachem.ca:8003/permis?WSQ_PREF=Z')
	.success(function (permis) {
		$scope.permis = {
			S2_OP_OA: true,
			WOR_NO: '0000',
			WSQ_PREF: 'Z',
			NO_PERMIS: permis.length + 1,
			PERMIS: '0000' + (permis.length + 1),
			S1_HEURE_DE: '7.00',
			S1_HEURE_A: '17.30',

		};		
		$scope.permis.S8_USERNAME = $rootScope.me.get_title();

	})



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
			var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId='.concat(createdPermis.id);
			Utils.popupWindow(url, 600, 10);
			$location.path('/')
		});
	};



	$scope.currentMaster = true;

	$scope.chooseOtherMaster = function () {
		MasterList
		.all('$expand=Maitre&$select=Maitre/Title')
		.then(function (masters) {
			$scope.masters = masters
			// $scope.permis.S8_USERNAME = '';
			$scope.currentMaster = false;
		})
	};

	$scope.chooseCurrentMaster = function () {
		$scope.currentMaster = true;
		$scope.permis.S8_USERNAME = $rootScope.me.get_title();
	};


}])








.controller('PermisManageSeeCtrl', ['$routeParams', '$scope', 'API', '$rootScope', 'Utils', '$location', 'MasterList', function ($routeParams, $scope, API, $rootScope, Utils, $location, MasterList) {


	$scope.action = 'Consultation d\'un permis existant';
	$scope.pageType = 'see';

	$scope.permis = {};

	$scope.isReadOnly = true;

	API.getPermisById($routeParams.id).success(function (foundPermis) {
		$scope.permis = foundPermis;
		$scope.permisDate = Date.parse(foundPermis.S1_DATE_EMISSION);
	});



	$scope.print = function () {
		var url = 'http://paradevsrv02/reportserver?/Permis_V3/permistravailrealprint&rs:Command=Render&rc:Toolbar=true&PermisId=' + $scope.permis.id;
		var open = Utils.popupWindow(url, 1000, 1000, false);
		$location.path('/');

	};

	$scope.currentMaster = true;

}])




.factory('Utils', [function () {

  var service = {};

  service.popupWindow = function (url, width, height, hasFeatures) {
    var screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
    var screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
    var outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.body.clientWidth;
    var outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : (document.body.clientHeight-22);
    var left = window.parseInt(screenX + ((outerWidth - width) / 2), 10);
    var top = window.parseInt(screenY + ((outerHeight - height) / 2.5), 10);
    var features = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

    if (hasFeatures === 'undefined') {
    	hasFeatures = true;
    }

    if (hasFeatures) {
	    features = features.concat(',scrollbars=no,toolbar=no,menubar=no,status=no,location=no,directories=no');
    }

    var newWindow = window.open(url, '', features);

    if (typeof window.focus !== 'undefined') {
      newWindow.focus();
    }

    return newWindow;
  };

  return service;


}]); 





