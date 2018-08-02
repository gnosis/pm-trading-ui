#!/bin/bash

if [[ ${PROJECT} == "mainnet" ]]; then
  # mainnet
  if [[ ${TRAVIS_BRANCH} == "master" ]] || [[ ${TRAVIS_BRANCH} == ${TRAVIS_TAG} ]]; then
    export GNOSIS_ENV=mainnet/staging;
    export NODE_ENV=production;
  fi
elif [[ ${PROJECT} == "olympia" ]]; then
  # olympia
  if [[ ${TRAVIS_BRANCH} == "master" ]] || [[ ${TRAVIS_BRANCH} == ${TRAVIS_TAG} ]]; then
    export GNOSIS_ENV=olympia/staging;
    export NODE_ENV=production;
  else
    export GNOSIS_ENV=olympia/development;
    export NODE_ENV=development;
  fi
else
  # testnet
  if [[ ${TRAVIS_BRANCH} == "master" ]]; then
    export GNOSIS_ENV=mainnet/staging;
    export NODE_ENV=production;
  else
    export GNOSIS_ENV=mainnet/development;
    export NODE_ENV=development;
  fi
fi
npm run build