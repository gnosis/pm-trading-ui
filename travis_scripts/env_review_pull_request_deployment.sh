#!/bin/bash

# Feature name without all path. Example task/new-interface -> new-interface
FEATURE_NAME=$(basename $TRAVIS_BRANCH)
# Only alphanumeric characters. Example new-interface -> newinterface
FEATURE_NAME_ALPHANUMERIC=$(echo $FEATURE_NAME | sed 's/[^a-zA-Z0-9]//g')

# Feature name without all path. Example gnosis/pm-trading-ui -> pm-trading-ui
REPO_NAME=$(basename $TRAVIS_REPO_SLUG)
# Only alphanumeric characters. Example pm-trading-ui -> pmtradingui
REPO_NAME_ALPHANUMERIC=$(echo $REPO_NAME | sed 's/[^a-zA-Z0-9]//g')

export REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$FEATURE_NAME_ALPHANUMERIC"
