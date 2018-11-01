#!/bin/bash

export GNOSIS_ENV=olympia/staging;

if [[ ${TRAVIS_BRANCH} == "master" ]] || [[ -n ${TRAVIS_TAG} ]]; then
  export NODE_ENV=production;
else
  export NODE_ENV=development;
fi

npm run build
PROJECT=embedded npm run build
