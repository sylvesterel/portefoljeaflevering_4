// Kildedata pr. måned (Jan..Dec) for hvert år
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dataByYear = {
    2025: [1,0,1,1,1,0,4,0,1,0,1,1],
    2026: [5,0,1,3,1,4,3,0,1,3,0,0],
    2027: [3,2,2,0,2,0,0,3,2,2,1,2],
    2028: [2,0,1,1,3,1,1,1,2,1,0,0],
    2029: [0,1,2,2,2,1,3,0,1,0,2,1],
    2030: [3,0,2,0,4,1,1,2,2,0,0,1],
};

// Årstotaler til første visning
const yearlyTotals = Object.entries(dataByYear).map(([year, arr]) => ({
    year: Number(year),
    total: arr.reduce((a,b) => a + b, 0)
}));

const colors = {
    year: '#4f46e5',
    months: '#ff6b00'
};

// Byg datasæt til årsvisning
function buildYearlyDataset() {
    return {
        labels: yearlyTotals.map(d => d.year),
        datasets: [{
            label: 'Observationer pr. år',
            data: yearlyTotals.map(d => d.total),
            backgroundColor: colors.year
        }],
        title: 'UFO-observationer pr. år'
    };
}

// Byg datasæt til månedsvisning for et givet år
function buildMonthlyDataset(year) {
    const arr = dataByYear[year] ?? [];
    return {
        labels: monthNames,
        datasets: [{
            label: `Observationer pr. måned (${year})`,
            data: arr,
            backgroundColor: colors.months
        }],
        title: `UFO-observationer pr. måned – ${year}`
    };
}

// Init chart (start med årsoversigt)
const ctx = document.querySelector('#chart').getContext('2d');
const initial = buildYearlyDataset();
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: initial.labels,
        datasets: initial.datasets
    },
    options: {
        animation: { duration: 600 },
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            title: { display: true, text: initial.title },
            legend: { display: true, position: 'bottom' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { title: { display: true, text: 'År / Måned' } },
            y: { beginAtZero: true, title: { display: true, text: 'Antal observationer' }, ticks: { precision: 0 } }
        }
    }
});

// Opdateringsfunktioner
function showYear(year) {
    const v = buildMonthlyDataset(year);
    chart.data.labels = v.labels;
    chart.data.datasets = v.datasets;
    chart.options.plugins.title.text = v.title;
    chart.update();
}

function showYearly() {
    const v = buildYearlyDataset();
    chart.data.labels = v.labels;
    chart.data.datasets = v.datasets;
    chart.options.plugins.title.text = v.title;
    chart.update();
}

// Knap-handlers
document.getElementById('btn-2026').addEventListener('click', () => showYear(2026));
document.getElementById('btn-2027').addEventListener('click', () => showYear(2027));
document.getElementById('btn-2028').addEventListener('click', () => showYear(2028));
document.getElementById('btn-2029').addEventListener('click', () => showYear(2029));
document.getElementById('btn-2030').addEventListener('click', () => showYear(2030));
document.getElementById('btn-back').addEventListener('click', showYearly);

document.getElementById('btn-weather')
    .addEventListener('click', () => {
        window.open('https://www.yr.no/nb', '_blank', 'noopener');
    });

