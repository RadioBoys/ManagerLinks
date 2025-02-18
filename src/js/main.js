
const API_KEY = ''
const SPREADSHEET_ID = ''
const Sheet1 = ''
const Sheet2 = ''
const HEADERS = ['Tên', 'URL', 'Tag']; //Change headers to match your Sheet

let cachedData = {
    Sheet1: null,
    Sheet2: null
};

// Initialize event listeners on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#showSheet1').addEventListener('click', () => loadData(Sheet1));
    document.querySelector('#showSheet2').addEventListener('click', () => loadData(Sheet2));
    document.querySelector('#btn-search').addEventListener('click', handleSearch);
});

// Load data from a specific sheet and display it
async function loadData(sheetName) {
    if (cachedData[sheetName]) {
        displayData(cachedData[sheetName].values);
    } else {
        const data = await fetchData(sheetName);
        cachedData[sheetName] = data; // Cache the fetched data
        displayData(data.values);
    }
}

// Handle search functionality
async function handleSearch() {
    const inputFilter = document.querySelector('#choices-text-preset-values').value;
    const textFilter = inputFilter.toLowerCase().trim();
    if (!textFilter) return;

    // Check if both sheets are cached
    const sheet1Data = cachedData[Sheet1] || await fetchData(Sheet1);
    const sheet2Data = cachedData[Sheet2] || await fetchData(Sheet2);

    // Combine the data from both sheets
    const combinedData = [...sheet1Data.values, ...sheet2Data.values];
    const filteredLinks = filterLinks(combinedData, textFilter);
    displayData(filteredLinks);
}

// Fetch data from Google Sheets API
async function fetchData(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return { values: [] }; // Return an empty array on error
    }
}

// Filter links based on the search text
function filterLinks(data, textFilter) {
    return data.filter(row => {
        if (row.length < 3) return false; // Skip incomplete rows
        const name = row[0].toLowerCase();
        const tags = row[2].split(',').map(tag => tag.trim().toLowerCase());
        return name.includes(textFilter) || tags.some(tag => tag.includes(textFilter));
    });
}

// Display the filtered or full data
function displayData(data) {
    const divLinks = document.querySelector('#links');
    divLinks.innerHTML = '';
    data.forEach(item => {
        if (HEADERS.includes(item[0])) return; // Skip header row
        const linkElement = createLinkElement(item);
        divLinks.appendChild(linkElement);
    });
}

// Create a link element for display
function createLinkElement(item) {
    const linkElement = document.createElement('div');
    linkElement.style.marginTop = '10px';
    linkElement.innerHTML = `
        <a href="${item[1]}" target="_blank" style="color:#ff3ac5; text-decoration: none;">${item[0]}</a>
        <span style="margin-left: 20px; color: #262429;">${item[2]}</span>
    `;
    return linkElement;
}
