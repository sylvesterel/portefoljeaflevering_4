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

map.getContainer().style.backgroundColor = '#0e1628';

function getColor(count) {
    return count > 200 ? '#002d13' :  // meget mørk grøn
        count > 150 ? '#00441b' :
            count > 100 ? '#006d2c' :
                count > 75  ? '#238b45' :
                count > 50  ? '#238b45' :
                    count > 20  ? '#41ab5d' :
                        count > 10  ? '#74c476' :
                            count > 5   ? '#a1d99b' :
                                count > 0   ? '#c7e9c0' :
                                    '#e5f5e0'; // ingen observationer
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
            const name = feature.properties.label_dk;
            const counted = obsPrMunicipaliti[name] || 0;

            // Tooltip bindes én gang
            layer.bindTooltip(`<b>${name}</b><br>${counted} observationer`, {
                direction: 'top',
                sticky: true
            });

            layer.on('mouseover', () => {
                layer.setStyle({
                    weight: 2,
                    fillOpacity: 1
                });
                layer.openTooltip();
            });

            layer.on('mouseout', () => {
                layer.setStyle({
                    weight: 0.5,
                    fillOpacity: 0.9
                });
                layer.closeTooltip();
            });
        }

    }).addTo(map);
}

addMunicipalities();
