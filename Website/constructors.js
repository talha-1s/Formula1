let constructorData = []; // Store constructors globally

async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:3000/api/constructors');
        constructorData = await response.json();

        renderConstructors(constructorData); // Initial render of all constructors

        // Automatically select and display the first constructor
        if (constructorData.length > 0) {
            const firstConstructor = constructorData[0];
            setDrivers(firstConstructor.constructorId);
            fetchWikipediaDataFromURL(firstConstructor.url);
        }

        // Set up search bar event listener
        const searchBar = document.querySelector('.search-bar');
        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.toLowerCase();
            const filtered = constructorData.filter(constructor =>
                constructor.name.toLowerCase().includes(searchTerm)
            );
            renderConstructors(filtered);
        });
    } catch (error) {
        console.error("Error fetching constructors:", error);
    }
}

function renderConstructors(data) {
    const scrollBox = document.getElementById('scroll-box');
    scrollBox.innerHTML = ''; // Clear previous results

    data.forEach(constructor => {
        const constructorElement = document.createElement('p');
        constructorElement.textContent = constructor.name;
        constructorElement.classList.add('driver-name'); // Reusing class

        constructorElement.addEventListener('click', () => {
            setDrivers(constructor.constructorId);
            fetchWikipediaDataFromURL(constructor.url);
        });

        scrollBox.appendChild(constructorElement);
    });
}

async function setDrivers(constructorId) {
    try {
        const idToFind = Number(constructorId);
        if (isNaN(idToFind)) {
            console.error("Invalid constructor ID:", constructorId);
            return;
        }

        const response = await fetch('http://localhost:3000/api/constructors');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const constructor = data.find(c => Number(c.constructorId) === idToFind);
        if (!constructor) {
            console.error(`Constructor with ID ${idToFind} not found.`);
            return;
        }

        document.getElementById('Dname').textContent = constructor.name || "N/A";
        document.getElementById('Dnationality').textContent = `Nationality: ${constructor.nationality || "N/A"}`;
        document.getElementById('Drdescription').textContent = constructor.description || "N/A";

        console.log("Constructor info updated:", constructor);
    } catch (error) {
        console.error("Error setting constructor:", error);
    }
}

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
