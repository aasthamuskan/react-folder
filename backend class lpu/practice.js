const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// practice.js
// Create / update product.json by adding a new product.
// Usage:
//   node practice.js interactive
//   node practice.js '{"name":"Apple","price":9.99,"category":"fruit","description":"Fresh"}'


const filePath = path.join(__dirname, 'product.json');

async function loadProducts() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return []; // file doesn't exist yet
        throw err;
    }
}

function nextId(products) {
    const max = products.reduce((m, p) => Math.max(m, typeof p.id === 'number' ? p.id : 0), 0);
    return max + 1;
}

async function saveProducts(products) {
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
}

async function addProduct(product) {
    const products = await loadProducts();
    product.id = product.id ?? nextId(products);
    products.push(product);
    await saveProducts(products);
    console.log('Product added:', product);
}

async function interactiveAdd() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (q) => new Promise((res) => rl.question(q, res));

    try {
        const name = (await question('name: ')).trim();
        const priceRaw = (await question('price: ')).trim();
        const price = priceRaw === '' ? undefined : parseFloat(priceRaw);
        const category = (await question('category: ')).trim();
        const description = (await question('description: ')).trim();

        const product = { name };
        if (!Number.isNaN(price)) product.price = price;
        if (category) product.category = category;
        if (description) product.description = description;

        await addProduct(product);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        rl.close();
    }
}

(async function main() {
    const arg = process.argv[2];
    if (!arg) {
        console.log('Usage:');
        console.log("  node practice.js interactive");
        console.log("  node practice.js '{\"name\":\"Apple\",\"price\":9.99}'");
        return;
    }

    if (arg === 'interactive') {
        await interactiveAdd();
        return;
    }

    // treat arg as a JSON string for the product
    try {
        const product = JSON.parse(arg);
        await addProduct(product);
    } catch (err) {
        console.error('Invalid JSON argument. Example:');
        console.error("  node practice.js '{\"name\":\"Apple\",\"price\":9.99}'");
    }
})();