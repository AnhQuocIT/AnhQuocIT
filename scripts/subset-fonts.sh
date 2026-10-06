#!/usr/bin/env bash
# Subset JetBrains Mono + IBM Plex Sans to glyphs used in profile.yml
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PY="${ROOT}/.venv/bin/python"
FT="${ROOT}/.venv/bin/pyftsubset"
FONT_DIR="${ROOT}/assets/fonts"
SRC="${FONT_DIR}/src"

mkdir -p "${SRC}" "${FONT_DIR}"

JB_REG="${SRC}/JetBrainsMono-Regular.ttf"
JB_MED="${SRC}/JetBrainsMono-Medium.ttf"
PX_REG="${SRC}/IBMPlexSans-Regular.ttf"
PX_MED="${SRC}/IBMPlexSans-Medium.ttf"

PLEX_SRC="${FONT_DIR}/IBM-Plex-Sans/fonts/complete/ttf"
if [[ ! -f "${PX_REG}" && -f "${PLEX_SRC}/IBMPlexSans-Regular.ttf" ]]; then
  cp "${PLEX_SRC}/IBMPlexSans-Regular.ttf" "${PX_REG}"
  cp "${PLEX_SRC}/IBMPlexSans-Medium.ttf" "${PX_MED}"
fi

if [[ ! -f "${PX_REG}" ]]; then
  echo "IBM Plex Sans TTF missing."
  exit 1
fi

cd "${ROOT}"
UNICODES="$("${PY}" scripts/_unicodes.py)"

subset_one() {
  local in="$1" out="$2"
  "${FT}" "${in}" \
    --unicodes="${UNICODES}" \
    --flavor=woff2 \
    --layout-features=kern,liga \
    --desubroutinize \
    --output-file="${out}"
  echo "Wrote ${out} ($(wc -c < "${out}" | tr -d ' ') bytes)"
}

subset_one "${JB_REG}" "${FONT_DIR}/JetBrainsMono-Regular.woff2"
subset_one "${JB_MED}" "${FONT_DIR}/JetBrainsMono-Medium.woff2"
subset_one "${PX_REG}" "${FONT_DIR}/IBMPlexSans-Regular.woff2"
subset_one "${PX_MED}" "${FONT_DIR}/IBMPlexSans-Medium.woff2"

echo "Done."
