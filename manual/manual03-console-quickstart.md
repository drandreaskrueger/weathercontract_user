version 0.5.8 (July 18th 2016) - contract ABI and tools are published!

Preparations:

* Introduction to this project [../text/text01-introduction.md](../text/text01-introduction.md)
* Preparations [manual02-preparations.md](manual02-preparations.md) --> be in the [correct folder](manual02-preparations.md#3-the-correct-folder). 

For this quickstart tutorial Python is not needed yet. All happens in your gsoil included JavaScript console. 


# Manual 3: Console - Quickstart

Get the newest clone of this repo by

	cd weathercontract_user
    git pull
    
or get the newest .zip file - 
see [manual02-preparations.md --> 2 clone or download this repo](manual02-preparations.md#2-clone-or-download-this-repo).

Start `gsoil` in a first terminal/cmd.exe, and `gsoil attach` in a second terminal/cmd.exe where you type all this.

    loadScript('useful/addpeers.js')
    loadScript("contract/contract.js")
    loadScript("contract/tools.js")
    W=WEATHERuser

>  {  
>  address: "...",  
>  info: "WEATHERinfo",
  
>  timestamp_now: function(),  ...  
>  timestamp_tomorrow: function(),  

>  user_getContractVersion: function(),  
>  user_getForecast: function(),  
>  user_getLocationBalance: function(),  
>  user_getLocationLastUpdateTime: function(),  
>  user_getLocationNamesWithPositiveBalance: function(),  
>  user_getTopUpMinimumValue: function(),  
>  user_topUpLocation: function()  
>  }  


Now you can ask questions to that contract:

    ascii( W.user_getContractVersion() )

> "v0.5.6" 

In this text, I present some of the helper functions in "contract/tools.js" 
that make it even easier for this **quickstart** -
but they hide implementation details from you. 
Wait for the next *"Manual 4: Console - Understand Contract Interface"* 
to learn more about how to use this smart contract for your own smart contracts.
However, this quickstart walkthrough here will always be helpful, because you can see the 
two step process (TOP UP LOCATION --> wait --> ASK FORECAST) very easily.    

### TOP UP LOCATION

Example here is: *Nanjing in China*. **Please make your own city choice** (better first try a big city)**!**

    city =     "q=Nanjing,China"
    
**Needs the q=  at the beginning !!!** (more about that in a later manual)

    getForecast_message(city)
    
> "Top up location and wait blocks."

So no forecast yet for this city. When we send money, the oracle is going to change that.

#### top up location with money:

How much will it cost?

    PRICE

> "5 soil per LocationUpdate"

Now send 3 times that much (for later auto-updates):

    tx = topUpLocation(city, 3); txReceipt = waitForTxReceipt(tx)

> Send 15 soil  
> From ...   
> With 150000 gas maximum  
> To top up location 'q=Nanjing,China':  

Unlock this account with your passphrase

> Unlock account ...  
> Passphrase  
> "0x................................................................"   

If the passphrase is wrong it shows "method not implemented", and a stackprint.  
If the passphrase is correct, it shows: 

> transaction submitted: ... now wait for  
> eth.getTransactionReceipt("...")  
> Every 3 seconds, trying eth.getTransactionReceipt("..."):  
> .  
> .  

When your transaction has been mined, it shows `gas used`and the whole `txReceipt`

> Receipt arrived. Transaction is in soil chain at blockHeight 874070.  Gas used: 29982.  
> {  
>   blockHash: "...",  
>   blockNumber: 874070,   
>   gasUsed: 50181,  ...  
> }  

Attention: If gasUsed *is equal your offered gas* (150000), then something has gone wrong probably, because the transaction used up all.  

Hint: You can see which parameters any function accepts by typing its name:

    topUpLocation
    
  
### ASK for FORECAST 

Now let us check the weather forecast you paid for. First, whether the oracle has already answered:

    getForecast_message(city)
    
> "Wait blocks until oracle answer."

So the contract has registered your money (and emitted an event `Event_LocationToppedUp` to the outside world), 
but the oracle's answer is not mined yet. Wait a bit, perhaps like this:

    admin.sleepBlocks(1); getForecast_message(city)

until you receive a:
    
> "ForecastWeatherAtLocationAtTime:"

Very good. The data is in the blockchain. 
    
#### Nowcast = empirical weather measurements, most recent
    
Now you (everyone) can query the *nowcast* for this location

    getForecast(city)
    
> statusmessage => ForecastWeatherAtLocationAtTime:   
> forecasted time => Mon, 18 Jul 2016 16:00:00 CEST   
> temperature => 301.5 Kelvin  
> pressure => 1005 Hectopascal  
> humidity => 78 Percent  
> cloudcover => 40 Percent  
> windspeed => 3 Meter/Second  
> rain => 0.075 Millimeter in 3 hours  
 
 
#### Forecast at a given timestamp

We need to ask at a specific second:

##### Timestamps are epochtime

Timestamps are epochtime since 1970. Check out [epochconverter.com](http://www.epochconverter.com/) to learn more about it. Now is not exactly 'now', but the epoch-second of the last block:

    timestamp_now_plus_hours()
    dateprint(timestamp_now_plus_hours())
    
> 1468851180  
> Date Mon, 18 Jul 2016 16:13:00 CEST


This helper adds up 24\*60\*60, and 48\*60\*60 seconds to that:

    timestamp_now_plus_hours(24)
    dateprint(timestamp_now_plus_hours(24))    
    timestamp_now_plus_hours(48)
    dateprint(timestamp_now_plus_hours(48))
    
> 1468937580  
> Date Tue, 19 Jul 2016 16:13:00 CEST  
> 1469023980  
> Date Wed, 20 Jul 2016 16:13:00 CEST  

##### Forecast

Tomorrow:

    getForecast(city, timestamp_now_plus_hours(24))

> statusmessage => ForecastWeatherAtLocationAtTime:   
> forecasted time => Tue, 19 Jul 2016 17:00:00 CEST   
> temperature => 300.56 Kelvin  
> pressure => 1014.3 Hectopascal  
> humidity => 89 Percent  
> cloudcover => 88 Percent  
> windspeed => 5.11 Meter/Second  
> rain => 0 Millimeter in 3 hours  

in 2 days:

    getForecast(city, timestamp_now_plus_hours(48))

> statusmessage => ForecastWeatherAtLocationAtTime:   
> forecasted time => Wed, 20 Jul 2016 17:00:00 CEST   
> temperature => 297.91 Kelvin  
> pressure => 1016.29 Hectopascal  
> humidity => 98 Percent  
> cloudcover => 88 Percent  
> windspeed => 3.41 Meter/Second  
> rain => 0.91 Millimeter in 3 hours  


in 3.5 days:

    getForecast(city, timestamp_now_plus_hours(24 * 3.5))

> statusmessage => ForecastWeatherAtLocationAtTime:   
> forecasted time => Thu, 21 Jul 2016 17:00:00 CEST   
> temperature => 301.121 Kelvin  
> pressure => 1015.46 Hectopascal  
> humidity => 85 Percent  
> cloudcover => 48 Percent  
> windspeed => 4.51 Meter/Second  
> rain => 0.01 Millimeter in 3 hours  


in 4.5 days:

    getForecast_message(city, timestamp_now_plus_hours(24 * 4.5))

> "Timestamp too far in the future."  


#### Topping up an already existing location
Weather forecasts can change quickly. Topping up a location again will trigger the oracle 
to get and write new forecast data.

    tx = topUpLocation(city, 1); txReceipt = waitForTxReceipt(tx); getForecast(city)

For a short moment, the message will then change to:

> statusmessage => **Newer forecast pending. OldData:**   
> forecasted time => Mon, 18 Jul 2016 17:00:00 CEST   
> temperature => 301.4 Kelvin  
> pressure => 1015.29 Hectopascal  
> humidity => 92 Percent  
> cloudcover => 92 Percent  
> windspeed => 4.11 Meter/Second  
> rain => 0.075 Millimeter in 3 hours  
    
    
### Messages
    
Valid forecast data will be marked by either of these two messages:

> statusmessage => ForecastWeatherAtLocationAtTime:     
> statusmessage => Newer forecast pending. OldData:  

While non-existing forecast data is marked by one of these:

> statusmessage => Top up location and wait blocks.  
> statusmessage => Wait blocks until oracle answer.  
> statusmessage => Timestamp too far in the future.  


    
### Internal representation of the data

The WEATHERinfo dictionary knows the whole interface, look at these outputs:

    WEATHERinfo.user_getForecast.outputs

>   message  
>   timestamp_forecast  
>   temp_millikelvin  
>   pressure_pascal  
>   humidity_percent  
>   clouds_percent  
>   wind_centimeterpersecond  
>   rain3h_micrometer  

note the **milli**kelvin, the pascal (not **hecto**pascal), the **centi**meterpersecond, and the **micro**meter.

When you directly access the contract function (not via the local helper functions, like above), it replies:

    WEATHER.user_getForecast(city)
    
> ["0x466f7265636173745765617468657241744c6f636174696f6e417454696d653a", 1468850400, 301150, 100500, 78, 40, 300, 75]

Smart contracts cannot handle yet floats (301.15 Kelvin), so the temperature is multiplied by 1000:

    WEATHER.user_getForecast(city)[2]
    
> 301150  

which means 301150 / 1000 --> 301.15 Kelvin.

(And, by the way, "Kelvin" is the physics temperature above the coldest possible temperature in this universe 
--> 301.15 Kelvin - 273.150 Kelvin --> 28.0 °Celsius (Celsius has 100 degrees between ice and boil point of water). 
And  301.15 × 9/5 − 459.67 Fahrenheit -->  82.4 °Fahrenheit (Fahreheit has 180 degrees between ice and boil point of water).

The helper functions in tools.js in `tools.js` are converting the integers to floats for you:

    weatherprint( WEATHER.user_getForecast(city) )
    
so that you get the tables shown above.


### Summary
You have learned how to load the contract interface definition, and the helper tools. 
You know how to "top up" a location, and to wait until your transaction and the
oracle answer's transaction is mined. Then a nowcast is available, and 
-via timestamps for future events- several forecasts for the following 4 days.

So the whole process is:

**TOP UP LOCATION --> wait for your TX --> wait for oracle's TX --> ASK FORECAST**

Please test this excessively, and give feedback in the [soil thread](https://bitcointalk.org/index.php?topic=1176709.new#new).

Next manual04, will hide less of the contract interface, 
and thus show how to make this useful for your own contracts. Stay tuned.

### Support this
* Try this out. Scroll up, and copypaste the `codelines`. Give feedback please.
* Participate in the [soil thread](https://bitcointalk.org/index.php?topic=1176709.new#new).
* Retweet [my tweets](https://twitter.com/drandreaskruger).
* [Become an angel](https://github.com/drandreaskrueger/weathercontract_user#become-an-angel-now).

Thanks. 


