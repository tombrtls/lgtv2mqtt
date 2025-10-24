@echo off

echo "Installing dependencies and building service"
cd tv-service
CMD /C "%ProgramFiles%\nodejs\npm" install
CMD /C "%ProgramFiles%\nodejs\npm" run build
echo "Adding service files"
CMD /C "%ProgramFiles%\nodejs\npm" run postbuild-win
cd ..

echo "Packaging app and service"
CMD /C ares-package tv-app/ tv-service/

echo "Installing package"
CMD /C ares-install .\com.slg.lgtv2mqtt_0.0.1_all.ipk -d emulator

echo "Launching app"
CMD /C ares-launch com.slg.lgtv2mqtt -d emulator