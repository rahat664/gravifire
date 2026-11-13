# Cleanup plan

No files were deleted during the audit.

1. Establish ownership for duplicate `scripts/` and `Scripts/` trees; compare hashes before consolidating. This is the highest cleanup risk because case-sensitive filesystems treat them as distinct.
2. Separate generated data reports from hand-authored research notes in documentation and CI.
3. Extract mission state commands/selectors from the large M0/M1/M4/M6 components without changing persistence schemas.
4. Add explicit branded route error/loading/not-found components.
5. Review `app-archive`, `Daily doc`, `Setup docs`, and `Study Materials` for historical duplicates before moving anything.
6. Keep procedural game geometry and the M1-only CC0 asset slice clearly labeled; do not delete fallback geometry until all mission routes have approved replacements.
7. Audit legacy narrative strings before each future mission; history should remain available but not be imported as runtime truth.
