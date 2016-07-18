# dependencies
apt-get install -y binutils bison gcc make libgmp3-dev build-essential

# golang
curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.6.linux-amd64.tar.gz
mkdir -p ~/go/bin; echo "export GOPATH=$HOME/go" >> ~/.bashrc
echo "export PATH=\$PATH:$HOME/go/bin:/usr/local/go/bin" >> ~/.bashrc
source ~/.bashrc

### swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=2000
sudo chmod 600 /swapfile; sudo mkswap /swapfile; sudo swapon /swapfile

# gsoil
mkdir ~/soil
cd ~/soil
git clone https://github.com/soilcurrency/go-ethereum.git
cd go-ethereum
make gsoil
ln -s ~/soil/go-ethereum/build/bin/gsoil ~/go/bin/
cd ~

# if you have a synced blockchain somewhere
mkdir -p ~/.soil/chaindata
username=yourusername
hostname=host.name.domain
scp -r $username@$hostname:/home/$username/.soil/chaindata/* ~/.soil/chaindata/

# if not, just let it sync (can take many hours

# continue in manual02 
# https://github.com/drandreaskrueger/weathercontract_user/blob/master/manual/manual02-preparations.md

