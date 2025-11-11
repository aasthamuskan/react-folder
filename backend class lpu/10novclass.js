const fs = require('fs').promises;
const path = require('path');
const fsSync = require('fs');

// 10novclass.js

/**
 * Read and parse a JSON file (async).
 * @param {string} fileName - file name or relative path (default: 'data.json')
 * @returns {Promise<any>} parsed JSON object
 */
async function readJson(fileName = 'data.json') {
    const filePath = path.resolve(__dirname, fileName);
    try {
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') throw new Error(`File not found: ${filePath}`);
        if (err.name === 'SyntaxError') throw new Error(`Invalid JSON in file: ${filePath}\n${err.message}`);
        throw err;
    }
}

// Example usage
(async () => {
    try {
        const data = await readJson('data.json'); // place data.json next to this file
        console.log('JSON content:', data);
    } catch (err) {
        console.error('Error reading JSON:', err.message);
    }
})();

/* Synchronous alternative:
const raw = fsSync.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8');
const data = JSON.parse(raw);
console.log(data);
*/




