let allCircuits = []; // Store all circuits globally

// Fetch circuits and initialize UI
async function fetchCircuits() {
    try {
        const response = await fetch('http://localhost:3000/api/circuits');
        allCircuits = await response.json();

        renderCircuitList(allCircuits);

        if (allCircuits.length > 0) {
            const firstCircuit = allCircuits[0];
            setCircuit(firstCircuit.circuitId);
            fetchWikipediaDataFromURL(firstCircuit.url);
        }

        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const filtered = allCircuits.filter(c =>
                c.name.toLowerCase().includes(query)
            );
            renderCircuitList(filtered);
        });
    } catch (error) {
        console.error("Error fetching circuits:", error);
    }
}

// Render circuit list in scroll-box
function renderCircuitList(list) {
    const scrollBox = document.getElementById('scroll-box');
    scrollBox.innerHTML = '';

    if (list.length === 0) {
        const noResult = document.createElement('p');
        noResult.textContent = 'No circuits found.';
        noResult.classList.add('driver-name');
        scrollBox.appendChild(noResult);
        return;
    }

    list.forEach(circuit => {
        const item = document.createElement('p');
        item.textContent = circuit.name;
        item.classList.add('driver-name');

        item.addEventListener('click', () => {
            setCircuit(circuit.circuitId);
            fetchWikipediaDataFromURL(circuit.url);
            document.getElementById('search-input').value = '';
            renderCircuitList(allCircuits);
        });

        scrollBox.appendChild(item);
    });
}

// Set selected circuit info
async function setCircuit(circuitId) {
    try {
        const circuit = allCircuits.find(c => Number(c.circuitId) === Number(circuitId));
        if (!circuit) return console.error(`Circuit ID ${circuitId} not found.`);

        document.getElementById('Dname').textContent = circuit.name || "N/A";
        document.getElementById('Dlocation').textContent = `Location: ${circuit.location || "N/A"}`;
        document.getElementById('Dcountry').textContent = `Country: ${circuit.country || "N/A"}`;
        document.getElementById('Drdescription').textContent = circuit.description || "N/A";
    } catch (error) {
        console.error("Error setting circuit info:", error);
    }
}

// Fetch Wikipedia summary and image
async function fetchWikipediaDataFromURL(wikiURL) {
    try {
        const pageTitle = wikiURL.split("/wiki/")[1];
        if (!pageTitle) {
            console.error("Invalid Wikipedia URL");
            return;
        }

        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${pageTitle}&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=500`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const pages = data.query.pages;
        const page = Object.values(pages)[0];
        if (page.missing) {
            console.warn(`Wikipedia page not found for ${pageTitle}`);
            return;
        }

        const introText = page.extract || "No introduction available.";
        const imageUrl = page.thumbnail ? page.thumbnail.source : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

        document.getElementById("Drdescription").textContent = introText;
        document.getElementById("driver-img").src = imageUrl;
    } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", fetchCircuits);
