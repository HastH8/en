 

io = {
	loadgame: function(savestr) {
		var buf = savestr.split("&");
		var savedata = {};
		for (var i in buf) {
			var buf1 = buf[i].split("=");
			if (buf1.length != 2) return false;
			savedata[decodeURIComponent(buf1[0])] = decodeURIComponent(buf1[1]);
		}
		pipes_logic.load(savedata);
	},

	loadPrompt: function() {
		var i;

		var str = prompt("Paste the URL below to load a game:\n(If you cannot load the game in IE, paste the URL here.)", "");
		if (!str) return false;

		if ((i = str.indexOf("?")) >= 0) str = str.substr(i+1);
		if ((i = str.indexOf("#")) >= 0) str = str.substr(0, i+1);
		this.loadgame(str);
	},

	savegame: function() {
		var savedata = {};
		if (!pipes_logic.save(savedata)) return false;

		// mini serializer
		var savestr = "";
		var first = true;
		for (var key in savedata) {
			if (first)
				first = false;
			else
				savestr += "&";
			savestr += encodeURIComponent(key) + "=" + encodeURIComponent(savedata[key]);
		}
		return savestr;
	},

	saveToBookmarks: function() {
		var url = this.savegame();
		if (!url) return;

		url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + url;
		if (window.innerHeight || url.length <= 2083) {
			var title = "Pipes Game - " + (new Date());
			if (window.sidebar)
				window.sidebar.addPanel(title, url, "");
			else if (window.external)
				window.external.AddFavorite(url, title);
			else if(window.opera && window.print) { 
				var e=document.createElement('a');
				e.setAttribute('href',url);
				e.setAttribute('title',name);
				e.setAttribute('rel','sidebar');
				e.click();
			}
		}
		else
			// Cannot save due to IE max url length limit (2083 chars)
			alert("Pipes Game Error:\nCannot create bookmark with more than 2083 characters in IE.\n\nPress \"Save to Clipboard\" instead.");
	},

	saveToClipboard: function() {
		var url = this.savegame();
		if (!url) return;

		url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + url;

		if (1) {
			prompt("Copy the URL below to clipboard:", url);
		}
	}
}