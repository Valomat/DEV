var material = [];

var objects = [
	{"name" : "skull" , "look" : 0 , "size" : 1 , "inventaire" : false , "lol" : false },
	{"name" : 100 , "look" : 2 , "size" : 0.8 , "inventaire" : true , "lol" : true},
	{"name" : "nothing..." , "look" : 4 , "size" : 1 , "inventaire" : false , "lol" : false }
];

var square = {
	"left" : [
			{ "map" : [[1,1,1],[1,1,1],[0,0,0]] },
			{ "map" : [[1,1,0],[1,1,0],[0,1,0]] },
			{ "map" : [[0,1,1],[0,1,1],[0,1,1]] },
		]
};

var sens_dispo = [
	[ 0 , 1 , 2] ,
	[ 0 , 1 , 1 ] ,
	[ 0 , 1 , 1 ]
];
var sens_when_down = [ 0 , 2 ];

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