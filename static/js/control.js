 

controlsets = [
	{
		name: "Mouse",
		desc: "<p><i>Click</i>: Rotate piece</p><p><i>Right click</i>: Toggle highlight</p><p><i>Ctrl + Click</i>: Start lighting here</p><p><i>Note: rotating a piece highlights it automatically</i></p>",
		eventprocess: function(e) {
			var buttonmap = [1, 4, 2];
			var button = e.which ? buttonmap[e.button] : e.button;

			if (e.type == "mouseup") {
				var t = e.target || e.srcElement;
				if (t.id == "gameContent") {
					var pos = board.getXY(e.pageX, e.pageY); // incomplete
					var x = pos[0];
					var y = pos[1];
					switch (button)
					{
						case 1:
							if (e.ctrlKey)
								pipes_logic.light(x, y);
							else {
								pipes_logic.tagPiece(x, y, true);
								pipes_logic.rotatePiece(x, y);
							}
							break;
						case 2:
							pipes_logic.togglePiece(x, y);
							break;
					} 
				}
			} else if (e.type == "mousemove") {
				var t = e.target || e.srcElement;
				if (t.id == "gameContent") {
					var pos = board.getXY(e.pageX, e.pageY); // incomplete
					var x = pos[0];
					var y = pos[1];
					pipes_logic.setCursor(x, y);
				}
			} else if (e.type == "mouseout") {
				var t = e.target || e.srcElement;
				if (t.id == "gameContent") {
					pipes_logic.setCursor(-1, -1);
				}
			}
		}
	},
		{
		name: "Keyboard",
		desc: "<p><i>Arrow keys</i>: Move cursor</p><p><i>Space, Z</i>: Rotate piece clockwise</p><p><i>X</i>: Rotate piece counterclockwise</p><p><i>C</i>: Toggle highlight</p><p><i>V</i>: Start lighting here</p><p><i>Note: rotating a piece highlights it automatically</i></p>",
		eventprocess: function(e) {
			var t = (e.target || e.srcElement).tagName.toLowerCase();
			if (e.type == "keydown" && (t == "html" || t == "body" || t == "canvas")) {
				var keyCode = e.keyCode;
				if (keyCode == 39) { // right
					pipes_logic.moveCursor( 1, 0);
				} else if (keyCode == 40) { // down
					pipes_logic.moveCursor( 0, 1);
				} else if (keyCode == 37) { // left
					pipes_logic.moveCursor(-1, 0);
				} else if (keyCode == 38) { // up
					pipes_logic.moveCursor( 0,-1);
				} else if (keyCode == 32 || keyCode == 90) { // space, z
					pipes_logic.tagPiece(undefined, undefined, true);
					pipes_logic.rotatePiece();
				} else if (keyCode == 88) { // x
					pipes_logic.tagPiece(undefined, undefined, true);
					pipes_logic.rotatePiece(undefined, undefined, 1)
				} else if (keyCode == 67) { // c
					pipes_logic.togglePiece();
				} else if (keyCode == 86) { // v
					pipes_logic.light(pipes_logic.cursorx, pipes_logic.cursory);
				}
			} else if (e.type == "keydown") alert(t);
			if (e.type == "keydown" && (t == "html" || t == "body")) {
				if (keyCode >= 37 && keyCode <= 40 || keyCode == 32) return false;
			}
		}
	}
];

function controller_pro(n, objectname) {
	var s = '<select id="control_select" onchange="' + objectname + '.setControlset(this.value); this.blur();">';
	var c = controlsets.length;
	for (var i=0; i<c; i++) {
		s += '<option value="' + i + '">' + controlsets[i].name + '</option>';
	}
	s += '</select>';
	document.getElementById("controlset_placeholder").innerHTML = s;

	this.setControlset(n);
}
controller_pro.prototype = {
	controlset: 0,

	setControlset: function(n) {
		this.controlset = controlsets[n];
		document.getElementById("controlset_desc").innerHTML = this.controlset.desc;
	},

	eventprocess: function(e) {
		return this.controlset.eventprocess(e);
	}
}