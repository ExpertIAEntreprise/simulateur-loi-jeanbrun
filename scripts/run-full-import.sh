#!/bin/bash
#
# Pipeline complet d'import des donnees
# Usage: ./run-full-import.sh [--skip-dvf] [--skip-agences]
#
# Documentation: ../docs/SCRAPING-PIPELINE.md
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_DIR/data"
LOG_DIR="$PROJECT_DIR/logs"

# Options
SKIP_DVF=false
SKIP_AGENCES=false

for arg in "$@"; do
  case $arg in
    --skip-dvf)
      SKIP_DVF=true
      ;;
    --skip-agences)
      SKIP_AGENCES=true
      ;;
  esac
done

# Setup
mkdir -p "$DATA_DIR" "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/import_${TIMESTAMP}.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_firecrawl() {
  if curl -s http://127.0.0.1:3003/health | grep -q "ok"; then
    return 0
  else
    return 1
  fi
}

# Banner
echo "=============================================="
echo "  PIPELINE IMPORT DONNEES - Loi Jeanbrun"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================================="
echo ""

log "Demarrage pipeline import"
log "Repertoire: $PROJECT_DIR"
log "Options: skip-dvf=$SKIP_DVF skip-agences=$SKIP_AGENCES"

# Etape 1: Communes
echo ""
echo "=== ETAPE 1: Import Communes (API Geo) ==="
log "Etape 1: Import communes"

if [ -f "$DATA_DIR/communes.json" ]; then
  AGE_DAYS=$(( ($(date +%s) - $(stat -c %Y "$DATA_DIR/communes.json")) / 86400 ))
  if [ $AGE_DAYS -lt 30 ]; then
    log "Communes deja a jour (age: ${AGE_DAYS}j)"
    echo "Skip: fichier < 30 jours"
  else
    node "$SCRIPT_DIR/import-communes.js" 2>&1 | tee -a "$LOG_FILE"
  fi
else
  node "$SCRIPT_DIR/import-communes.js" 2>&1 | tee -a "$LOG_FILE"
fi

# Etape 2: Loyers
echo ""
echo "=== ETAPE 2: Import Loyers (MTE) ==="
log "Etape 2: Import loyers"

node "$SCRIPT_DIR/import-loyers.js" 2>&1 | tee -a "$LOG_FILE"

# Etape 3: DVF
echo ""
echo "=== ETAPE 3: Import DVF (data.gouv.fr) ==="
log "Etape 3: Import DVF"

if [ "$SKIP_DVF" = true ]; then
  log "DVF skipped par option"
  echo "Skip: option --skip-dvf"
else
  if [ -f "$DATA_DIR/prix_m2_2024.csv" ]; then
    AGE_DAYS=$(( ($(date +%s) - $(stat -c %Y "$DATA_DIR/prix_m2_2024.csv")) / 86400 ))
    if [ $AGE_DAYS -lt 30 ]; then
      log "DVF deja a jour (age: ${AGE_DAYS}j)"
      echo "Skip: fichier < 30 jours"
    else
      bash "$SCRIPT_DIR/import-dvf.sh" 2024 2>&1 | tee -a "$LOG_FILE"
    fi
  else
    bash "$SCRIPT_DIR/import-dvf.sh" 2024 2>&1 | tee -a "$LOG_FILE"
  fi
fi

# Etape 4: Agences
echo ""
echo "=== ETAPE 4: Scraping Agences (Firecrawl) ==="
log "Etape 4: Scraping agences"

if [ "$SKIP_AGENCES" = true ]; then
  log "Agences skipped par option"
  echo "Skip: option --skip-agences"
else
  if check_firecrawl; then
    log "Firecrawl OK"
    node "$SCRIPT_DIR/scrape-agences.js" --limit 10 2>&1 | tee -a "$LOG_FILE"
  else
    log "ERREUR: Firecrawl non disponible"
    echo "ERREUR: Firecrawl non disponible sur 127.0.0.1:3003"
    echo "Lancer: /root/scripts/firecrawl-monitor.sh auto-heal"
  fi
fi

# Resume
echo ""
echo "=============================================="
echo "  RESUME"
echo "=============================================="

log "Pipeline termine"

echo ""
echo "Fichiers generes:"
ls -lh "$DATA_DIR"/*.json "$DATA_DIR"/*.csv 2>/dev/null | while read line; do
  echo "  $line"
done

echo ""
echo "Statistiques:"
if [ -f "$DATA_DIR/communes.json" ]; then
  NB_COMMUNES=$(cat "$DATA_DIR/communes.json" | grep -c '"code":' || echo 0)
  echo "  Communes: $NB_COMMUNES"
fi
if [ -f "$DATA_DIR/loyers_2025.json" ]; then
  NB_LOYERS=$(cat "$DATA_DIR/loyers_2025.json" | grep -c '"code_commune":' || echo 0)
  echo "  Loyers: $NB_LOYERS enregistrements"
fi
if [ -f "$DATA_DIR/agences.json" ]; then
  NB_AGENCES=$(cat "$DATA_DIR/agences.json" | grep -c '"nom":' || echo 0)
  echo "  Agences: $NB_AGENCES"
fi

echo ""
echo "Log complet: $LOG_FILE"
echo ""
