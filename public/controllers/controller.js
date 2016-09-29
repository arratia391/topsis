angular.module("llenarMatriz",['nvd3'])
.controller("matriz", function($scope){
	$scope.alternativas = [];
	$scope.criterios = [];
	$scope.showAlt = false;
	$scope.hideView = false;


	$scope.options = {
		chart: {
			type: 'pieChart',
			height: 500,
			x: function(d){return d.key;},
			y: function(d){return d.y;},
			showLabels: true,
			duration: 500,
			labelThreshold: 0.000001,
			labelSunbeamLayout: true,
			legend: {
				margin: {
					top: 5,
					right: 35,
					bottom: 5,
					left: 0
				}
			}
		}
	};

	$scope.data3 = [
		{
			key: "Five",
			y: 0.5472943924163816
		},
		{
			key: "Six",
			y: 0.528214556887289
		},
		{
			key: "Seven",
			y: 0.4527056075836185
		}
	];
	// {
	// 	criterio: "precio",
	// 	peso: "3"
	// }
	
	// $scope.n;
	// console.log($scope.criterios[0].criterio);
	// $scope.elemento = $scope.criterios[0].criterio;

	/*console.log($scope.criterios)
	var range = new Array(4);
	for(var i=0;i<4;i++) {
	  range[i] = (i*i+1);
	}
	$scope.range = range;
	console.log($scope.range[3]);
	console.log($scope.range.length);
	$scope.largo = $scope.range.length;
	*/
	$scope.nuevoCriterio = {};
	$scope.nuevaAlternativa = [];
	//$scope.criterios=[{"criterio":"C1", "peso":"0.5"},{"criterio":"C2", "peso":"0.5"}];
	//$scope.alternativas=[['Alt 1','1','5'],['Alt 2','4','2'],['Alt 3','3','3']];
	$scope.criterios=[];
	$scope.alternativas=[];
	$scope.addData = function(){
		$scope.criterios.push($scope.nuevoCriterio);
		$scope.nuevoCriterio = {}; // para que en la vista no se vea el contenido anterior
		
	}
	$scope.removeData = function(selData){
		$scope.criterios.splice($scope.criterios.indexOf(selData),1);
		
	}

	$scope.addData2 = function(){
		$scope.alternativas.push($scope.nuevaAlternativa);
		$scope.nuevaAlternativa = [];
		
	}

	$scope.removeData2 = function(selData){
		$scope.alternativas.splice($scope.criterios.indexOf(selData),1);
		
	}

	$scope.continuar = function(){
		$scope.showAlt = true;
		$scope.hideView = true;
	}

	$scope.calcular = function(){
		$scope.showResults = true;
		$scope.Resultados = [];
		$scope.ResultadosGrafico = [];

		//*******************************************************************************
		//NORMALIZANDO PESOS
		var pesosNormalizados =[];
		var sumatoria = 0.0;
		var nucriterios = $scope.criterios.length;
		
		for(i=0; i<nucriterios; i++){
			sumatoria = sumatoria+parseFloat($scope.criterios[i].peso);
		}
		for(i=0; i<nucriterios; i++){
			pesosNormalizados.push(parseFloat($scope.criterios[i].peso)/sumatoria);
		}
		console.log("pesos: "+pesosNormalizados);
		//pesosNormalizados[] = contiene los pesos a trabajar

		//******************************************************************************

		var copiaMatriz = [];

		cols = $scope.alternativas[0].length-1;// numero criterios
		rows = $scope.alternativas.length; //numero alternativas
		console.log("cols: "+cols, "rows: "+rows);

		//COPIANDO MATRIZ ALTERNATIVAS[] -> COPIAMATRIZ[] (SOLO VALORES)
		for(i=0; i<rows; i++){
			var copiaMatrizFila = [];
			for(j=0; j<cols; j++){
				copiaMatrizFila.push($scope.alternativas[i][j+1]);
			}
			copiaMatriz.push(copiaMatrizFila);
		}

		//********************************************************************************

		//ESTAPA I: NORMALIZACIÓN
		var ArraySum = [];
		for(i=0;i<cols;i++){
			var sum = 0;
			for(j=0;j<rows;j++){
				console.log(copiaMatriz[j][i]);
				sum = sum + (Math.pow(copiaMatriz[j][i],2));
			}
			console.log(sum);
			ArraySum.push(Math.pow(sum,0.5));
		}
		console.log(ArraySum);

		//**********************************************************************************
		//MATRIZ NORMALIZADA PONDERADA
		MatrizEtapaII = [];
		for(i=0; i<copiaMatriz.length; i++){
			var FilaEtapaII = [];
			for(j=0; j<copiaMatriz[0].length; j++){
				FilaEtapaII.push((copiaMatriz[i][j]/ArraySum[j])*(pesosNormalizados[j]));

			}
			MatrizEtapaII.push(FilaEtapaII);
		}
		//console.log(copiaMatriz);
		console.log("NORMALIZADA PONDERADA:");
		console.log(MatrizEtapaII);

		//**********************************************************************************
		//SIP SIN - ETAPA III
		
		ArraySipSin = [];
		for(i=0; i<cols; i++){
			sipSin = {};
			may = 0;
			men = 99999999;
			for(j=0; j<rows; j++){
				var dato = MatrizEtapaII[j][i];
				if(dato > may){
					may = dato;
				}
				if(dato < men){
					men = dato;
				}
			}
			sipSin.sin = men;
			sipSin.sip = may;
			ArraySipSin.push(sipSin);
		}
		console.log("SIP SIN");
		console.log(ArraySipSin);

		//**************************************************************************************
		//   MAATRIZ DISTANCIA EUCLIDEA - ETAPA IV

		 ArrayDistanciaEuclideaPos = [];
		 var rowsEtapaII = MatrizEtapaII.length;
		 var colsEtapaII = MatrizEtapaII[0].length;
		 for(i=0; i<rowsEtapaII; i++){
		 	var modulo = 0.0;
		 	for(j = 0; j<colsEtapaII; j++){
		 		modulo = modulo + Math.pow(MatrizEtapaII[i][j]-parseFloat(ArraySipSin[j].sip),2);	
		 	}
		 	ArrayDistanciaEuclideaPos.push(Math.pow(modulo,0.5));
		 }
		 console.log("Distancia Euclidea +: "+ArrayDistanciaEuclideaPos);

		 ArrayDistanciaEuclideaNeg = [];
		 var rowsEtapaII = MatrizEtapaII.length;
		 var colsEtapaII = MatrizEtapaII[0].length;
		 for(i=0; i<rowsEtapaII; i++){
		 	var modulo = 0.0;
		 	for(j = 0; j<colsEtapaII; j++){
		 		modulo = modulo + Math.pow(MatrizEtapaII[i][j]-parseFloat(ArraySipSin[j].sin),2);	
		 	}
		 	ArrayDistanciaEuclideaNeg.push(Math.pow(modulo,0.5));
		 }
		 console.log("Distancia Euclidea -: "+ ArrayDistanciaEuclideaNeg);
		 //**************************************************************************************
		 //ETAPA V FINAL 
		 ArrayDesicion = [];
		 var valorAlternativa = {};
		 for(i=0; i<ArrayDistanciaEuclideaPos.length; i++){
		 	valorAlternativa = {};
		 	valorAlternativa.valor = (ArrayDistanciaEuclideaNeg[i]/(ArrayDistanciaEuclideaPos[i] + ArrayDistanciaEuclideaNeg[i]));
		 	valorAlternativa.indice = $scope.alternativas[i][0];//Primer elemento de cada fila
		 	ArrayDesicion.push(valorAlternativa);
		 	//console.log(ArrayDesicion[i]);
		 }
		 //ORDEN DESCENDENTE
		 ArrayDesicion.sort(function(a,b){
		 	return parseFloat(b.valor) - parseFloat(a.valor);
		 });

		 $scope.vistaDistanciasEuclideas = [];
		 for(i=0; i<ArrayDistanciaEuclideaPos.length; i++){
		 	console.log(ArrayDesicion[i].indice+": "+ArrayDesicion[i].valor);
		 	vistDistEuclideas = {};
		 	vistDistEuclideas.pos = ArrayDistanciaEuclideaPos[i];
		 	vistDistEuclideas.neg = ArrayDistanciaEuclideaNeg[i];
		 	$scope.vistaDistanciasEuclideas.push(vistDistEuclideas);
		 }
		 $scope.Resultados = ArrayDesicion;
		 console.log($scope.Resultados);

		 for(i=0; i<$scope.Resultados.length; i++){
		 	datosGrafico = {};
		 	datosGrafico.key = $scope.Resultados[i].indice;
		 	datosGrafico.y = $scope.Resultados[i].valor;
		 	$scope.ResultadosGrafico.push(datosGrafico);
		}
		console.log($scope.ResultadosGrafico);
	}
});