gnosis-management
------

Start with `npm start`, server available under `http://localhost:8000/`

Installing gnosis.js
------

This package comes with two gnosis.js installation methods in its `package.json` either install gnosis.js locally in `../` and install the optional dependency or if you prefer, just use the github url that is currently installed. `gnosis/gnosis.js`

Running Test-RPC
------

In order to run this on a local blockchain, install testrpc `npm install testrpc` and run test-rpc like so:
```testrpc --gasLimit 400000000 -d -h 0.0.0.0```

Afterwards, go into your gnosis folder (either `../gnosis.js` or `./node_modules/@gnosis.pm/gnosisjs/`) and run `npm run migrate` this will deploy all contracts to TestRPC.

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