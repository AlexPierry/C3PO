SERVER_URL = "http://localhost/restaurante"

var app = angular.module("restaurante", ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider.
		when('/', {templateUrl:'html/principal.html', controller:'pedidosCtrl'}).
		when('/pedidos', {templateUrl:'html/pedidos.html', controller:'pedidosCtrl'}).
		when('/sobre', {templateUrl:'html/sobre.html', controller:'pedidosCtrl'}).
		otherwise({redirectTo:'/'});
});

app.run(function($rootScope) {
	$rootScope.cadastroLocalizado = false;

	//Uma flag que define se o ícone de acesso ao servidor deve estar ativado
	$rootScope.showLoaderFlag = false;

	//Força que o ícone de acesso ao servidor seja ativado
	$rootScope.showLoader = function () {
		$rootScope.showLoaderFlag = true;
	};
	
	//Força que o ícone de acesso ao servidor seja desativado
	$rootScope.hideLoader = function () {
		$rootScope.showLoaderFlag = false;
	};

	//Método que retorna a URL completa de acesso ao servidor.
	// Evita usar concatenação no conteroller
	$rootScope.server = function (url) {
		return SERVER_URL + url;
	};
});