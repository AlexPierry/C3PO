app.controller("pedidosCtrl", function($scope, $rootScope, $http){
	$scope.dataAtual = new Date();

	$scope.loadFuncionarios = function(){
		if (!$rootScope.funcionarios)
		{
			$scope.showLoader();
			$http.get($scope.server("/funcionarios")).success(function(data){
				$rootScope.funcionarios = data;
				$scope.hideLoader();
			});
		}			
	}

	$scope.loadProdutos = function(){
		$scope.showLoader();
		$http.get($scope.server("/produtos")).success(function(data){
			$rootScope.produtos = data;
			$scope.hideLoader();
		});		
	}

	$scope.setFuncionario = function(funcionario){
		$rootScope.funcionario = funcionario;
		$(window.document.location).attr('href','/restaurante/#/pedidos');  
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

		$http.post($scope.server("/pedidos/" + $rootScope.cliente.cpf), pedido).success(function(data){
			$scope.loadPedido(data);
		});	
		//$scope.formPedidos.$setPristine(true);
	}

	$scope.localizarCliente = function(cpf){
		$scope.showLoader();
		$http.get($scope.server("/clientes/" + cpf)).then(
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
		$http.get($scope.server("/pedidos/" + $rootScope.cliente.cpf)).success(function(data){
			$rootScope.pedidos = data;
			$scope.hideLoader();
		});		
	}
	
	$scope.loadPedido = function(idPedido){
		$scope.showLoader();
		$http.get($scope.server("/pedidos/" + $rootScope.cliente.cpf + "/" + idPedido)).success(function(data){
			$rootScope.pedido = data;
			$scope.hideLoader();
		});		
	}

	$scope.visualizarPedido = function(pedido){
		$rootScope.pedido = pedido;
		$scope.showFormPedido();
	}

	$scope.adicionarItemPedido = function(itemPedido){
		itemPedido.idPedido = $rootScope.pedido.idPedido;
		$scope.showLoader();
		$http.post($scope.server("/pedidos/" + $rootScope.cliente.cpf + "/" + itemPedido.idPedido + "/" + itemPedido.produto.idProduto), itemPedido.quantidade).success(function(data){
			$rootScope.pedido.itensPedido.push(angular.copy(itemPedido));
			$rootScope.pedido.vlTotalPedido += itemPedido.quantidade * itemPedido.produto.vlProduto;
			delete $scope.itemPedido;
			$scope.hideLoader();
		});		
	}

	$scope.excluirItemPedido = function(itemPedido){
		$scope.showLoader();
		$http.delete($scope.server("/pedidos/" + $rootScope.cliente.cpf + "/" + itemPedido.idPedido + "/" + itemPedido.produto.idProduto)).success(function(data){
			var index = $rootScope.pedido.itensPedido.indexOf(itemPedido);
			$rootScope.pedido.itensPedido.splice(index, 1);
			$rootScope.pedido.vlTotalPedido -= itemPedido.quantidade * itemPedido.produto.vlProduto;
			$scope.hideLoader();
		});
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
		$http.put($scope.server("/pedidos/" + $rootScope.cliente.cpf + "/" + itemPedido.idPedido + "/" + itemPedido.produto.idProduto), itemPedido.quantidade).success(function(data){
			var index = $rootScope.pedido.itensPedido.indexOf(itemPedido);
			$rootScope.pedido.itensPedido.splice(index, 1);
			$rootScope.pedido.itensPedido.splice(index, 0, itemPedido);
			$scope.loadPedidos();
			$scope.hideLoader();
		});		
	}

	$scope.finalizarPedido = function(pedido)	{
		$scope.showLoader();
		$http.put($scope.server("/pedidos/" + $rootScope.cliente.cpf + "/" + pedido.idPedido + "/finalizar")).success(function(data){
			$("#formPedido").modal('hide');
			$scope.loadPedidos();
			$scope.hideLoader();
		});
	}

	$scope.showFormPedido = function(novo) {
		if (novo){
			$scope.incluirPedido();
		}

		$("#formPedido").modal('show');
	}

	$scope.abrirFormCadastro = function() {
		$("#formCadastro").modal('show');
	}
	
	$scope.fecharModal = function(){
		$("#formPedido").modal('hide');
		$scope.loadPedidos();
	}

	$scope.cadastrarCliente = function(cliente){
		$scope.showLoader();
		$http.post($scope.server("/clientes"), cliente).success(function(data){
			$("#formCadastro").modal('hide');
			$scope.localizarCliente(cliente.cpf);
			$scope.hideLoader();
		});	
		
	}
});
