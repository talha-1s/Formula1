let allDrivers = []; // Store all drivers globally for filtering

// Fetch drivers and initialize search functionality
async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:3000/api/drivers');
        allDrivers = await response.json();

        renderDriverList(allDrivers); // Show full list initially

        // Auto-select and show the first driver
        if (allDrivers.length > 0) {
            const firstDriver = allDrivers[0];
            setDrivers(firstDriver.driverId);
            fetchWikipediaDataFromURL(firstDriver.url);
        }

        // Set up live search filter
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            const filteredDrivers = allDrivers.filter(driver =>
                `${driver.forename} ${driver.surname}`.toLowerCase().includes(query)
            );
            renderDriverList(filteredDrivers);
        });

    } catch (error) {
        console.error("Error fetching drivers:", error);
    }
}

// Render driver list into scroll-box
function renderDriverList(driverList) {
    const scrollBox = document.getElementById('scroll-box');
    scrollBox.innerHTML = '';

    if (driverList.length === 0) {
        const noResult = document.createElement('p');
        noResult.textContent = 'No drivers found.';
        noResult.classList.add('driver-name');
        scrollBox.appendChild(noResult);
        return;
    }

    driverList.forEach(driver => {
        const driverElement = document.createElement('p');
        driverElement.textContent = `${driver.forename} ${driver.surname}`;
        driverElement.classList.add('driver-name');

        driverElement.addEventListener('click', () => {
            setDrivers(driver.driverId);
            fetchWikipediaDataFromURL(driver.url);
            document.getElementById('search-input').value = ''; // Clear search
            renderDriverList(allDrivers); // Reset full list
        });

        scrollBox.appendChild(driverElement);
    });
}

// Set driver details when a name is clicked
async function setDrivers(driverID) {
    try {
        const idToFind = Number(driverID);
        if (isNaN(idToFind)) {
            console.error("Invalid driver ID:", driverID);
            return;
        }

        const driver = allDrivers.find(d => Number(d.driverId) === idToFind);
        if (!driver) {
            console.error(`Driver with ID ${idToFind} not found.`);
            return;
        }

        // Format date of birth from ISO string to dd/mm/yyyy
        let formattedDOB = "N/A";
        if (driver.dob) {
            const dateObj = new Date(driver.dob);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = dateObj.getFullYear();
            formattedDOB = `${day}/${month}/${year}`;
        }

        document.getElementById('Dname').textContent = `${driver.forename} ${driver.surname}` || "N/A";
        document.getElementById('Dnationality').textContent = `Nationality: ${driver.nationality || "N/A"}`;
        document.getElementById('Drdob').textContent = `Date of Birth: ${formattedDOB}`;
        document.getElementById('Dteam').textContent = `Team: ${driver.team || "N/A"}`;
        document.getElementById('Drdescription').textContent = driver.description || "N/A";

        console.log("Driver info updated:", driver);
    } catch (error) {
        console.error("Error setting driver:", error);
    }
}



// Fetch bio + image from Wikipedia
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
