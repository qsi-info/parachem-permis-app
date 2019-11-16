'use strict';


 /*jshint unused:false*/
 /*jshint asi:true*/



angular.module('AngularSharePointApp')

	.factory('API', ['$http', function ($http) {

		var server = 'http://parasrv12.parachem.ca:8003';

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

		service.getPermisDt = function (worNo) {
			return $http.get(server.concat('/permisall?WOR_NO=' + worNo))
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

		service.getPermisById = function (id) {
			return $http.get(server.concat('/permis/' + id));
		};

		return service;

	}])