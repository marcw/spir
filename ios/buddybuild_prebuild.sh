#!/usr/bin/env bash

# Change the bundle id
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier net.delatech.ios.spir" "$BUDDYBUILD_WORKSPACE/ios/Spir/Info.plist"
