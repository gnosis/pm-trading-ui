#!/bin/bash

export GNOSIS_ENV=olympia/staging;

if [[ ${TRAVIS_BRANCH} == "master" ]]; then
  export NODE_ENV=production;
else
  export NODE_ENV=development;
fi

npm run build