const map = L.map('map');
let listOfMunicipalities;
let listOfPostalCodes;
let listOfObservations;

const denmarkBounds = [
    [54.5, 7.5],
    [57.9, 15.3]
];

map.setMaxBounds(denmarkBounds);
map.fitBounds(denmarkBounds);

map.getContainer().style.backgroundColor = 'white';

function getColor(count) {
    return count > 100 ? '#800026' :
        count > 50 ? '#BD0026' :
        count > 20 ? '#E31A1C' :
        count > 10 ? '#FC4E2A' :
        count > 5 ? '#FD8D3C' :
        count > 0 ? '#FEB24C' :
                    '#FFEDA0';
}

async function fetchDataToList() {
    municipalitiesResponse = await fetch('municipalities.geojson');
    listOfMunicipalities = await municipalitiesResponse.json();

    postalCodesResponse = await fetch('postcode.json');
    listOfPostalCodes = await postalCodesResponse.json();

    const observationResponse = await fetch('/get-obs', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
        }
    });
    listOfObservations = await observationResponse.json()

    return true;
}

// 3. Tegn kommuner med tydelige kanter
async function addMunicipalities() {
    await fetchDataToList();

    const obsPrMunicipaliti = {};

    for (const obs of listOfObservations) {
        const locationArray = obs.location.split(" ")
        const postcode = locationArray[0]
        for (const data of listOfPostalCodes) {
            if (data.nr === postcode) {
                for (const municipaliti of data.kommuner) {
                    if (!obsPrMunicipaliti[municipaliti.navn]) {
                        obsPrMunicipaliti[municipaliti.navn] = 0;
                    }
                    obsPrMunicipaliti[municipaliti.navn]++;
                }
            }
        }
    }
    L.geoJSON(listOfMunicipalities, {
        style: feature => {
            const name = feature.properties.label_dk;
            const counted = obsPrMunicipaliti[name] || 0;
            return {
                color: 'black',
                weight: 0.5,
                fillColor: getColor(counted),
                fillOpacity: 0.9
            };
        },

        onEachFeature: (feature, layer) => {
            const name = feature.properties.label_dk

            layer.bindTooltip(`<b>${name} - ${counted}</b>`, {direction: 'top', sticky: true});

            layer.on('mouseover', () => {
                layer.bindTooltip(`<b>${name} - ${counted}</b>`, {direction: 'top'}).openTooltip();
                layer.setStyle({
                    fillColor: '#305def', // skift farve på hover
                });
            });
            layer.on('mouseout', () => {
                layer.closeTooltip();
                layer.setStyle({
                    fillColor: '#df3030', // tilbage til original farve
                });
            });
        }

    }).addTo(map);
}

addMunicipalities();
