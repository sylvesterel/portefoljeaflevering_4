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
        style: {
            color: 'black',
            weight: 0.5,
            fillColor: '#df3030',
            fillOpacity: 1
        },

        onEachFeature: (feature, layer) => {
            const name = feature.properties.label_dk
            const counted = obsPrMunicipaliti[name] || 0;

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
