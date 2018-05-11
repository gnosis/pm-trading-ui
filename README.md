pm-trading-ui
------

[![Join the chat at https://gitter.im/gnosis/pm-trading-ui](https://badges.gitter.im/gnosis/pm-trading-ui.svg)](https://gitter.im/gnosis/pm-trading-ui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Builds at Travis-CI](https://travis-ci.org/gnosis/pm-trading-ui.svg?branch=master)](https://travis-ci.org/gnosis/pm-trading-ui)
Start with `npm start`, server available under `http://localhost:8000/`

Quickstart with Docker/Docker Compose
-----

### Install Docker and Docker Compose
* First, install docker: https://docs.docker.com/engine/installation/.
* Then, install docker compose: https://docs.docker.com/compose/install/
* Clone the repository and change your working directory:

```
git clone https://github.com/gnosis/pm-trading-ui.git
cd pm-trading-ui
```

### Build containers
The application is made up of several container images that are linked together using docker-compose. Before running the application, build the images:

`docker-compose build --force-rm`

### Running the Application

```
docker-compose up
```

*Application will run on `http://localhost:8080`*


Installing `pm-js`
------

This package implements the npm package for pm-js for interaction with prediction markets. See the github repo from [gnosis/pm-js](https://github.com/gnosis/pm-js)

If you're working with pm-js locally, you can add it to your installation like this: `npm i ../pm-js` (if your `pm-js` repo is in the parent folder) this will [npm-link](https://docs.npmjs.com/cli/link) and you're free to make changes there too

Running `pm-trading-db`
------
Refer to [pm-trading-db's repo](https://github.com/gnosis/pm-trading-db)

Quick version:
- Clone pm-trading-db's repo.
- Go to pm-trading-db/settings/local.py and change the `ETHEREUM_HOST` to your *local LAN IP* (localhost won't work as this is a docker container).
- Build the image and start the container with `docker-compose build && docker-compose up`.
- Enter the docker container with `docker-compose run web bash`.
- Inside the docker container run `python manage.py createsuperuser` and create a user.
- Login at `localhost:8000/admin` with the created user.
- Create a periodical task with an interval between 5s and 30s.
- Check the docker-output to see if there were any problems reading from the local blockchain.

Running Ganache-Cli
------

In order to run this on a local blockchain, install ganache-cli `npm install ganache-cli -g` and run ganache-cli like so:
`ganache-cli --gasLimit 400000000 -d -h 0.0.0.0`

Afterwards, go into your gnosis folder (either `../gnosis.js` or `./node_modules/@gnosis.pm/gnosisjs/`) and run `npm run migrate` this will deploy all contracts to Ganache.
