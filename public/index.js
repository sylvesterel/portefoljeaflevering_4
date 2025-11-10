const map = L.map('map'); //Import map fra index. Leaflet er importet i index.html.

let listOfMunicipalities;
let listOfPostalCodes;
let listOfObservations;
let observationPerMunicipaliti = {};

const munName = document.querySelector('#mun-name')
const munAmount = document.querySelector('#mun-amount')
const munPeriod = document.querySelector('#mun-period')

// Sætter Danmarks grænser for ikke at se resten af verdens kortet

const denmarkBounds = [
    [54.5, 7.5],
    [57.9, 15.3]
];

map.setMaxBounds(denmarkBounds);
map.fitBounds(denmarkBounds);

map.getContainer().style.backgroundColor = '#0e1628';

function getColor(count) { //getColor er lavet af chatGPT
    return count > 200 ? '#002d13' :  // meget mørk grøn
        count > 150 ? '#00441b' :
            count > 100 ? '#006d2c' :
                count > 75 ? '#238b45' :
                    count > 50 ? '#238b45' :
                        count > 20 ? '#41ab5d' :
                            count > 10 ? '#74c476' :
                                count > 5 ? '#a1d99b' :
                                    count > 0 ? '#c7e9c0' :
                                        '#e5f5e0'; // ingen observationer
}

// Henter data om danske kommuner fra en geoJSON, postnumre fra en postcode.json der kommer fra DAWA API
// og henter observationer fra vores server.js, som henter fra en MySQL database.

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

async function getObservationPrMunicipaliti() {
    for (const observation of listOfObservations) {
        const locationArray = observation.location.split(" ")
        const postcode = locationArray[0]
        for (const data of listOfPostalCodes) {
            if (data.nr !== postcode) {
                continue;
            }
            for (const municipaliti of data.kommuner) {
                const name = municipaliti.navn
                if (!observationPerMunicipaliti[name]) {
                    observationPerMunicipaliti[name] = 0;
                }
                observationPerMunicipaliti[name]++;
            }

        }
    }
}

// Tegner kommuner og tæller antal observationer pr. kommune.
// Fordi at en kommune kan have flere postkoder, bruger vi en postcode.json som fortæller hvilken kommune hver postnumre ligger i.
// Postcode.json kommer fra et DAWA api endpoint.

async function displayMuniciplaitis() {

    await fetchDataToList(); // Fetcher data om observationer, kommuner og postnumre til vores lister

    await getObservationPrMunicipaliti(); // Laver et object med antal observationer pr. kommune ud fra postnumre.

    L.geoJSON(listOfMunicipalities, {
        style: feature => {
            const name = feature.properties.label_dk;
            const counted = observationPerMunicipaliti[name] || 0;
            return {
                color: 'black',
                weight: 0.5,
                fillColor: getColor(counted),
                fillOpacity: 0.9
            };
        },

        onEachFeature: (feature, layer) => {
            const name = feature.properties.label_dk;

            layer.bindTooltip(name, {direction: 'top', sticky: true});

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
            layer.on('click', () => {
                const counted = observationPerMunicipaliti[name] || 0;
                munName.textContent = `Valgte kommune: ${name}`
                munAmount.textContent = `Antal observationer: ${counted}`
                munPeriod.textContent = `Periode: 10. oktober 1995 - 12. december 2023`
            });
        }

    }).addTo(map);
}

displayMuniciplaitis();
