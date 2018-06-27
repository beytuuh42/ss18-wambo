SET mypath=%~dp0
cd %mypath:~0,-1%
cd /d "server"
call npm install
start npm start

cd /d ".."
cd /d "app"
call npm install
call ionic serve --lab --platform android