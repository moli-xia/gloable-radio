#!/usr/bin/env bash
# Build GlobalRadio client shells for Android / iOS / Windows.
#
# Usage:
#   bash scripts/release-build.sh [android|ios|windows|all]
#
# Outputs are copied into ./release/ using upstream-compatible filenames:
#   release/GlobalRadio-v<version>.apk
#   release/GlobalRadio-<version>.ipa            (only if Xcode is available)
#   release/GlobalRadio_<version>_x64-setup.exe  (electron-builder NSIS, x64)

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

VERSION="$(node -p "require('./package.json').version")"
TARGET="${1:-all}"

mkdir -p "$ROOT/release"

log()   { printf "\n\033[1;36m==>\033[0m %s\n" "$*"; }
warn()  { printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
fatal() { printf "\n\033[1;31m[fatal]\033[0m %s\n" "$*"; exit 1; }

ensure_node_modules() {
  if [ ! -d node_modules ]; then
    log "Installing npm dependencies (npm ci)..."
    npm ci
  fi
}

sync_shell_to_capacitor() {
  log "Syncing shell/ into Capacitor projects (npx cap sync)..."
  npx cap sync
}

build_android() {
  log "Building Android APK (release, version $VERSION)"
  ensure_node_modules

  # Capacitor 5 expects compileSdkVersion 33-35 — use whichever platform we have.
  if [ -z "${ANDROID_HOME:-}" ] && [ -d "$HOME/Library/Android/sdk" ]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
  fi
  if [ -z "${ANDROID_HOME:-}" ] && [ -d "$HOME/Android/Sdk" ]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
  fi
  [ -n "${ANDROID_HOME:-}" ] || fatal "ANDROID_HOME not set and no SDK found under ~/Library/Android/sdk or ~/Android/Sdk"

  log "Using ANDROID_HOME=$ANDROID_HOME"
  echo "sdk.dir=$ANDROID_HOME" > android/local.properties

  npx cap sync android

  pushd android >/dev/null
  ./gradlew clean assembleRelease --no-daemon
  popd >/dev/null

  local APK_SRC="android/app/build/outputs/apk/release/app-release.apk"
  [ -f "$APK_SRC" ] || fatal "APK not produced at $APK_SRC"
  cp "$APK_SRC" "release/GlobalRadio-v${VERSION}.apk"
  log "APK -> release/GlobalRadio-v${VERSION}.apk"
}

build_ios() {
  log "Building iOS IPA (version $VERSION)"
  if [ "$(uname -s)" != "Darwin" ]; then
    warn "iOS build requires macOS — skipping."
    return
  fi
  if ! command -v xcodebuild >/dev/null 2>&1; then
    warn "xcodebuild not on PATH (only Xcode Command Line Tools?). Install full Xcode then re-run."
    return
  fi
  if ! xcodebuild -version >/dev/null 2>&1; then
    warn "xcodebuild non-functional — full Xcode required. Skipping iOS."
    return
  fi
  if ! command -v pod >/dev/null 2>&1; then
    warn "CocoaPods (pod) not installed. Run: brew install cocoapods. Skipping iOS."
    return
  fi

  ensure_node_modules
  npx cap sync ios

  pushd ios/App >/dev/null
  pod install
  local BUILD_DIR
  BUILD_DIR="$(mktemp -d)"
  xcodebuild \
    -workspace App.xcworkspace \
    -scheme App \
    -configuration Release \
    -sdk iphoneos \
    -archivePath "$BUILD_DIR/App.xcarchive" \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO \
    archive

  # Hand-craft the IPA from the archive's .app (unsigned)
  mkdir -p "$BUILD_DIR/Payload"
  cp -R "$BUILD_DIR/App.xcarchive/Products/Applications/App.app" "$BUILD_DIR/Payload/"
  (cd "$BUILD_DIR" && zip -qry "GlobalRadio-${VERSION}.ipa" Payload)
  cp "$BUILD_DIR/GlobalRadio-${VERSION}.ipa" "$ROOT/release/"
  popd >/dev/null
  log "IPA -> release/GlobalRadio-${VERSION}.ipa (unsigned)"
}

build_windows() {
  log "Building Windows EXE (electron-builder, x64, version $VERSION)"
  ensure_node_modules

  if [ "$(uname -s)" = "Darwin" ] || [ "$(uname -s)" = "Linux" ]; then
    warn "Cross-compiling Windows installer from $(uname -s)."
    warn "electron-builder will download required tools; if it asks for wine, install: brew install --cask wine-stable"
  fi

  npx electron-builder --win --x64 --publish=never

  local EXE="dist-desktop/GlobalRadio_${VERSION}_x64-setup.exe"
  if [ ! -f "$EXE" ]; then
    # fall back to whatever electron-builder produced
    EXE="$(ls dist-desktop/*x64*setup*.exe 2>/dev/null | head -n1 || true)"
  fi
  [ -n "$EXE" ] && [ -f "$EXE" ] || fatal "Windows installer not found in dist-desktop/"
  cp "$EXE" "release/GlobalRadio_${VERSION}_x64-setup.exe"
  log "EXE -> release/GlobalRadio_${VERSION}_x64-setup.exe"
}

case "$TARGET" in
  android) build_android ;;
  ios)     build_ios ;;
  windows) build_windows ;;
  all)
    build_android || warn "Android build failed/skipped"
    build_ios     || warn "iOS build failed/skipped"
    build_windows || warn "Windows build failed/skipped"
    ;;
  *)
    fatal "Unknown target: $TARGET (use android|ios|windows|all)"
    ;;
esac

log "Artifacts under release/:"
ls -la release/
