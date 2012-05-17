window.onload = function() {
	Crafty.init(624, 416);
	Crafty.canvas.init();
	
	//turn the sprite map into usable components
	Crafty.sprite(16, "images/sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2],
		player: [0,3]
	});
	
	Crafty.sprite("images/goku.png", {
		goku: [0,0,28,35]
	});
	
	Crafty.sprite("images/link.png", {
		link: [0,30,25,30]
	});

	Crafty.sprite(35,"images/fullPollo.png", {
		pollo: [0,0]
	});

	
	function renderMap(map, cb) {
		loadJSON(map+".json",function(json){
			var tp = {};
			for(var i = 0, max = json.tilesets.length; i < max; i++) {
				console.log("Loading tiles from: " + json.tilesets[i].image);
				var f = json.tilesets[i].firstgid;
				var tW = json.tilesets[i].tilewidth;
				var tH = json.tilesets[i].tileheight;
				var iW = json.tilesets[i].imagewidth;
				var iH = json.tilesets[i].imageheight;
				var s = json.tilesets[i].spacing;
				var obj = {};
				var numW = Math.floor(iW / (tW + s));
				var numH = Math.floor(iH / (tH + s));
				var tiles = numW * numH;
				var curr = 1;
				for(var _tH = 0; _tH < numH; _tH++) {
					for(var _tW = 0; _tW < numW; _tW++) {
						var tile = curr + 1;
						if(json.tilesets[i].tileproperties[curr]) tp["t" + tile] = json.tilesets[i].tileproperties[curr].e;
						else tp["t" + tile] = "";
						obj["t" + curr] = [_tW * (tW + s), _tH * (tH + s), tW, tH];
						curr++;
					}
				}
				Crafty.sprite(json.tilesets[i].image, obj);
			}
			for(var _l = 0; _l < json.layers.length; _l++){
				curr = 0;
				console.log("Loading layer" + _l, json.layers[_l].height, json.layers[_l].width);
				for(var _lH = 0; _lH < json.layers[_l].height; _lH++){
					for(var _lW = 0; _lW < json.layers[_l].width; _lW++){
						var tile = json.layers[_l].data[curr++];
						if(tile != 0) {
							Crafty.e("2D, Canvas, t" + tile + ", " + tp["t" + tile])
								.attr({x: _lW * tW, y: _lH * tH, z: _l});
						}
					}
				}
			}
			console.log(tiles + " loaded...");
			cb && cb();
		});
		
		function loadJSON(json, cb) {   
			    var xobj = new XMLHttpRequest();
			    xobj.overrideMimeType("application/json");
			    xobj.open('GET', json, true);
			    xobj.onreadystatechange = function () {
			        if (xobj.readyState == 4) {
			            var jsonTexto = xobj.responseText;
			            cb(JSON.parse(jsonTexto));
			        }
			    }
			    xobj.send(null);
		}
	}
	
	function getAnimation(x,y,w,i){
		var arr = [];
		for (var xx = 0;xx<i;xx++){
			arr.push([x + xx*w,y]);
		}
		return arr;
	}
	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 25; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 20; j++) {
				grassType = Crafty.math.randomInt(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});
				
				//1/50 chance of drawing a flower and only within the bushes
				if(i > 0 && i < 24 && j > 0 && j < 19 && Crafty.math.randomInt(0, 50) > 49) {
					Crafty.e("2D, DOM, flower, solid, destroy, SpriteAnimation")
						.attr({x: i * 16, y: j * 16})
						.animate("wind", 0, 1, 2)
						.animate("wind", 80, -1);
				}
			}
		}
		
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 25; i++) {
			Crafty.e("2D, Canvas, wall_top, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 304, z: 2});
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 19; i++) {
			Crafty.e("2D, DOM, wall_left, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 384, y: i * 16, z: 2});
		}
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["images/sprite.png"], function () {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
	
	renderMap("map1", function(){
		console.log("CASCASCASCAS");
		
		var a = Crafty.e("2D, DOM, pollo, SpriteAnimation")
			.attr({x: 0, y: 0})
			.animate("aletear", 0, 0, 9);
		
		a.animate("aletear", 20, -1);
			
	});
	
	Crafty.scene("main", function() {
		//generateWorld();
	});
};