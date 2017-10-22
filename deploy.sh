#!/bin/bash
eval "$(ssh-agent -s)"
chmod 600 .travis/deploy_key
ssh-add .travis/deploy_key

if [ "$TRAVIS_BRANCH" == "master" ]; then
  git remote add deploy dokku@olympia-staging.gnosis.pm:olympia-staging.gnosis.pm
  git push deploy development:master -f
fi
if [ "$TRAVIS_BRANCH" == "development" ]; then
  git remote add deploy dokku@olympia-dev.gnosis.pm:olympia-dev.gnosis.pm
  git push deploy development:master -f
fi
