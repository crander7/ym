#!/bin/bash

# ./deploy/build_img.sh

# Example script to run the docker image in production
rm -f *.tar
docker pull node:9-alpine

# run `npm install`
# takes a while since sass needs to be compiled from its c++ source
# SKIP this step if you already have a recent npm container
docker build -t ym.npm -f deploy/Dockerfile_00_npm.df .

docker build -t ym.webpack -f deploy/Dockerfile_01_webpack.df .

# # then copy the build `static/dist` directory for use elsewhere
docker run --name ym_webpack ym.webpack /bin/sh -c 'yarn build'
docker cp ym_webpack:/npm_build/build/ - > build
docker cp ym_webpack:/npm_build/build/ - > static_dist.tar
docker rm ym_webpack

# # install the prod only npm modules
docker build -t ym.app_npm -f deploy/Dockerfile_03_app_npm.df .

docker build -t ym.app -f deploy/Dockerfile_04_app.df .

# to run the app and watch output:
# docker run --rm -t -i -p 3000:31383 -e NODE_ENV=development --net bridge ym.app

# run the app in the background
# docker run -d -p 3000:31383 -e NODE_ENV=development --net bridge ym.app

# run the command line in order to debug things
# docker run --rm -t -i -p 3000:3000 -e NODE_ENV=development --net bridge ym.app /bin/sh