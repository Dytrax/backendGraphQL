#!/bin/sh

# bin/upload-avatar.sh -- final revision

curl $1 \
  -F operations='{ "query": "mutation ($file: Upload!) { uploadImgProduct(file: $file) { uri filename mimetype encoding } }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@$2
