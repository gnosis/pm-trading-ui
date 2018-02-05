#!/bin/bash
eval "$(ssh-agent -s)"
chmod 600 .travis/deploy_key
ssh-add .travis/deploy_key

if [ "$TRAVIS_BRANCH" == "master" ]; then
  git remote add deploy dokku@management-beta.gnosis.pm:management-beta.gnosis.pm
  git push deploy master -f
fi
if [ "$TRAVIS_BRANCH" == "development" ]; then
  git remote add deploy dokku@management-dev.gnosis.pm:management-dev.gnosis.pm
  git push deploy development:master -f
fi