#!/bin/bash
cd ./
BUCKET_NAME=bucket-config.json
CREDENTIAL_FILE=google-config.json
if [ -z "$BUCKET_NAME" ]
then
    if [ -z "$CREDENTIAL_FILE" ]
    then
        echo "No bucket and creds name provided"
        exit 1
    else
        echo "No bucket name provided"
        exit 1
    fi
else 
    echo "Bucket name: $BUCKET_NAME"
    echo "Credential file: $CREDENTIAL_FILE"
    echo "Starting..."
    yarn build
    yarn start
fi
