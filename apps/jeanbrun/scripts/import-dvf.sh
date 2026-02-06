#!/bin/bash
#
# Import DVF (Demandes de Valeurs Foncieres) depuis data.gouv.fr
# Usage: ./import-dvf.sh [year]
#

set -e

YEAR=${1:-2024}
DATA_DIR="/root/simulateur_loi_Jeanbrun/data"
TEMP_DIR="/tmp/dvf_import"

echo "=== Import DVF ${YEAR} ==="
echo ""

# Creer dossiers
mkdir -p "$DATA_DIR" "$TEMP_DIR"

# URL du fichier
DVF_URL="https://files.data.gouv.fr/geo-dvf/latest/csv/${YEAR}/full.csv.gz"
OUTPUT_FILE="${TEMP_DIR}/dvf_${YEAR}.csv.gz"

# Telecharger si pas deja present
if [ ! -f "$OUTPUT_FILE" ]; then
    echo "Telechargement DVF ${YEAR}..."
    curl -L -o "$OUTPUT_FILE" "$DVF_URL"
    echo "Telechargement termine: $(ls -lh $OUTPUT_FILE | awk '{print $5}')"
else
    echo "Fichier deja present: $OUTPUT_FILE"
fi

# Decompresser et traiter
echo ""
echo "Traitement des donnees..."

# Compter les transactions
NB_TOTAL=$(zcat "$OUTPUT_FILE" | wc -l)
echo "Nombre total de lignes: $NB_TOTAL"

# Extraire header
HEADER=$(zcat "$OUTPUT_FILE" | head -1)
echo "Colonnes: $(echo $HEADER | tr ',' '\n' | wc -l)"

# Calculer prix m2 par commune
echo ""
echo "Calcul prix m2 par commune..."

zcat "$OUTPUT_FILE" | \
  awk -F',' '
    NR == 1 { next }
    # Filtrer appartements et maisons avec prix et surface
    $24 ~ /Appartement|Maison/ && $5 != "" && $23 != "" && $23 > 0 {
      code_commune = $11
      nom_commune = $12
      type_local = $24
      prix = $5
      surface = $23

      # Calculer prix m2
      prix_m2 = prix / surface

      # Filtrer prix aberrants
      if (prix_m2 >= 500 && prix_m2 <= 30000) {
        communes[code_commune]["nom"] = nom_commune
        communes[code_commune]["count"]++
        communes[code_commune]["sum"] += prix_m2
        communes[code_commune]["values"][communes[code_commune]["count"]] = prix_m2
      }
    }
    END {
      print "code_commune,nom_commune,nb_transactions,prix_m2_moyen"
      for (code in communes) {
        moyenne = communes[code]["sum"] / communes[code]["count"]
        if (communes[code]["count"] >= 5) {
          printf "%s,%s,%d,%.2f\n", code, communes[code]["nom"], communes[code]["count"], moyenne
        }
      }
    }
  ' > "${DATA_DIR}/prix_m2_${YEAR}.csv"

NB_COMMUNES=$(wc -l < "${DATA_DIR}/prix_m2_${YEAR}.csv")
echo "Communes avec donnees: $((NB_COMMUNES - 1))"
echo "Fichier: ${DATA_DIR}/prix_m2_${YEAR}.csv"

# Apercu
echo ""
echo "Top 10 communes par prix m2:"
tail -n +2 "${DATA_DIR}/prix_m2_${YEAR}.csv" | \
  sort -t',' -k4 -nr | \
  head -10 | \
  while IFS=',' read code nom nb prix; do
    printf "  %-30s %8.2f EUR/m2 (%d transactions)\n" "$nom" "$prix" "$nb"
  done

echo ""
echo "=== Import termine ==="
