const fs = require('fs').promises;
const path = require('path');

// merge-json.js
// Usage:
//   node merge-json.js out.json file1.json file2.json ...
//   node merge-json.js out.json --dir path/to/jsons
// If out.json is "-" the merged JSON is printed to stdout.


function isObject(val) {
    return val && typeof val === 'object' && !Array.isArray(val);
}

function deepMerge(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    }
    if (isObject(a) && isObject(b)) {
        const res = { ...a };
        for (const key of Object.keys(b)) {
            if (key in a) res[key] = deepMerge(a[key], b[key]);
            else res[key] = b[key];
        }
        return res;
    }
    // fallback: override with b
    return b;
}

async function readJson(file) {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt);
}

async function gatherFilesFromDir(dir) {
    const names = await fs.readdir(dir);
    return names
        .filter(n => n.toLowerCase().endsWith('.json'))
        .map(n => path.join(dir, n))
        .sort();
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node merge-json.js out.json file1.json file2.json ...');
        console.error('   or: node merge-json.js out.json --dir path/to/jsons');
        process.exit(2);
    }

    const outFile = args[0];
    let inputFiles = [];

    if (args[1] === '--dir') {
        if (!args[2]) {
            console.error('Missing directory after --dir');
            process.exit(2);
        }
        inputFiles = await gatherFilesFromDir(args[2]);
        if (inputFiles.length === 0) {
            console.error('No .json files found in', args[2]);
            process.exit(1);
        }
    } else {
        inputFiles = args.slice(1);
    }

    let merged = {};
    for (const f of inputFiles) {
        try {
            const obj = await readJson(f);
            merged = deepMerge(merged, obj);
        } catch (err) {
            console.error('Failed to read/parse', f, ':', err.message);
            process.exit(1);
        }
    }

    const outText = JSON.stringify(merged, null, 2);
    if (outFile === '-') {
        console.log(outText);
    } else {
        try {
            await fs.writeFile(outFile, outText, 'utf8');
            console.log('Merged', inputFiles.length, 'files ->', outFile);
        } catch (err) {
            console.error('Failed to write', outFile, ':', err.message);
            process.exit(1);
        }
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
