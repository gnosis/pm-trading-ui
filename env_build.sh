#!/bin/bash

if [[ ${PROJECT} == "mainnet" ]]; then
  # mainnet
  if [[ ${TRAVIS_BRANCH} == "master" ]]; then
    export GNOSIS_ENV=mainnet/staging;
    export NODE_ENV=production;
  fi
elif [[ ${PROJECT} == "olympia" ]]; then
  # olympia
  if [[ ${TRAVIS_BRANCH} == "master" ]]; then
    export GNOSIS_ENV=olympia/staging;
    export NODE_ENV=production;
  else
    export GNOSIS_ENV=olympia/development;
    export NODE_ENV=development;
  fi
else
  # testnet
  if [[ ${TRAVIS_BRANCH} == "master" ]]; then
    export GNOSIS_ENV=staging;
    export NODE_ENV=production;
  else
    export GNOSIS_ENV=development;
    export NODE_ENV=development;
  fi
fi
npm run build