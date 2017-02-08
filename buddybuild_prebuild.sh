#!/usr/bin/env bash

# Change the bundle id
echo "Changing the bundle id of Info.plist at path $BUDDYBUILD_WORKSPACE/ios/Spir/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier net.delatech.ios.spir" "$BUDDYBUILD_WORKSPACE/ios/Spir/Info.plist"
