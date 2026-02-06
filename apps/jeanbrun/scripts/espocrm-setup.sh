#!/bin/bash

# Script d'installation et gestion EspoCRM pour Simulateur Loi Jeanbrun
# Usage: ./espocrm-setup.sh [command]

set -e

API_URL="https://espocrm.expert-ia-entreprise.fr/api/v1"
API_KEY="${ESPOCRM_API_KEY}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_api_key() {
    if [ -z "$API_KEY" ]; then
        log_error "Variable ESPOCRM_API_KEY non définie"
        echo "Exporter la clé API: export ESPOCRM_API_KEY='votre_cle'"
        exit 1
    fi
}

# Test connexion API
test_connection() {
    log_info "Test de connexion à EspoCRM..."

    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/Contact?maxSize=1" \
        -H "X-Api-Key: $API_KEY")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        log_success "Connexion réussie à EspoCRM"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        log_error "Échec de connexion (HTTP $HTTP_CODE)"
        echo "$BODY"
        exit 1
    fi
}

# Créer une ville de test
create_test_ville() {
    local ville_name=${1:-"Lyon"}

    log_info "Création de la ville de test: $ville_name..."

    case $ville_name in
        "Lyon")
            JSON_DATA='{
                "name": "Lyon",
                "cSlug": "lyon",
                "cCodePostal": ["69001", "69002", "69003", "69004", "69005", "69006", "69007", "69008", "69009"],
                "cDepartement": "69",
                "cRegion": "Auvergne-Rhône-Alpes",
                "cLatitude": 45.764043,
                "cLongitude": 4.835659,
                "cPopulation": 520000,
                "cZoneFiscale": "A",
                "cPrixM2Moyen": 4850.00,
                "cPrixM2Median": 4500.00,
                "cEvolutionPrix1An": 2.3,
                "cLoyerM2Moyen": 14.20,
                "cTensionLocative": "forte",
                "cPlafondLoyerIntermediaire": 12.80,
                "cPlafondLoyerSocial": 10.20,
                "cPlafondLoyerTresSocial": 8.50,
                "cMetaTitle": "Investir en Loi Jeanbrun à Lyon : Simulation et Programmes 2026",
                "cMetaDescription": "Simulez votre investissement loi Jeanbrun à Lyon. Prix m² 4850€, programmes neufs éligibles, plafonds de loyers."
            }'
            ;;
        "Paris")
            JSON_DATA='{
                "name": "Paris",
                "cSlug": "paris",
                "cCodePostal": ["75001", "75002", "75003", "75004", "75005", "75006", "75007", "75008", "75009", "75010", "75011", "75012", "75013", "75014", "75015", "75016", "75017", "75018", "75019", "75020"],
                "cDepartement": "75",
                "cRegion": "Île-de-France",
                "cLatitude": 48.856614,
                "cLongitude": 2.352222,
                "cPopulation": 2165000,
                "cZoneFiscale": "A_bis",
                "cPrixM2Moyen": 10500.00,
                "cPrixM2Median": 9800.00,
                "cEvolutionPrix1An": 1.5,
                "cLoyerM2Moyen": 28.50,
                "cTensionLocative": "tres_forte",
                "cPlafondLoyerIntermediaire": 17.62,
                "cPlafondLoyerSocial": 13.04,
                "cPlafondLoyerTresSocial": 10.44,
                "cMetaTitle": "Investir en Loi Jeanbrun à Paris : Simulation et Programmes 2026",
                "cMetaDescription": "Simulez votre investissement loi Jeanbrun à Paris. Prix m² 10500€, programmes neufs éligibles, plafonds de loyers zone A bis."
            }'
            ;;
        "Bordeaux")
            JSON_DATA='{
                "name": "Bordeaux",
                "cSlug": "bordeaux",
                "cCodePostal": ["33000", "33100", "33200", "33300"],
                "cDepartement": "33",
                "cRegion": "Nouvelle-Aquitaine",
                "cLatitude": 44.837789,
                "cLongitude": -0.579180,
                "cPopulation": 257000,
                "cZoneFiscale": "A",
                "cPrixM2Moyen": 5200.00,
                "cPrixM2Median": 4900.00,
                "cEvolutionPrix1An": 3.1,
                "cLoyerM2Moyen": 15.80,
                "cTensionLocative": "forte",
                "cPlafondLoyerIntermediaire": 12.80,
                "cPlafondLoyerSocial": 10.20,
                "cPlafondLoyerTresSocial": 8.50,
                "cMetaTitle": "Investir en Loi Jeanbrun à Bordeaux : Simulation et Programmes 2026",
                "cMetaDescription": "Simulez votre investissement loi Jeanbrun à Bordeaux. Prix m² 5200€, marché dynamique, programmes neufs éligibles."
            }'
            ;;
        *)
            log_error "Ville $ville_name non reconnue (Lyon, Paris, Bordeaux)"
            exit 1
            ;;
    esac

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cVille" \
        -H "X-Api-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$JSON_DATA")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        log_success "Ville $ville_name créée"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        log_error "Échec création ville (HTTP $HTTP_CODE)"
        echo "$BODY"
        exit 1
    fi
}

# Lister toutes les villes
list_villes() {
    log_info "Récupération des villes..."

    RESPONSE=$(curl -s -X GET "$API_URL/cVille?maxSize=50&orderBy=name&order=asc" \
        -H "X-Api-Key: $API_KEY")

    echo "$RESPONSE" | jq -r '.list[] | "\(.name) (\(.cDepartement)) - Zone \(.cZoneFiscale) - Prix m²: \(.cPrixM2Moyen)€"' 2>/dev/null || echo "$RESPONSE"
}

# Créer un programme de test
create_test_programme() {
    local ville_id=$1

    if [ -z "$ville_id" ]; then
        log_error "Usage: create_test_programme <ville_id>"
        exit 1
    fi

    log_info "Création d'un programme de test..."

    JSON_DATA='{
        "name": "Les Terrasses du Parc",
        "cSlug": "terrasses-parc-lyon",
        "cPromoteur": "Nexity",
        "cVilleId": "'$ville_id'",
        "cAdresse": "123 Avenue du Parc, Lyon 3ème",
        "cLatitude": 45.760000,
        "cLongitude": 4.850000,
        "cPrixMin": 195000,
        "cPrixMax": 450000,
        "cPrixM2Moyen": 4500,
        "cNbLotsTotal": 85,
        "cNbLotsDisponibles": 32,
        "cTypesLots": ["T2", "T3", "T4"],
        "cDateLivraison": "2026-12-31",
        "cEligibleJeanbrun": true,
        "cZoneFiscale": "A",
        "description": "<p>Résidence neuve au cœur du 3ème arrondissement de Lyon, à proximité du Parc de la Tête d Or. 85 appartements du T2 au T4 avec terrasses et balcons.</p>",
        "cStatut": "disponible",
        "cSourceApi": "test-manual",
        "cIdExterne": "TEST-NEXITY-001"
    }'

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cProgramme" \
        -H "X-Api-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$JSON_DATA")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        log_success "Programme créé"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        log_error "Échec création programme (HTTP $HTTP_CODE)"
        echo "$BODY"
        exit 1
    fi
}

# Créer une simulation de test
create_test_simulation() {
    local ville_id=$1
    local programme_id=$2

    if [ -z "$ville_id" ]; then
        log_error "Usage: create_test_simulation <ville_id> [programme_id]"
        exit 1
    fi

    log_info "Création d'une simulation de test..."

    if [ -z "$programme_id" ]; then
        JSON_DATA='{
            "name": "Simulation Lyon '$(date +%Y-%m-%d)'",
            "cType": "avancee",
            "cVilleId": "'$ville_id'",
            "cMontantInvestissement": 250000,
            "cApport": 50000,
            "cDureeEmprunt": 20,
            "cTauxEmprunt": 3.5,
            "cRevenusAnnuels": 60000,
            "cTMI": "30",
            "cNiveauLoyer": "intermediaire",
            "cSurfaceLogement": 55,
            "cLoyerMensuelEstime": 880,
            "cAmortissementAnnuel": 8000,
            "cEconomieImpotAnnuelle": 2400,
            "cEconomieImpotTotale": 21600,
            "cRendementBrut": 4.2,
            "cRendementNet": 2.8,
            "cCashFlowMensuel": -150
        }'
    else
        JSON_DATA='{
            "name": "Simulation Lyon '$(date +%Y-%m-%d)'",
            "cType": "avancee",
            "cVilleId": "'$ville_id'",
            "cProgrammeId": "'$programme_id'",
            "cMontantInvestissement": 250000,
            "cApport": 50000,
            "cDureeEmprunt": 20,
            "cTauxEmprunt": 3.5,
            "cRevenusAnnuels": 60000,
            "cTMI": "30",
            "cNiveauLoyer": "intermediaire",
            "cSurfaceLogement": 55,
            "cLoyerMensuelEstime": 880,
            "cAmortissementAnnuel": 8000,
            "cEconomieImpotAnnuelle": 2400,
            "cEconomieImpotTotale": 21600,
            "cRendementBrut": 4.2,
            "cRendementNet": 2.8,
            "cCashFlowMensuel": -150
        }'
    fi

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cSimulation" \
        -H "X-Api-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$JSON_DATA")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        log_success "Simulation créée"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        log_error "Échec création simulation (HTTP $HTTP_CODE)"
        echo "$BODY"
        exit 1
    fi
}

# Statistiques
stats() {
    log_info "Statistiques EspoCRM Simulateur Loi Jeanbrun"
    echo ""

    # Villes
    VILLES=$(curl -s -X GET "$API_URL/cVille?maxSize=1" -H "X-Api-Key: $API_KEY" | jq -r '.total' 2>/dev/null || echo "N/A")
    echo "📍 Villes: $VILLES"

    # Programmes
    PROGRAMMES=$(curl -s -X GET "$API_URL/cProgramme?maxSize=1" -H "X-Api-Key: $API_KEY" | jq -r '.total' 2>/dev/null || echo "N/A")
    echo "🏗️  Programmes: $PROGRAMMES"

    # Agences
    AGENCES=$(curl -s -X GET "$API_URL/cAgence?maxSize=1" -H "X-Api-Key: $API_KEY" | jq -r '.total' 2>/dev/null || echo "N/A")
    echo "🏢 Agences: $AGENCES"

    # Simulations
    SIMULATIONS=$(curl -s -X GET "$API_URL/cSimulation?maxSize=1" -H "X-Api-Key: $API_KEY" | jq -r '.total' 2>/dev/null || echo "N/A")
    echo "🧮 Simulations: $SIMULATIONS"
}

# Quick setup (3 villes de test)
quick_setup() {
    log_info "Quick setup: création de 3 villes de test (Lyon, Paris, Bordeaux)"
    echo ""

    create_test_ville "Lyon"
    echo ""
    create_test_ville "Paris"
    echo ""
    create_test_ville "Bordeaux"
    echo ""

    log_success "Quick setup terminé"
    echo ""
    list_villes
}

# Show usage
usage() {
    cat << EOF
Usage: ./espocrm-setup.sh [command]

Commandes disponibles:

  test                     Tester la connexion API
  stats                    Afficher les statistiques

  create-ville [nom]       Créer une ville (Lyon, Paris, Bordeaux)
  list-villes              Lister toutes les villes

  create-programme <id>    Créer un programme de test (nécessite ID ville)
  create-simulation <id>   Créer une simulation de test (nécessite ID ville)

  quick-setup              Créer 3 villes de test rapidement

Exemples:

  # Tester la connexion
  ./espocrm-setup.sh test

  # Quick setup
  ./espocrm-setup.sh quick-setup

  # Créer une ville
  ./espocrm-setup.sh create-ville Lyon

  # Lister les villes
  ./espocrm-setup.sh list-villes

  # Afficher les stats
  ./espocrm-setup.sh stats

Prérequis:

  export ESPOCRM_API_KEY='votre_clé_api'

EOF
}

# Main
main() {
    echo "================================================"
    echo "  EspoCRM Setup - Simulateur Loi Jeanbrun"
    echo "================================================"
    echo ""

    check_api_key

    case "${1:-}" in
        test)
            test_connection
            ;;
        stats)
            stats
            ;;
        create-ville)
            create_test_ville "${2:-Lyon}"
            ;;
        list-villes)
            list_villes
            ;;
        create-programme)
            if [ -z "$2" ]; then
                log_error "ID ville requis"
                echo "Usage: ./espocrm-setup.sh create-programme <ville_id>"
                exit 1
            fi
            create_test_programme "$2"
            ;;
        create-simulation)
            if [ -z "$2" ]; then
                log_error "ID ville requis"
                echo "Usage: ./espocrm-setup.sh create-simulation <ville_id> [programme_id]"
                exit 1
            fi
            create_test_simulation "$2" "$3"
            ;;
        quick-setup)
            quick_setup
            ;;
        *)
            usage
            ;;
    esac
}

main "$@"
