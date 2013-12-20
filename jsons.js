// Variable qui contiendra plus tard les différents matériaux, pas encore usité
var material = [];


// Tableau des objets (pas
var objects = [
	{"name" : "gold pepit" , "look" : 2 , "size" : 0.8 , "inventaire" : true , "valeur" : 100 },
	//{"name" : "potery" , "look" : 1 },
	//{"name" : "broken vase" , "look" : 3 },
	{"name" : "nothing..." , "look" : 4 , "size" : 1 , "inventaire" : false , "valeur" : 0 }
];


// Les trois "carrés de bases pour la carte"
var square = {
	"left" : [
			{ "map" : [[1,1,1],[1,1,1],[0,0,0]] },
			{ "map" : [[1,1,0],[1,1,0],[1,1,0]] },
			{ "map" : [[0,0,1],[0,0,1],[1,1,1]] },
		]
};


// sens à disposition pour le chemin aléatoire
var sens_dispo = [
	[ 0 , 1 , 2] ,
	[ 0 , 1 , 1 ] ,
	[ 0 , 1 , 1 ]
];
var sens_when_down = [ 0 , 2 ];


// Modèles de chemin
var path_temp = [
	[
		{ "map" : [[[1,1,0],[1,1,0],[1,1,0]],[[1,1,0],[1,1,0],[1,1,0]],[[1,1,1],[1,1,1],[1,1,1]]] , "exit" : 0 , "coming" : "left" , "horizontal" : 1 , "vertical" : 0 } ,
		{ "map" : [[[0,1,1],[0,1,1],[0,0,0]],[[0,1,1],[0,1,1],[0,1,1]],[[0,1,1],[0,1,1],[0,0,0]]] , "exit" : 1 , "coming" : "left" , "horizontal" : 0 , "vertical" : 1 } ,
		{ "map" : [[[1,1,0],[1,1,0],[0,0,0]],[[1,1,0],[1,1,0],[1,1,0]],[[1,1,0],[1,1,0],[1,1,0]]] , "exit" : 2 , "coming" : "left" , "horizontal" : 0 , "vertical" : -1 } ,
	] ,
	
	[
		{ "map" : [[[0,0,0],[1,1,0],[1,1,0]],[[0,0,0],[1,1,1],[1,1,1]],[[0,0,0],[1,1,0],[1,1,0]]] , "exit" : 0 , "coming" : "up" , "horizontal" : 1 , "vertical" : 0 } ,
		{ "map" : [[[1,1,1],[1,1,1],[0,0,0]],[[1,1,1],[1,1,1],[0,0,0]],[[1,1,1],[1,1,1],[1,1,1]]] , "exit" : 1 , "coming" : "up" , "horizontal" : 0 , "vertical" : 1 } 
	] ,
	
	[
		{ "map" : [[[1,1,1],[1,1,1],[0,0,0]],[[1,1,1],[1,1,1],[0,0,0]],[[1,1,1],[1,1,1],[1,1,1]]] , "exit" : 2 , "coming" : "down" , "horizontal" : 0 , "vertical" : -1 } ,
		{ "map" : [[[0,0,0],[0,1,1],[0,1,1]],[[0,0,0],[1,1,1],[1,1,1]],[[0,0,0],[0,1,1],[0,1,1]]] , "exit" : 0 , "coming" : "down" , "horizontal" : 1 , "vertical" : 0 } 
	] ,
	
	[
		{ "map" : [[0,1,0],[0,1,0],[0,1,0]] , "exit" : "left" , "coming" : "right" , "horizontal" : 1 , "vertical" : 0 } ,
	] , 
];

var directions = [ 
	{ "sens" : "left" , "horizontal" : 1 , "vertical" : 0 },
	{ "sens" : "down" , "horizontal" : 0 , "vertical" : 1 },
	{ "sens" : "up" , "horizontal" : 0 , "vertical" : -1 }
];