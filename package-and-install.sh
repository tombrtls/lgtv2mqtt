#!/bin/bash
set -e

echo "Compiling service to ES5"
cd tv-service
npm install
npm run build
echo "Preparing dist folder for packaging"
npm run postbuild-linux
cd ..

echo "Packaging app and service (dist folder contains ES5-compiled service)"
ares-package tv-app/ tv-service/dist/

echo "Installing to TV"
ares-install com.slg.lgtv2mqtt_0.0.1_all.ipk -d tv

echo "Done! Service compiled to ES5 and installed."
