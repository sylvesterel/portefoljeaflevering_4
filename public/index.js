const div = document.querySelector('div')

const listFragment = new DocumentFragment();
const ul = document.createElement('ul');
listFragment.appendChild(ul);

div.appendChild(listFragment);

async function getAllObs() {

    const respons = await fetch('/get-obs', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
        }
    });

    const output = await respons.json()
    return output;
}

async function printAllObs() {
    const allObs = await getAllObs();
    console.log(allObs);
    for (const obs of allObs) {
        const newObs = document.createElement("li");
        const obsH1 = document.createElement('h1')
        const obsH2 = document.createElement('h2')
        obsH1.textContent = obs.location;
        obsH2.textContent = obs.datetime;
        newObs.appendChild(obsH1);
        newObs.appendChild(obsH2);
        ul.appendChild(newObs)
    }
}


printAllObs();
