@echo off

rem _ default RPC port for SOIL is 39421
set PORT=39421

rem _ If you get a 
rem _   'gsoil' is not recognized as an internal or external command, 
rem _   operable program or batch file.
rem _ then find the folder on your disk where gsoil.exe lives, 
rem _   example (easier if you avoid spaces in pathnames):
rem _   set GSOILEXEPATH=C:\cryptos\soil\SOILsafe-win64\resources\node\gsoil\
set GSOILEXEPATH=

echo _
echo _
echo _ Starting gsoil with open RPC port %PORT%
echo _
echo _ I have configured my firewall so that only localhost can access port %PORT%.
echo _ I do not keep much money in my first address eth.coinbase - just to be sure.
echo _
echo _

%GSOILEXEPATH%gsoil --rpc --rpcaddr="localhost" js addpeers.js

echo _
pause

