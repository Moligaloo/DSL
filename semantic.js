
var SemanticParser = function(raw){
	this.result = this.parse(raw);
}

SemanticParser.prototype.parse = function(raw) {
	return this.removeNullElements(raw);
}

SemanticParser.prototype.removeNullElements = function(raw) {
	if($.isArray(raw)){
		var cleaned = new Array();
		for(var i=0; i<raw.length; i++){
			var elem = raw[i];
			if(elem == null || elem == undefined)
				continue;
			else
				cleaned.push(this.removeNullElements(elem));
		}

		return cleaned;
	}else if(raw instanceof Object){
		for(var name in raw){
			raw[name] = this.removeNullElements(raw[name]);
		}
		return raw;
	}else{
		return raw;
	}
};