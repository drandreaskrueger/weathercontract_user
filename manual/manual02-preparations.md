version 0.5.9 (July 26th 2016) - new contract v0.5.9 deployed! Try the [quickstart](manual/manual03-console-quickstart.md).  
# Manual 2: Preparations

### 0 operating system

It works on Linux, Mac and Windows - but some things are easier on Linux. 
Are you ready to take your first steps into the free world of open source operating systems? 
Keep your Windows machine as it is, and install Linux inside a [VirtualBox](https://www.virtualbox.org/) 
(excellent [slideshow](http://www.networkworld.com/article/2937148/linux/how-to-install-debian-linux-8-1-in-a-virtualbox-vm.html) how to). 
Or just get a cheap [VPS](https://en.wikipedia.org/wiki/Virtual_private_server).
For 5$ per month, rent your small virtual machine at digitalocean, and it is online 24/7 on a fast connection - 
host your own webserver, permanent nodes for your favorite cryptos, etc. 
And when you destroy that "droplet" again, it stops costing money. 
Use my [referal link](https://m.do.co/c/f934b16d6302) - then you and I will both get rewarded. 

#### Linux

I assume your package list & system is updated & upgraded:

    apt-get update && apt-get -y upgrade      # or 
    sudo apt-get update && sudo apt-get -y upgrade
    
Programs I have found to be useful:
 
    apt-get -y install sudo git nano tree dos2unix wget curl screen zip python
    

### 1 install and start soil
See [soil thread](https://bitcointalk.org/index.php?topic=1176709.msg12385424#msg12385424) 
how to install SOIL on your machine. (for Linux see: [../useful/soil-linux-install.sh](../useful/soil-linux-install.sh)) 

How to *add peers*, see below.

Have a few dozen SOIL coins in your first account `eth.coinbase`, 
just buy some at [bittrex.com](https://bittrex.com/Market/Index?MarketName=BTC-SOIL), 
and transfer them to your soil wallet. Create a soil address in your wallet with:

    gsoil account new
    
Your private keys are each protected with a passphrase; the private key files are 
in `~/.soil/keystore/` (Linux), or `%APPDATA%\soil\keystore\` (Windows) - make a backup!

Start gsoil:

    gsoil
    

### 2 clone or download this repo

Clone this whole repo (then later, updates are easy)

    git clone https://github.com/drandreaskrueger/weathercontract_user
    cd weathercontract_user
    
OR (first commands means download & save):

	wget https://github.com/drandreaskrueger/weathercontract_user/archive/master.zip
	unzip master.zip
	rm master.zip
	mv weathercontract_user_master weathercontract_user
	cd weathercontract_user
		
(`rm` means `remove`, and `mv` means `rename` = on Windows you probably do that with the explorer).
	
The result is a new folder `/your/path/to/weathercontract_user/` somewhere on your disk.

### 3 the correct folder

You need to be INSIDE that new folder, for working with my scripts, e.g. for the *gsoil console*. 
Open a terminal / cmd.exe inside that folder; or open a terminal / cmd.exe and then do `cd /your/path/to/weathercontract_user`. 
Example for windows: 

    cmd.exe
    
    C:
    cd C:\Downloads\weathercontract_user\
    gsoil attach


### 4 add peers

You need to execute `admin.addPeer()` commands, to inform your node of other nodes. There is an `addpeers.js` script here:
[useful/addpeers.js](https://github.com/drandreaskrueger/weathercontract_user/blob/master/useful/addpeers.js). 

So: In a first terminal/cmd.exe, start gsoil (You have done that in 1 above)

    gsoil 


Then in a second terminal / cmd.exe, attach the javascript console:

    gsoil attach
    loadScript("useful/addpeers.js")
    
You should see a "Block synchronisation started" in the first terminal. 
If not, do not continue, but solve this first. Your node must be part of the SOIL network!

You could automate this (as a .BAT or .sh file) for starting gsoil (in the first terminal), by:

    gsoil js /path/to/folder/useful/addpeers.js

(see [#scripts-make-it-easy](#scripts-make-it-easy) below).

### 5 interact via the JS console

In the `gsoil attach` console, you can access node functions, and use Javascript. 
Several Ethereum related packages are preloaded. To explore them, type the name, and hit enter; 
or type the name, and hit the TAB key:

    web3.      + TAB
    personal.  + TAB
    eth.       + TAB
    net.       + TAB
	admin.     + TAB    
	miner.     + TAB
	debug.     + TAB
	
Some examples, just try them out:

    admin.sleepBlocks(1)                       // waits until 1 more block has arrived, and prints its height
    eth.accounts		                       // shows all my account addresses
    eth.accounts[0]                            // shows my first account address
    personal.unlockAccount(eth.accounts[0])    // unlocks my first account
    personal.unlockAccount(eth.accounts[1])    // unlocks my second account
    eth.getBalance(eth.accounts[0])            // balance in my first account in WEI
	web3.fromWei ( eth.getBalance(eth.accounts[0]), "soil")           // same in SOIL

Most commands are explained in the wiki: [JSRE](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console), and [JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC).

### 6 Languages: Solidity (LLL, Serpent,...) - and JavaScript or Python 
I have written the smart contract in `Solidity`([docs](http://solidity.readthedocs.io/en/latest/), 
[github](https://github.com/ethereum/solidity), [gitter](https://gitter.im/ethereum/solidity), 
[repl](https://github.com/raineorshine/solidity-repl), [solgraph](https://github.com/raineorshine/solgraph/)), 
which then gets compiled to EVM code (Ethereum Virtual Machine), 
and deployed into the blockchain. Other languages for writing smart contracts are LLL or Serpent; Solidity 
seems to be the most used now.  This is an excellent time to start learning Solidity, as finally 
[best practices](https://github.com/ConsenSys/smart-contract-best-practices) are found and described.

For speaking to the node, two options are widespread: **JavaScript** (in the `gsoil attach` console), 
or **Python** which I prefer. I am publishing simple example code to access the smart contract in both - 
JavaScript and Python. But the Python library I have written is more advanced, and comfortable to use. 

The purpose of this smart contract `ForecastWeatherAtLocation` is to be **accessed from your own smart contracts**, 
so it does not matter so much which you choose, to learn how to access the contract. If I were you, I would try both. 
I say that, because you could stop here. Your system is ready enough, for *some* of the next manuals. Do something else, 
enjoy your summer. Or:


### 7 Python talks to RPC port

My Python library helps to build apps that interact with smart contracts. 
Most Linux distributions come with Python 2.7 anyways (check `python --version`), 
but you also need the `python-dev` and the `libssl-dev` packages

    apt-get -y install python python-dev libssl-dev

Windows, as usual, is a bit more complicated. Download [Python 2.7](https://www.python.org/downloads/) (not 3.5), 
or [Anaconda](https://www.continuum.io/downloads) with Python 2.7. Edit your .py files simply 
with [Notepad++](https://notepad-plus-plus.org/), or get a full IDE like [Eclipse, with PyDev](http://www.pydev.org/). 

The [wikipedia page Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) is good, 
there is a [Python For Beginners](https://www.python.org/about/gettingstarted/) page, 
and a funny [tutorial](https://docs.python.org/2/tutorial/) if you want to go deeper.

To **access gsoil from Python EthJsonRpc you must start gsoil with open RPC port**, using the switch `--rpc`

	cd weathercontract_user
    gsoil --rpc  --rpcaddr="localhost" js useful/addpeers.js
    
Additional to that "localhost", I have configured my *firewall* so that *only localhost can access port 39421*. 
As an extra security measure, do not keep large amounts of money in your *first* address 
(`eth.coinbase` == `eth.accounts[0]`). Just to be sure. You could create a new wallet address, and move most of your money there. 
There is an excellent [security summary](http://ethereum.stackexchange.com/a/3888/2937). 

#### Scripts make it easy

The [gsoilrpc.BAT](../useful/gsoilrpc.BAT) (windows) and 
[gsoilrpc.sh](../useful/gsoilrpc.sh) (Linux) (Mac?) scripts 
start gsoil with open RPC port, and immediately add peers.

#### Python, pip, EthJsonRpc

To access the commands in Python, I am using the package [ethjsonrpc](https://github.com/ConsenSys/ethjsonrpc), 
installed via `pip` (pip is usually included in python, or can easily with `apt-get install python-pip`, or with
[get-pip.py](https://pip.pypa.io/en/stable/installing/)). Check if pip is there:

    pip --version

`pip` makes it easy to install any of 80k Python packages from [PyPI](https://pypi.python.org). 
Pip gets all dependencies, and then install ethjsonrpc: 

	pip install --upgrade web3 ethjsonrpc     # or
	sudo pip install --upgrade web3 ethjsonrpc
  
It should end with something like `Successfully installed ... Cleaning up...`. Now try it out: 

#### Using EthJsonRpc to talk to the node

Start your `gsoil --rpc` in one terminal, then `python` in a second terminal, 
and behind the python >>> prompt start coding:
    
    import ethjsonrpc, pprint, time, web3
    
    c = ethjsonrpc.EthJsonRpc(port=39421)
    pprint.pprint (dir(c))
    
    c.eth_blockNumber()
    for i in range(30): print c.eth_blockNumber(); time.sleep(2)
    
after the last command you need to press enter once more, to start that loop. It ends after 1 minute. 
Congratulations, you are coding in Python.

Try out more?  python >>>

Infos about the last block:

	block = c.eth_getBlockByNumber(c.eth_blockNumber())
	pprint.pprint(block)
	
	block['difficulty']
	dir(web3.utils.encoding)
	web3.utils.encoding.to_decimal(block['difficulty'])

Your account balances:

	c.eth_accounts()
	acc0 = c.eth_accounts()[0]
	print acc0

	c.eth_getBalance(acc0)
    from_wei = web3.utils.currency.from_wei
	from_wei(c.eth_getBalance(acc0), "ether")

	balanceTotal = sum( [c.eth_getBalance(account) for account in c.eth_accounts()] )
	print balanceTotal 
	from_wei( balanceTotal, "ether")

	
I am looking forward to seeing all the useful tools you are going to build now. 
    

### all manuals:
* [repo README.md](../README.md)
* [text01-introduction.md](../text/text01-introduction.md) also [as PDF](../text/text01-introduction.pdf)
* manual01-overview.md (soon)
* [manual02-preparations.md](manual02-preparations.md) (this file)
* [manual03-console-quickstart.md](manual03-console-quickstart.md) (**new**)
* manual04-console-understand-contract-interface.js (soon)
