#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
evidence_dir="$repo_root/reports/solver/certification/build-evidence"
mkdir -p "$evidence_dir"
texas_dir="${ACADEMY_TEXAS_DIR:-/tmp/academy-independent-texas}"
dcfr_dir="${ACADEMY_DCFR_DIR:-/tmp/academy-independent-dcfr}"

checkout_pin() {
  local source_url="$1" destination="$2" pin="$3"
  if ! test -d "$destination/.git"; then git clone "$source_url" "$destination"; fi
  git -C "$destination" fetch origin "$pin"
  git -C "$destination" checkout --detach "$pin"
  test "$(git -C "$destination" rev-parse HEAD)" = "$pin"
}
checkout_pin https://github.com/bupticybee/TexasSolver.git "$texas_dir" 6dfb65b4d7ed081da509e8d8c3d82138c4708267
checkout_pin https://github.com/kfg021/Postflop-Poker-Solver.git "$dcfr_dir" 2319e0d5f1bd6f5976faf4d1041ff0b49605e192
test -z "$(git -C "$texas_dir" diff --name-only HEAD)"
patch_file="$repo_root/scripts/patches/dcfr-stack-capacity.patch"
if test -z "$(git -C "$dcfr_dir" diff --name-only HEAD)"; then git -C "$dcfr_dir" apply "$patch_file"; fi
git -C "$dcfr_dir" diff HEAD > "$evidence_dir/dcfr-applied.patch"
cmp "$patch_file" "$evidence_dir/dcfr-applied.patch"
sha256sum "$patch_file" > "$evidence_dir/dcfr-patch-sha256.txt"
cmake -S "$texas_dir" -B "$texas_dir/build" -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_POLICY_VERSION_MINIMUM=3.5 > "$evidence_dir/texas-configure.log" 2>&1
cmake --build "$texas_dir/build" --target console_solver -j 2 > "$evidence_dir/texas-build.log" 2>&1
cmake --install "$texas_dir/build" > "$evidence_dir/texas-install.log" 2>&1
cmake -S "$dcfr_dir" -B "$dcfr_dir/build" -G Ninja -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF > "$evidence_dir/dcfr-configure.log" 2>&1
cmake --build "$dcfr_dir/build" --target PostflopSolver -j 2 > "$evidence_dir/dcfr-build.log" 2>&1
chmod u+x "$texas_dir/install/console_solver" "$dcfr_dir/build/PostflopSolver"
sha256sum "$texas_dir/install/console_solver" "$dcfr_dir/build/PostflopSolver" > "$evidence_dir/binary-sha256.txt"
git -C "$texas_dir" rev-parse HEAD > "$evidence_dir/texas-commit.txt"
git -C "$dcfr_dir" rev-parse HEAD > "$evidence_dir/dcfr-commit.txt"
cmake --version > "$evidence_dir/cmake-version.txt"
g++ --version > "$evidence_dir/compiler-version.txt"
cp "$texas_dir/LICENSE" "$evidence_dir/texas-LICENSE"
cp "$dcfr_dir/LICENSE" "$evidence_dir/dcfr-LICENSE"
if test -n "${GITHUB_ENV:-}"; then
  printf 'ACADEMY_TEXAS_DIR=%s\nACADEMY_DCFR_DIR=%s\n' "$texas_dir" "$dcfr_dir" >> "$GITHUB_ENV"
fi
