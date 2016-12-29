#!/bin/bash

echo 'Code standards:'
grunt

echo 'Integration tests:'
./node_modules/.bin/mocha
