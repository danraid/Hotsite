#!/usr/bin/env sh
set -eu
root="${1:-docs/specs}"
max=0
if [ -d "$root" ]; then
  for path in "$root"/SPEC-*; do
    [ -e "$path" ] || continue
    name=$(basename "$path")
    id=$(printf '%s' "$name" | sed -n 's/^SPEC-\([0-9][0-9]*\).*/\1/p')
    [ -n "$id" ] || continue
    id=$(printf "%s" "$id" | sed "s/^0*//")
    [ -n "$id" ] || id=0
    [ "$id" -gt "$max" ] && max="$id"
  done
fi
printf 'SPEC-%03d\n' $((max + 1))
