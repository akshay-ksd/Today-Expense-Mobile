#!/bin/bash

# File paths
GRADLE_FILE="./android/app/build.gradle"
COMPONENT_FILE="./src/components/molecules/version/version.tsx"

# Read the current versionCode from the gradle file
VERSION_CODE=$(grep versionCode $GRADLE_FILE | awk '{print $2}')
# Increment the versionCode
NEW_VERSION_CODE=$((VERSION_CODE + 1))

# Read the current versionName from the gradle file
VERSION_NAME=$(grep versionName $GRADLE_FILE | awk '{print $2}' | tr -d '"')
# Increment the versionName
IFS='.' read -r -a VERSION_PARTS <<< "$VERSION_NAME"
LAST_INDEX=$((${#VERSION_PARTS[@]} - 1))
VERSION_PARTS[$LAST_INDEX]=$((VERSION_PARTS[$LAST_INDEX] + 1))
NEW_VERSION_NAME=$(IFS=.; echo "${VERSION_PARTS[*]}")

# Update the versionCode in the gradle file
sed -i "" "s/versionCode $VERSION_CODE/versionCode $NEW_VERSION_CODE/" $GRADLE_FILE

# Update the versionName in the gradle file
sed -i "" "s/versionName \"$VERSION_NAME\"/versionName \"$NEW_VERSION_NAME\"/" $GRADLE_FILE

# Update the versionName in the React Native component
sed -i "" "s/V:- $VERSION_NAME/V:- $NEW_VERSION_NAME/" $COMPONENT_FILE

echo "Version updated successfully to versionCode $NEW_VERSION_CODE and versionName $NEW_VERSION_NAME"
