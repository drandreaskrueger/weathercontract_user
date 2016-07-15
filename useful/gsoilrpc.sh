port=39421

echo
echo 
echo Starting gsoil with open RPC port $port
echo
echo I have configured my firewall so that only localhost can access port $port.
echo I do not keep much money in my first address eth.coinbase - just to be sure.
echo See security summary at http://ethereum.stackexchange.com/a/3888/2937
echo
echo
gsoil --rpc --rpcaddr="localhost" js addpeers.js

