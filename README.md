# Voice Links Installation Guide

**Caveat:** This application is a proof of concept and does not conform to web application security best practices. Caution should be taken before running any of the commands listed in the installation guide. Note that some commands use `example.com` as a placeholder domain.

This guide has been designed for **Ubuntu 14.04.3**

## Installing EasyRTC

1. Install Node.js with
	`sudo apt-get install nodejs`
2. Download EasyRTC v1.0.16 (later versions may work) with
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

Note: You can exit the screen session using `ctrl-a + d`

You will now have a working installation of EasyRTC running on port 8080. Test this by browsing to it in a supported web browser.

## Configuring HTTPS on EasyRTC

Supported browsers require HTTPS when using WebRTC.

1. Create an SSL key and cert, replacing example.com with your domain
	```
	sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
	cd /opt/letsencrypt
	sudo -H ./letsencrypt-auto certonly --standalone -d example.com
	```

2. `cd ~/easyrtc/server_example` and `nano server.js`

3. Remove the following code
	```javascript
	var http    = require("http");
	```

4. Insert the following code in its place
	```javascript
	var https = require("https");
	var fs = require("fs");
	```

5. Remove the following code
	```javascript
	var webServer = http.createServer(httpApp).listen(8080);
	```

6. Insert the following code in its place, replacing example.com with your domain
	``` javascript
	var webServer = https.createServer(
	{
		key:	fs.readFileSync("/etc/letsencrypt/live/example.com/privkey.pem"),
		cert:	fs.readFileSync("/etc/letsencrypt/live/example.com/cert.pem"),
		ca:		fs.readFileSync("/etc/letsencrypt/live/example.com/chain.pem")
	},
	app).listen(8080);
	```

7. Run `npm install` from inside the server_example directory again

You can now run `screen -r easyrtc` and `sudo nodejs server.js` to run EasyRTC with HTTPS support.

Note: You can exit the screen session using `ctrl-a + d`

Test your configuration works inside a supported browser.

## Apache/PHP/MySQL (LAMP) Install

1. Install the required dependancies for Voice Links `sudo apt-get -y install apache2 mysql-server php5-mysql php5 libapache2-mod-php5`
2. Enter password `aREALLYsecurepa$$w0rd` for MySQL root password
	* If you change the password make sure to edit `config.php` with the updated MySQL credentials
3. Run `sudo mysql_install_db`
4. Run `sudo mysql_secure_installation` and follow the instructions - defaults work fine

You will now have a standard LAMP stack installed.

## Cloning the Web App

Clone the `voice-links` web application.

1. `git clone https://github.com/FireGrey/voice-links.git`
2. `sudo mv ./voice-links /var/www/voice-links/`

## Configuring the Web Server

1. Run `mysql -u root -p < /var/www/voice-links/DB.sql`
2. `nano /etc/apache2/apache2.conf` and add the following
	```
	<Directory /var/www/voice-links>
		Options Indexes FollowSymLinks
		AllowOverride All
		Require all granted
	</Directory>
	```
3. `sudo a2enmod rewrite`
4. `sudo service apache2 restart`
5. `nano /etc/apache2/sites-available/000-default.conf` and add the following, replacing example.com with your domain
```
<VirtualHost *:80>
	DocumentRoot /var/www/voice-links
	ServerName example.com
</VirtualHost>
```
6. `sudo service apache2 restart`
7. `cd /opt/letsencrypt`
8. Run `./letsencrypt-auto --apache -d example.com` replacing example.com with your domain

This will configure Voice Links to run at the base URL `example.com/`. If you chose to run Voice Links under a different base URL i.e. `example.com/some-directory/` you will need to update the `RewriteBase` in the `.htaccess` file to match.

## Notes

### Saved Recordings Filename

Recordings are saved for each user in the room. The filename format is the user ID followed by the offset between the user clicking the `Start` recording button and the remote peers microphone being recorded. This allows you to accurately merge the individual recorded files even when peers join the room later than when the recording begun.

`ID-DTcqZTWJCTPy6EqO_Offset-0ms` filename represents the user ID `DTcqZTWJCTPy6EqO` who was already in the room at the time recording begun because their offset is `0ms` zero milliseconds.

`ID-OLoodr8X5G1mCvKe_Offset-18927ms` filename represents user ID `OLoodr8X5G1mCvKe` who joined the room `18927ms` 18.9 seconds after recording begun.

### Browser Support

Chrome 50.0 -- Well Supported 

Firefox 46.0.1 -- Moderataly Supported (see bugs)

### Bugs

1. `No Viable Ice` errors for heavily NAT'ed peers
	* Workaround: Switch to a quieter connection  (3/4G tether from a mobile phone often works, VPN sometimes works)
2. In Firefox, peers who join after recording has started are not included in recording
	* Waiting for newer version of MediaStreamRecorder (possibly v1.3.3)
3. Rare crash in Firefox when recording multiple peers
	* Hard to replicate
4. Chrome recordings are only saved as webm (inconvient format for audio editing)
	* Waiting for newer version of MediaStreamRecorder (possibly v1.3.3)
5. HTML5 audio box timer freezes in Chrome with more than 2 peers
	* Likely fixed in later versions of Chrome
6. Output selection boxes blank for some Chrome users
	* Workaround: Open `chrome://flags` and `enable` `Experimental Web Platform`
7. Output selection only supported by Chrome
	* Likely supported in later versions of Firefox