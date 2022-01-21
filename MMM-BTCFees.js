'use strict';

Module.register("MMM-BTCFees", {

	jsonData: "",
	btcData: 0,
	btcBlock: "",

	// Default module config.
	defaults: {
		url: "https://mempool.space/api/v1/fees/recommended",
		urlBtc: "https://api.cryptonator.com/api/ticker/btc-usd",
		urlBlock: "https://mempool.space/api/blocks",
		arrayName: null,
		keepColumns: [],
		size: 0,
		tryFormatDate: false,
		updateInterval: 15000,
		descriptiveRow: null
	},

	start: function () {
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification("MMM-BTCFees_GET_JSON", this.config.url);
		this.sendSocketNotification("MMM-BTCFees_GET_BTC", this.config.urlBtc);
		this.sendSocketNotification("MMM-BTCFees_GET_BLOCK", this.config.urlBlock);
	},


	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-BTCFees_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				this.updateDom(500);
			}
		}
		if (notification === "MMM-BTCFees_BTC_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.urlBtc)
			{
				this.btcData = payload.data;
				this.updateDom(500);
			}
		}
		if (notification === "MMM-BTCFees_BLOCK_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.urlBlock)
			{
				this.blockData = payload.data;
				this.updateDom(500);
			}
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "xsmall";

		if (!this.jsonData) {
			wrapper.innerHTML = "Awaiting json data...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		var cellBlock = this.getTableBlock();
		
		var items = [];
		if (this.config.arrayName) {
			items = this.jsonData[this.config.arrayName];
		}
		else {
			items = this.jsonData;
		}

		// Check if items is of type array
		if (!(items instanceof Array)) {
			wrapper.innerHTML = "Json data is not of type array! " +
				"Maybe the config arrayName is not used and should be, or is configured wrong";
			return wrapper;
		}

		items.forEach(element => {
			var row = this.getTableRow(element);
			tbody.appendChild(row);
		});
		
		// Add in Descriptive Row Header
		if (this.config.descriptiveRow) {
			var header = table.createTHead();
			header.innerHTML = this.config.descriptiveRow;
		}

		table.appendChild(tbody);
		table.appendChild(cellBlock);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		var row2 = document.createElement("tr");
		for (var key in jsonObject) {
			var cell = document.createElement("td");
			var cell3 = document.createElement("td");

	
			var valueToDisplay = "";
			var usdToDisplay = "";
			var btcDataa = "";
			var Blocks = "test";
			if (key === "icon") {
				cell.classList.add("fa", jsonObject[key]);
			}
			else if (this.config.tryFormatDate) {
				valueToDisplay = this.getFormattedValue(jsonObject[key]);
			}
			else {
				if ( this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0 ){
					valueToDisplay = jsonObject[key];
					usdToDisplay = this.btcToUsd(valueToDisplay);

				}
			}

			var cellText = document.createTextNode(valueToDisplay);
			var cellUsd = document.createTextNode(usdToDisplay);

			if ( this.config.size > 0 && this.config.size < 9 ){
				var h = document.createElement("H" + this.config.size );
				h.appendChild(cellText)
				var h2 = document.createElement("H" + this.config.size );
				h2.appendChild(cellName)
				var h3 = document.createElement("H" + this.config.size );
				h3.appendChild(cellUsd)
				cell.appendChild(h);
				cell3.appendChild(h3);
			}
			else
			{
				cell.appendChild(cellText);
				cell3.appendChild(cellUsd);
			}

			row.appendChild(cell);
			row.appendChild(cell3);
		}
		return row;
	},
	getTableBlock: function () {
		var row = document.createElement("tr");
		var cell5 = document.createElement("td");
		var cell6 = document.createElement("td");
		var cell7 = document.createElement("td");
			var valueToDisplay = "Last block minutes:";
			var minutesToDisplay = this.timeDifference(this.blockData[0].timestamp,this.blockData[1].timestamp);


			var cellText = document.createTextNode(valueToDisplay);
			var cellText1 = document.createTextNode("");
			var cellText2 = document.createTextNode(minutesToDisplay);

		cell5.appendChild(cellText);
		cell6.appendChild(cellText1);
		cell7.appendChild(cellText2);

		row.appendChild(cell5);
		row.appendChild(cell6);
		row.appendChild(cell7);
		return row;
	},


	//get BTC price
	
	btcToUsd: function (input) {
		if (typeof input === "number" ) {
			
			let price = 0;
			
			price = (input/100000000*140*this.btcData).toFixed(2);
			return price;
		}
		else {
			return " ";
		}
	},
	timeDifference: function (timestamp1,timestamp2) {
		
		var difference = timestamp1 - timestamp2;
		var minutesDifference = Math.round(difference/60,0);
		return minutesDifference;
	}
});
