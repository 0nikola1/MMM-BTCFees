var NodeHelper = require('node_helper');
var fetch = require('node-fetch');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-BTCFees helper started...');
	},

	getJson: function (url) {
		var self = this;

		var json_data="";
		fetch(url).then(response => response.json()).then(json => {
			// Send the json data back with the url to distinguish it on the receiving part
			json_data = json;
			var result = [];
			for(var i in json_data){
				result.push([i, json_data [i]]);
			}
			self.sendSocketNotification("MMM-BTCFees_JSON_RESULT", {url: url, data: result});
		});

	},

	getBtc: function (urlBtc) {
		var self = this;

		fetch(urlBtc).then(response => response.json()).then(json => {
			// Send the json data back with the url to distinguish it on the receiving part
			self.sendSocketNotification("MMM-BTCFees_BTC_RESULT", {url: urlBtc, data: json.ticker.price});
		});

	},
	
	getBlock: function (urlBlock) {
		var self = this;
		fetch(urlBlock).then(response => response.json()).then(json => {
			// Send the json data back with the url to distinguish it on the receiving part
			self.sendSocketNotification("MMM-BTCFees_BLOCK_RESULT", {url: urlBlock, data: json});
		});
	},
	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-BTCFees_GET_JSON") {
			this.getJson(url);
		}
		if (notification === "MMM-BTCFees_GET_BTC") {
			this.getBtc(url);
		}
		if (notification === "MMM-BTCFees_GET_BLOCK") {
			this.getBlock(url);
		}
	}
});
