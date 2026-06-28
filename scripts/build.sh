#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

export NODE_ENV="${NODE_ENV:-production}"

# 清理
rm -rf "$ROOT/dist"

# 标准 Vite 构建：产物输出到 dist/，符合 GitHub Pages 约定
pnpm vite build

echo "Build complete → dist/"