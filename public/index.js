const div = document.querySelector('div')

const listFragment = new DocumentFragment()
    .appendChild(document.createElement("ul"))

div.before(listFragment)

async function getAllObs() {

    const respons = await fetch('/get-obs', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
        }
    });

    return await respons.json()
}

async function printAllObs() {
    const allObs = await getAllObs();
    console.log(allObs)
    for (const obs of allObs) {
        const newLi = document.createElement("li")
        newLi.textContent = obs.location
        listFragment.appendChild(newLi)
        console.log(obs)
    }
}

printAllObs();
