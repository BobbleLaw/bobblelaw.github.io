#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(dirname -- "$SCRIPT_DIR")
RESUME_DIR="$PROJECT_DIR/resume"
OUTPUT_DIR="$PROJECT_DIR/static/resume"
TEMP_ROOT="$PROJECT_DIR/tmp/pdfs"

if ! command -v latexmk >/dev/null 2>&1; then
  echo "latexmk is required to build the resume." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR" "$TEMP_ROOT"
BUILD_DIR=$(mktemp -d "$TEMP_ROOT/resume.XXXXXX")
trap 'rm -rf "$BUILD_DIR"' EXIT HUP INT TERM

(
  cd "$RESUME_DIR"
  latexmk \
    -pdf \
    -interaction=nonstopmode \
    -halt-on-error \
    -outdir="$BUILD_DIR" \
    resume.tex
)

cp "$BUILD_DIR/resume.pdf" "$OUTPUT_DIR/resume.pdf"
echo "Built $OUTPUT_DIR/resume.pdf"
