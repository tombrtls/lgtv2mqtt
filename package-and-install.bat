@echo off

echo "Compiling service to ES5"
cd tv-service
CMD /C "%ProgramFiles%\nodejs\npm" install
CMD /C "%ProgramFiles%\nodejs\npm" run build
echo "Preparing dist folder for packaging"
CMD /C "%ProgramFiles%\nodejs\npm" run postbuild-win
cd ..

echo "Packaging app and service (dist folder contains ES5-compiled service)"
CMD /C ares-package tv-app/ tv-service/dist/

echo "Installing to TV"
CMD /C ares-install .\com.slg.lgtv2mqtt_0.0.1_all.ipk -d emulator

echo "Launching app"
CMD /C ares-launch -d emulator com.slg.lgtv2mqtt