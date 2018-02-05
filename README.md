gnosis-management
------

[![Join the chat at https://gitter.im/gnosis/gnosis-management](https://badges.gitter.im/gnosis/gnosis-management.svg)](https://gitter.im/gnosis/gnosis-management?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Start with `npm start`, server available under `http://localhost:8000/`

Installing gnosis.js
------

This package implements the npm package for gnosis.js as the github repo from [gnosis/gnosis.js](https://github.com/gnosis/gnosis.js)

If you have gnosis.js locally, install it like this: `npm i ../gnosis.js` (if your local gnosis.js installation is in the parent folder)

Running Ganache-Cli
------

In order to run this on a local blockchain, install ganache-cli `npm install ganache-cli -g` and run ganache-cli like so:
`ganache-cli --gasLimit 400000000 -d -h 0.0.0.0`

Afterwards, go into your gnosis folder (either `../gnosis.js` or `./node_modules/@gnosis.pm/gnosisjs/`) and run `npm run migrate` this will deploy all contracts to Ganache.

Running GnosisDB
------
Refer to [gnosisdb's repo](https://github.com/gnosis/gnosisdb)

Quick version:
- Download gnosisdb's repo.
- Go to gnosisdb/gnosisdb/settings/local.py and change the `ETHEREUM_HOST` to your local LAN IP.
- Build the image and start the container with `docker-compose build && docker-compose up`.
- Enter the docker container with `docker-compose run web bash`.
- Inside the docker container run `python manage.py createsuperuser` and create a user.
- Login at `localhost:8000/admin` with the created user.
- Create a periodical task with an interval between 5s and 30s.
- Check the docker-output to see if there were any problems reading from the local blockchain.
