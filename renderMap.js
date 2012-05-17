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
			console.log(json.tilesets)
			for(var _tH = 0; _tH < numH; _tH++) {
				for(var _tW = 0; _tW < numW; _tW++) {
					var tile = curr + 1;
					if(json.tilesets[i].tileproperties && json.tilesets[i].tileproperties[curr]) tp["t" + tile] = json.tilesets[i].tileproperties[curr].e;
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
