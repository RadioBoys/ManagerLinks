let links = '';
document.addEventListener('DOMContentLoaded', () => {
    getData();

    // Show links of data
    document.querySelector('#showForHacking').addEventListener('click', () => {
        const dataToParse = JSON.parse(links);
        const listLinks = dataToParse.Hacking;
        displayLinks(listLinks);
    });
    document.querySelector('#showForFunny').addEventListener('click', () => {
        const dataToParse = JSON.parse(links);
        const listLinks = dataToParse.Funny;
        displayLinks(listLinks);
    });

    document.querySelector('#btn-search').addEventListener('click', () => {
        const inputFilter = document.querySelector('#choices-text-preset-values').value;
        filterLinks(inputFilter);
    })

});
// Fetch data from "links.json" file
async function getData() {
    const response = await fetch('./src/links.json');
    if (!response.ok) {
        throw new Error('Network error');
    }
    links = await response.text();
}

// Show links to display
function displayLinks(links) {
    const divLinks = document.querySelector('#links');
    divLinks.innerHTML = '';
    links.forEach(link => {
        const linkElement = document.createElement('div');
        linkElement.innerHTML = `
        <div style="margin-top: 10px;">
        <a href="${link.url}" target="_blank" style="color:#ff3ac5; text-decoration: none;">${link.name}</a>
        </div>
        <div>
                ${link.tag.map(tag => `<span style="margin-right: 5px; color: #cccccc;">${tag}</span>`).join('')}
            </div>
        `;
        divLinks.appendChild(linkElement);
    });
}


// Function filter
function filterLinks(inputFilter) {
    const textFilter = inputFilter.toLowerCase();
    if (textFilter === ''){
        return;
    }

    const dataToParse = JSON.parse(links); // Parse the links data
    const filteredLinks = [];

    // Filter links from both categories
    for (const category in dataToParse) {
        const categoryLinks = dataToParse[category];
        const matchingLinks = categoryLinks.filter(link => link.name.toLowerCase().includes(textFilter) || link.tag.some(tag => tag.toLowerCase().includes(textFilter)));
        filteredLinks.push(...matchingLinks); // Add matching links to the filtered array
    }
    displayLinks(filteredLinks); // Display the filtered links
}