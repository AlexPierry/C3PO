app.controller("pedidosCtrl", function($scope, $rootScope, $http){
	$scope.dataAtual = new Date();

	$scope.loadFuncionarios = function(){
		if (!$rootScope.funcionarios)
		{
			$scope.showLoader();
			$http.get($scope.server("/funcionarios/" +  "funcionarios.json")).success(function(data){
				$rootScope.funcionarios = data.funcionario;
				$scope.hideLoader();
			});
		}			
	}

	$scope.loadProdutos = function(){
		$scope.showLoader();
		$http.get($scope.server("/produtos/" +  "produtos.json")).success(function(data){
			$rootScope.produtos = data.produto;
			$scope.hideLoader();
		});		
	}

	$scope.setFuncionario = function(funcionario)
	{
		$rootScope.funcionario = funcionario;
	}

	$scope.incluirPedido = function(){
		$scope.showLoader();
		var pedido = new Object();
		pedido.status = "A";
		pedido.vlTotalPedido = 0.00;
		pedido.dataPedido = new Date();
		pedido.cliente = $rootScope.cliente;
		pedido.funcionario = $rootScope.funcionario;
		pedido.itensPedido = [];

		//$http.post($scope.server("/pedidos/" + $rootScope.cliente.cpf + ".json"), pedido).success(function(data){
			$rootScope.pedidos.push(pedido); //data.pedido);
			$rootScope.pedido = pedido;//data.pedido;
			$scope.hideLoader();
		//});				
		//$scope.formPedidos.$setPristine(true);
	}

	$scope.localizarCliente = function(cpf){
		$scope.showLoader();
		$http.get($scope.server("/clientes/" + cpf + ".json")).then(
			function(response){
				if (response.data.cpf) {
					$rootScope.cadastroLocalizado = true;
					$rootScope.cliente = response.data;
					$scope.cpfNaoEncontrado = false;
					$scope.loadPedidos();
				}
				else
				{				
					$scope.cpfNaoEncontrado = true;
				}
			},
			// ERROR 
			function(data){
				if (!data.success)
					$scope.cpfNaoEncontrado = true;
			}
		);
	}

	$scope.loadPedidos = function(){
		$scope.showLoader();
		$http.get($scope.server("/pedidos/" + $rootScope.cliente.cpf + ".json")).success(function(data){
			$rootScope.pedidos = data.pedidos;
			$scope.hideLoader();
		});		
	}

	$scope.visualizarPedido = function(pedido){
		$rootScope.pedido = pedido;
		$scope.showFormPedido();
	}

	$scope.adicionarItemPedido = function(itemPedido)
	{
		itemPedido.idPedido = $rootScope.pedido.idPedido;
		$scope.showLoader();
		//$http.post($scope.server("/pedidos/" + cpfCliente + "/" + itemPedido.idPedido + "/" + itemPedido.idProduto)).success(function(data){
			$rootScope.pedido.itensPedido.push(angular.copy(itemPedido));
			$rootScope.pedido.vlTotalPedido += itemPedido.quantidade * itemPedido.produto.vlProduto;
			delete $scope.itemPedido;
			$scope.hideLoader();
		//});		
	}

	$scope.excluirItemPedido = function(itemPedido){
		$scope.showLoader();
		//$http.delete($scope.server("/pedidos/" + $rootScope.cliente.cpfCliente + "/" + itemPedido.idPedido + "/" + itemPedido.idProduto)).success(function(data){
			alert("Excluído com sucesso");
			var index = $rootScope.pedido.itensPedido.indexOf(itemPedido);
			$rootScope.pedido.itensPedido.splice(index, 1);
			$scope.hideLoader();
		//});
	}

	$scope.alterarQuantidadeItem = function(itemPedido, operacao)
	{
		if (operacao == "soma")	{
			$rootScope.pedido.vlTotalPedido += parseFloat(itemPedido.produto.vlProduto);
			itemPedido.quantidade++;
		}
		else {
			$rootScope.pedido.vlTotalPedido -= parseFloat(itemPedido.produto.vlProduto);
			itemPedido.quantidade--;
		}
		
		$scope.showLoader();
		//$http.put($scope.server("/pedidos/" + $rootScope.cliente.cpfCliente + "/" + itemPedido.idPedido + "/" + itemPedido.idProduto), itemPedido.quantidade).success(function(data){
			var index = $rootScope.pedido.itensPedido.indexOf(itemPedido);
			$rootScope.pedido.itensPedido.splice(index, 1);
			$rootScope.pedido.itensPedido.splice(index, 0, itemPedido);
			$scope.hideLoader();
		//});		
	}

	$scope.finalizarPedido = function()
	{
		
	}

	$scope.showFormPedido = function(novo)
	{
		if (novo){
			$scope.incluirPedido();
		}

		$("#formPedido").modal('show');
	}

	$scope.abrirFormCadastro = function()
	{
		$("#formCadastro").modal('show');
	}

});