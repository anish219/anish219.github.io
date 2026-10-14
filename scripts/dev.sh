#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
node scripts/build-mermaid.mjs
rm -rf _site
./node_modules/.bin/eleventy --watch &
watch_pid=$!
trap 'kill "$watch_pid" 2>/dev/null || true' EXIT
python3 scripts/serve.py
