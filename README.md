# Voice Links Installation Guide

This guide has been designed for Ubuntu 14.04.3

## Installing EasyRTC

1. Install Node.js with
	`sudo apt-get install nodejs`
2. Download EasyRTC v1.0.16 with
	`git clone -b beta https://github.com/priologic/easyrtc.git`
3. Install npm with
	`sudo apt-get install npm`
3. `cd easyrtc` to open the cloned contents and `npm install`
4. `cd server_example` to open the server directory folder and `npm install`
5. Install screen via package manager with
	`sudo apt-get install screen`
6. Start a screen session with
	`screen -R easyrtc`
7. Run `nodejs server.js` from inside the server_example directory

Note: You can exit the screen session using `ctrl-a + C`

You will now have a working installation of EasyRTC running on Port 8080

You can test this on http://example.com:8080 

HTTPS will not be working, so we will need to configure this

## Configuring HTTPS on EasyRTC

Google Chrome requires HTTPS when using WebRTC

1. Create an SSL key and cert
```
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
cd /opt/letsencrypt
sudo -H ./letsencrypt-auto certonly --standalone -d example.com
```

2. `cd ~/easyrtc/server_example` and `nano server.js`
Remove the following code
```javascript
var http    = require("http");
```

And insert the following code in its place
```javascript
var https = require("https");
var fs = require("fs");
```

Remove the following code
```javascript
var webServer = http.createServer(httpApp).listen(8080);
```

And insert the following code in its place, replacing example.com with your domain
``` javascript
var webServer = https.createServer(
{
	key:	fs.readFileSync("/etc/letsencrypt/live/example.com/privkey.pem"),
	cert:	fs.readFileSync("/etc/letsencrypt/live/example.com/cert.pem"),
	ca:		fs.readFileSync("/etc/letsencrypt/live/example.com/chain.pem")
},
app).listen(8080);
```

4. Run `npm install` from inside the server_example directory again

You can now run `nodejs server.js`

Test inside a browser to see if your configuration worked

## Apache/PHP/MySQL Install

1. Run `sudo apt-get -y install apache2 mysql-server php5-mysql php5 libapache2-mod-php5 php5-mcrypt`
2. Enter password `hh1488yoloswag` for MySQL root password
3. Run `sudo mysql_install_db`
4. Run `sudo mysql_secure_installation`
5. Do not change password unless also changing config.php inside genlinks
6. Follow all defaults

You will now have an installation of the LAMP stack

## Adding the Web App

1. `git clone https://github.com/FireGrey/genlinks.git`
2. `sudo mv ./genlinks /var/www/genlinks/`

## Configuring the Web Server

1. Run `mysql -u root -p < /var/www/genlinks/DB.sql`
2. `nano /etc/apache2/apache2.conf` and add the following
```
<Directory /var/www/genlinks>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```
3. `sudo a2enmod rewrite`
4. `sudo service apache2 restart`
5. `nano /etc/apache2/sites-available/000-default.conf` and add the following
```
<VirtualHost *:80>
	DocumentRoot /var/www/genlinks
	ServerName example.com
</VirtualHost>
```
6. `sudo service apache2 restart`
7. `cd /opt/letsencrypt`
8. `./letsencrypt-auto --apache -d example.com`

## Notes

### Browser Support

Chrome 50.0 -- Well Supported 

Firefox 46.0.1 -- Moderataly Supported (see issues)

### Bugs

1. `No Viable Ice` errors for heavily NAT'ed peers
	* Workaround: Switch to a quieter connection source (3G, VPN)
2. Rare crash in firefox when recording multiple peers
3. Chrome recordings are only saved as webm (inconvient format for audio editing)
	* Waiting for newer version of MediaStreamRecorder
4. HTML5 audio box timer freezes in Chrome with more than 2 peers
	* Likely fixed in later versions of Chrome

### Other

To fix an error with output selection boxed being blank:

Open `chrome://flags` and `enable` `Experimental Web Platform` features on a chrome browser

