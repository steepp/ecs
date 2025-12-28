#!/bin/bash

deno run --allow-net -R mock/denoSocket.js &
server_pid=$!

sleep 2

file="index.html"
url="http://localhost:3000/"

if [[ ! -f "$file" ]]; then
        echo "file does not exist: $file"
        exit 1
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        start "$url"
else
        xdg-open "$url"
fi

wait $server_pid
