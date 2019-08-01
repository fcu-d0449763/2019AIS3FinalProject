#!/bin/sh

install_PATH="$HOME/.wt/lib"
app_manifest_PATH="$HOME/Library/Application Support/Mozilla/NativeMessagingHosts"

if command -v python > /dev/null 2>&1; then
    echo "init dir $app_manifest_PATH"
    mkdir -p $app_manifest_PATH
    mkdir -p $install_PATH
    cp loader.py    $install_PATH
    cd $install_PATH
    chmod +x loader.py
    git clone https://github.com/mazen160/bfac.git
    cd bfac
    sudo python setup.py install
    echo "{\n  \
\"name\": \"WT_loader\",\n  \
\"description\": \"Web Tool Loader\",\n  \
\"path\": \"$install_PATH/loader.py\",\n  \
\"type\": \"stdio\",\n  \
\"allowed_extensions\": [ \"WT_loader@example.com\" ]\n\
}" > "$app_manifest_PATH/WT_loader.json"
    echo "Success!"
else
    echo "You should install Python\n"
fi