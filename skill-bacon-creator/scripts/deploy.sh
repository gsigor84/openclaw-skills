#!/bin/bash
# deploy.sh — Manual deploy to OpenClaw skills dir
# skill-bacon-creator v1.1 output
#
# Usage:
#   ./deploy.sh              — interactive deploy with confirmation
#   ./deploy.sh --dry-run    — preview what would happen, no changes made
#   ./deploy.sh --force      — overwrite existing skill (backs up first)
#
# Run from inside the skill-{name}-creator/ folder.

set -euo pipefail

# ── Config ─────────────────────────────────────────────────────────────────

SKILL_NAME="${PWD##*/}"
OPENCLAW_SKILLS="$HOME/.openclaw/skills"
TARGET="$OPENCLAW_SKILLS/$SKILL_NAME"
BACKUP_DIR="$HOME/.openclaw/backups"
DRY_RUN=false
FORCE=false

# ── Flags ──────────────────────────────────────────────────────────────────

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --force)   FORCE=true ;;
    *)
      echo "Unknown flag: $arg"
      echo "Usage: ./deploy.sh [--dry-run] [--force]"
      exit 1
      ;;
  esac
done

# ── Helpers ────────────────────────────────────────────────────────────────

log()  { echo "[deploy] $*"; }
warn() { echo "[deploy] ⚠  $*"; }
fail() { echo "[deploy] ✗  $*"; exit 1; }
ok()   { echo "[deploy] ✓  $*"; }

# ── Pre-flight checks ──────────────────────────────────────────────────────

log "Skill:  $SKILL_NAME"
log "Source: $PWD"
log "Target: $TARGET"
echo ""

# Confirm SKILL.md exists in current dir — safety check
if [ ! -f "$PWD/SKILL.md" ]; then
  fail "No SKILL.md found in $PWD. Are you running this from the skill folder?"
fi

# Confirm OpenClaw skills dir exists
if [ ! -d "$OPENCLAW_SKILLS" ]; then
  fail "OpenClaw skills dir not found at $OPENCLAW_SKILLS. Is OpenClaw installed?"
fi

# ── Dry run ────────────────────────────────────────────────────────────────

if [ "$DRY_RUN" = true ]; then
  log "DRY RUN — no changes will be made"
  echo ""
  if [ -d "$TARGET" ]; then
    warn "Skill already exists at $TARGET"
    warn "Would require --force to overwrite (backup would be created first)"
  else
    ok "Target path is clear — deploy would proceed"
    ok "Would copy: $PWD → $TARGET"
  fi
  echo ""
  log "Files that would be deployed:"
  find . -not -path './.git/*' -not -name '.git' | sort
  exit 0
fi

# ── Existing skill handling ────────────────────────────────────────────────

if [ -d "$TARGET" ]; then
  if [ "$FORCE" = false ]; then
    fail "$SKILL_NAME already exists at $TARGET. Use --force to overwrite (backup created automatically), or rename this skill folder."
  fi

  # Force mode — back up existing before overwrite
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_PATH="$BACKUP_DIR/${SKILL_NAME}_backup_${TIMESTAMP}"
  mkdir -p "$BACKUP_DIR"
  cp -r "$TARGET" "$BACKUP_PATH"
  warn "Existing skill backed up to: $BACKUP_PATH"
  rm -rf "$TARGET"
fi

# ── Confirmation prompt ────────────────────────────────────────────────────

echo "About to deploy:"
echo "  $PWD"
echo "  → $TARGET"
echo ""
read -r -p "Confirm deploy? [y/N] " confirm
case "$confirm" in
  [yY][eE][sS]|[yY]) ;;
  *)
    log "Deploy cancelled."
    exit 0
    ;;
esac

# ── Deploy ─────────────────────────────────────────────────────────────────

mkdir -p "$OPENCLAW_SKILLS"
cp -r "$PWD" "$TARGET"

# Ensure deploy.sh is executable in the deployed copy
chmod +x "$TARGET/scripts/deploy.sh" 2>/dev/null || true

echo ""
ok "Deployed: $SKILL_NAME → $TARGET"
echo ""
log "Next: restart the OpenClaw gateway to load the new skill."
log "      If using systemd:  systemctl restart openclaw"
log "      If using pm2:      pm2 restart openclaw"
log "      If running direct: kill and relaunch the gateway process"
