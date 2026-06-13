#!/usr/bin/env bash
# Create a GitHub Release on the current repo and upload every artifact under release/.
#
# Usage:
#   bash scripts/release-publish.sh [tag]
#
# Tag defaults to v<version-from-package.json>.
# Requires the `gh` CLI to be installed and authenticated (gh auth login).

set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="$(node -p "require('./package.json').version")"
TAG="${1:-v${VERSION}}"
TITLE="各平台客户端 ${TAG}"
BODY_FILE="$(mktemp)"

trap 'rm -f "$BODY_FILE"' EXIT

cat > "$BODY_FILE" <<EOF
提供 Windows 64 位、iPhone、Android 客户端。
如出现异常，请清除应用缓存即可。

本 fork 在 [moli-xia/global-radio](https://github.com/moli-xia/global-radio) 的客户端壳基础上新增多用户登录、服务端数据同步、HLS 流代理等能力。

构建版本: ${VERSION}
EOF

command -v gh >/dev/null 2>&1 || { echo "gh CLI not installed (brew install gh)"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh CLI not authenticated. Run: gh auth login"; exit 1; }

ASSETS=()
shopt -s nullglob
for f in release/*.apk release/*.ipa release/*.exe; do
  ASSETS+=("$f")
done
shopt -u nullglob

if [ "${#ASSETS[@]}" -eq 0 ]; then
  echo "No artifacts found in release/. Run scripts/release-build.sh first."
  exit 1
fi

echo "Tag:    $TAG"
echo "Title:  $TITLE"
echo "Assets:"
printf '  - %s\n' "${ASSETS[@]}"

if gh release view "$TAG" >/dev/null 2>&1; then
  echo "Release $TAG already exists — uploading (and overwriting) assets..."
  gh release upload "$TAG" "${ASSETS[@]}" --clobber
else
  gh release create "$TAG" "${ASSETS[@]}" \
    --title "$TITLE" \
    --notes-file "$BODY_FILE" \
    --latest
fi

echo
echo "Done. Open: $(gh release view "$TAG" --json url -q .url)"
