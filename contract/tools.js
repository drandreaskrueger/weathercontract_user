// tools.js
// 2016 (C) Andreas Krueger
// see https://github.com/drandreaskrueger/weathercontract_user/

VERSION_TOOLS = "v0.5.8"

/*
some generally useful tools 
to work with any contract in the console
*/

var CURRENCY="soil"; // later: perhaps auto-generate from node query
var WAIT_SECONDS = 3;

function ascii(hex) {return web3.toAscii(hex).replace(/\x00/gi,"");};
function fromWei(amount){return web3.fromWei(amount, CURRENCY);};
function toWei(amount){return web3.toWei(amount, CURRENCY);};
function dateprint(timestamp){return new Date(timestamp * 1000);};

function sleepFor( sleepDuration ){
    // Bad, as it uses CPU time. 
    // See http://stackoverflow.com/q/951021
    // But in our case, let's just live with that ...
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function waitForTxReceipt(tx, seconds){
	// tries for receipt every other second
	if (!seconds) seconds=WAIT_SECONDS;
	console.log("Every "+seconds+" seconds, trying eth.getTransactionReceipt(\"" + tx + "\"):");
	while (true){
		txReceipt = eth.getTransactionReceipt(tx);
		if (txReceipt) break;
		sleepFor(seconds * 1000);
		console.log(".");
	}
	console.log("Receipt arrived. Transaction is in " + CURRENCY + " chain at blockHeight "+ txReceipt['blockNumber'] + ".  Gas used: " + txReceipt['gasUsed'] + ".");
	return txReceipt;
}


/*
WeatherContract - specific helpers. 
Perhaps this could go into extra file?
*/


function getForecast_message(locationspecifier, timestamp){
        // just show the message, as ascii
	return ascii( WEATHER.user_getForecast(locationspecifier, timestamp)[0]);
}

// default is 150k gas - I hope this will always be enough?
var GAS_TOPUP = 150000;

// contract answers:
var CONVERSIONS = {"message" : [ascii, "", "statusmessage"],
                   "timestamp_forecast" : [dateprint, "", "forecasted time"],
                   "temp_millikelvin": [1000, "Kelvin", "temperature"],
                   "pressure_pascal" : [100, "Hectopascal", "pressure"],
                   "humidity_percent" : [1, "Percent", "humidity"],
	           "clouds_percent"   : [1, "Percent", "cloudcover"],
                   "wind_centimeterpersecond": [100, "Meter/Second", "windspeed"],
                   "rain3h_micrometer" : [1000, "Millimeter in 3 hours", "rain"]
                  };

function weatherconverted(observables, outputtypes){
    // convert contract output to list of human readable objects:
    // * integers to floats
    // * hex encoded to ascii
    // * epochtime to human readable time

    var results=[];
    var obs, name, convert, converter;
    var obs_conv_name, obs_conv_value, obs_conv_unit;

    // loop through observables list
    for (var i=0; i< observables.length; i++){
        obs = observables[i];
        name = outputtypes[i]["name"];
	convert = CONVERSIONS[name]; // from above dictionary
	converter = convert[0];
	if (typeof(converter)=="function"){
		obs_conv_value = converter(obs);
	} else {
	        obs_conv_value = obs / converter; 
	};
	obs_conv_unit = convert[1];
	obs_conv_name = convert[2];
        results.push({"name": obs_conv_name, "value": obs_conv_value, "unit": obs_conv_unit});
    };
    return results;
};

function weathertext(observables, outputtypes){
    // returns string of converted observables

    var observables_converted = weatherconverted(observables, outputtypes);

    // loop through converted observables list
    var text="\n";
    var obs;
    for (var i=0; i< observables_converted.length; i++){
	obs = observables_converted[i];
        text += obs.name +" => " + obs.value + " " + obs.unit + "\n";
    };
    return text;
};

function weatherprint(observables){
	// this will only work if contract.js is loaded before:
	var outputtypes = WEATHERinfo.user_getForecast.outputs;

	// convert observables, and make into text
	text = weathertext(observables, outputtypes);

	// log to console
	console.log(text);

	// avoid the return value 'undefined' (tell me how)
	return '';
}

function getForecast(locationspecifier, timestamp){
	// gets forecast, and prints it in a human readable way
	var forecast = WEATHER.user_getForecast(locationspecifier, timestamp);
	weatherprint(forecast);
}

function getTopUpMinimumValue(){
	// ask contract how much for one:
	var price = WEATHER.user_getTopUpMinimumValue();
	if (price==0) {
		console.log("Contract at " + WEATHER.address + " cannot be accessed, exiting.");
		return false;
	};
	return price;
}

function pricePerLocationUpdate(){
	// ask contract, and return human readable string
	price = getTopUpMinimumValue();
	text = fromWei(price) + " " + CURRENCY + " per LocationUpdate";
	return text;
}

// set the answer as a constant:
var PRICE = pricePerLocationUpdate();


function topUpLocation(locationSpecifier, multipleOfPrice, account, gas, noPrint){
	// sendTransaction, return transaction hash

	if (!multipleOfPrice) multipleOfPrice=1;
	if (!gas) gas=GAS_TOPUP;
	if (!account) account=eth.coinbase;
	if (!noPrint) noPrint=false;

	var price = getTopUpMinimumValue();
	if (!price) return false;

	var value = price * multipleOfPrice;
	if (!noPrint){
		text = "Send " + fromWei(value) + " " + CURRENCY + "\n";
		text += "From " + account + "\n";
		text += "With " + gas + " gas maximum\n";
		text += "To top up location '" + locationSpecifier + "':\n";
		console.log(text);
	}

	tx = WEATHER.user_topUpLocation.sendTransaction(locationSpecifier, {value: value, from: account, gas: gas});
	
	if (!noPrint) {
		text = "transaction submitted: " + tx + " now wait for\n" ;
		text +="eth.getTransactionReceipt(\"" + tx + "\")";
		console.log(text);
	}
	return tx;
}

function timestamp_now_plus_hours(hours){
	// ask contract
	return WEATHER.timestamp_now_plus_hours(hours);
}

function onlyUserFunctions(){
	// of the whole contract interface, only show 'user_...' and 'timestamp_...' functions
	WEATHERuser = {};
	var keys=Object.keys(WEATHER);
	var key;
	for (var i=0; i< keys.length; i++){
		key = keys[i];
		// console.log(key + " " + typeof(key));
		if (key.slice(0,5)=="user_") WEATHERuser[key] = WEATHER[key];
		if (key.slice(0,10)=="timestamp_") WEATHERuser[key] = WEATHER[key];
	}
	WEATHERuser["address"] = WEATHER["address"];
	WEATHERuser["info"] = WEATHER["info"];
	return WEATHERuser;
}

// save this as a constant
var WEATHERuser = onlyUserFunctions();


// print status:
console.log("tools version: "+ VERSION_TOOLS);
console.log("contract version: "+ ascii(WEATHER.user_getContractVersion()));
console.log("contract interface: type WEATHER, or WEATHERuser")

var functions1 = ["ascii", "fromWei", "toWei", "dateprint"];
console.log("local functions: " + functions1);

var functions2 = ["getForecast_message", "getForecast", "topUpLocation", "waitForTxReceipt", "timestamp_now_plus_hours" ,"weatherprint"];
console.log("local functions: " + functions2);

var constants = ["WEATHERuser", "WEATHER", "WEATHERinfo", "CURRENCY", "PRICE"]
console.log("local constants: " + constants);

