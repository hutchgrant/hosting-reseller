# Hosting Reseller

This is a nodejs DigitalOcean hosting reseller application. It's primarily for development at the moment, though it's a good demonstration of what can be achieved utilizing DigitalOcean's API.

![alt text](https://github.com/hutchgrant/hosting-reseller/raw/master/screenshots/screenshot.png "DigitalOcean Hosting Reseller")

More Screenshots [1](https://github.com/hutchgrant/hosting-reseller/raw/master/screenshots/screenshot2.png), [2](https://github.com/hutchgrant/hosting-reseller/raw/master/screenshots/screenshot3.png), [3](https://github.com/hutchgrant/hosting-reseller/raw/master/screenshots/screenshot_admin.png), [4](https://github.com/hutchgrant/hosting-reseller/raw/master/screenshots/screenshot_admin2.png)

## Features

- Create/view a droplet with any digitalocean image, size, region
- Basic Domain Management

## Prerequisites

- mongo
- npm
- nodejs
- bower 
- nodemon

## Manual Install

```
git clone https://github.com/hutchgrant/hosting-reseller.git
cd hosting-reseller
sudo npm install bower nodemon -g
npm install
bower install
```

## Launch

```
npm run start
```

Access at http://localhost:3000

## Configure

- Register an account, the first account registered will have admin access.  
- Login, go to the "Account" drop down in the top right, select "Administration".  
- Select Preferences -> DigitalOcean from the left hand side, to enter and save your API Key.  Once successful, all digitalocean images, regions, sizes will be synced to your mongodb.  
- You may also wish to change the brand name, tagline, and copyright. Do this from the same admin panel, select Preferences-> site

## Development

Compile/watch sass and js files

```
npm run watch-css

```

## License

hosting-reseller is available under the [Apache 2.0 License](https://github.com/hutchgrant/hosting-reseller/blob/master/LICENSE).

## Contributing

All contributions will be placed under the same Apache 2.0 license, contributers must agree to that license.
For more information see [contributing](https://github.com/hutchgrant/hosting-reseller/blob/master/CONTRIBUTING.md).

## Author

**Grant Hutchinson (hutchgrant)**
