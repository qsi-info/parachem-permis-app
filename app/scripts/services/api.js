'use strict';


 /*jshint unused:false*/
 /*jshint asi:true*/



angular.module('AngularSharePointApp')

.factory('API', ['$http', function ($http) {

	// var server = 'http://localhost:1337';
	var server = 'http://parasrv12.parachem.ca:8001';

	var service = {};

	service.get = function (request) {
		return $http.get(server.concat(request));
	};

	service.getDailyPermis = function () {
		return $http.get(server.concat('/dailypermis/all'));
	};

	service.getAllPermis = function () {
		return $http.get(server.concat('/permisview/all'));
	};

	service.getPermis = function (worNo) {
		return $http.get(server.concat('/dailypermis?WOR_NO=' + worNo))
	};

	service.getPermisNumberOnly = function (worNo) {
		return $http.get(server.concat('/permisonlynumber?WOR_NO=' + worNo));
	};

	service.createPermis = function (payload) {
		return $http.post(server.concat('/permis'), payload);
	};

	service.getCopyPermis = function (permisNo) {
		return $http.get(server.concat('/permis?PERMIS=' + permisNo));
	};


	return service;

}])