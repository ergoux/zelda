var tilesData = {};

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

function loadMap(map, cb) {
	loadJSON(map+".json",function(json){
		var tp = {};
		var curr = 1;
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
			for(var _tH = 0; _tH < numH; _tH++) {
				for(var _tW = 0; _tW < numW; _tW++) {
					var tile = curr + 1;
					if(json.tilesets[i].tileproperties && json.tilesets[i].tileproperties[curr]) tp["t" + tile] = json.tilesets[i].tileproperties[curr];
					else tp["t" + tile] = {};
					obj["t" + curr] = [_tW * (tW + s), _tH * (tH + s), tW, tH];
					tilesData["t" + curr] = {
						gid: curr,
						path: json.tilesets[i].image,
						properties: tp["t" + tile],
						width: tW,
						height: tH
					};
					curr++;
				}
			}
			Crafty.sprite(json.tilesets[i].image, obj);
		}
		console.log(tiles + " loaded...");
		cb && cb();
	});
}


function renderMap(map, cb) {
	loadJSON(map+".json",function(json){
		var tp = {};
		var curr = 1;
		for(var _l = 0; _l < json.layers.length; _l++){
			curr = 0;
			if(json.layers[_l].data) {
				for(var _lH = 0; _lH < json.layers[_l].height; _lH++){
					for(var _lW = 0; _lW < json.layers[_l].width; _lW++){
						var tile = json.layers[_l].data[curr++];
						if(tile != 0) {
							Crafty.e("2D, Canvas, t" + tile + ", " + tp["t" + tile])
								.attr({x: _lW * tW, y: _lH * tH, z: _l});
						}
					}
				}
			} else {
				for(var _o = 0, max_o = json.layers[_l].objects.length; _o < max_o; _o++) {
					addObject(json.layers[_l].objects[_o]);
					// var tile = json.layers[_l].objects[_o].gid;
					// var xx = json.layers[_l].objects[_o].x;
					// var type = json.layers[_l].objects[_o].type;
					// 
					// if(tile != 0) {
					// 	console.log("2D, Canvas, t" + tile);
					// }
				}
			}
		}
		cb && cb();
	});
}

function addObject(o){
	var yy = o.y - tilesData["t" + o.gid].height;
	var zi = parseInt(o.properties["z-index"]);
	console.log(o);
	var a = Crafty.e("2D, Canvas, t" + o.gid + ( o.type == "animated" ? ",SpriteAnimation":"") )
	.attr({x: o.x, y: yy, z: zi})
	if(o.type == "animated") {
		a.animate("aleteo",getAnimation(0,0,35,9))
		.animate("aleteo", 20, -1);
	}
}

function getAnimation(x,y,w,i){
	var arr = [];
	for (var xx = 0;xx<i;xx++){
		arr.push([x + xx*w,y]);
	}
	return arr;
}



