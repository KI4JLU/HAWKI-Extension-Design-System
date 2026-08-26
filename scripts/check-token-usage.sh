#!/usr/bin/env bash
# Guardrail for the styling contract (KI-568): fails when a component's
# <style> block references a primitive color token or a literal color value
# instead of a semantic alias. Card 11 turns this into an eslint rule.
#
# Usage: scripts/check-token-usage.sh [path-to-scan]
# Defaults to scanning src/ (where migrated components will live).

set -euo pipefail

TARGET="${1:-src}"

if [ ! -d "$TARGET" ]; then
    echo "check-token-usage: nothing to scan at '$TARGET' (skipping)"
    exit 0
fi

FAIL=0

# 1. Primitive color tokens used directly instead of a semantic alias.
PRIMITIVE_HITS=$(grep -rnE -- '--color-accent-(100|200|300|400|500|600|700|800|900|dark-[0-9]+)\b' \
    --include="*.svelte" "$TARGET" || true)

if [ -n "$PRIMITIVE_HITS" ]; then
    echo "✗ Primitive color token referenced directly (use a semantic alias instead):"
    echo "$PRIMITIVE_HITS" | sed 's/^/    /'
    FAIL=1
fi

# 2. Literal color values (hex / rgb() / oklch() / hsl()) anywhere in a
#    component, including as var() fallbacks. currentColor/transparent/inherit
#    are not literal colors and are allowed.
LITERAL_HITS=$(grep -rnE '(oklch\(|hsl\(|rgb\(|#[0-9a-fA-F]{3,8}\b)' \
    --include="*.svelte" "$TARGET" || true)

if [ -n "$LITERAL_HITS" ]; then
    echo "✗ Literal color value found (reference a token instead, including in var() fallbacks):"
    echo "$LITERAL_HITS" | sed 's/^/    /'
    FAIL=1
fi

if [ "$FAIL" -eq 0 ]; then
    echo "✓ No primitive-token or literal-color usage found in $TARGET"
fi

exit $FAIL
