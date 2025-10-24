echo "Installing dependencies and building service"
cd tv-service || exit
npm install || exit
npm run build || exit
echo "Adding service files"
npm run postbuild-linux || exit
cd .. || exit

echo "Packaging app and service"
ares-package tv-app/ tv-service/ || exit

echo "Installing package"
ares-install com.slg.lgtv2mqtt_0.0.1_all.ipk -d tv || exit

echo "Launching app"
ares-launch com.slg.lgtv2mqtt -d tv || exit
