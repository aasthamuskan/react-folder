const fs = require('fs');

// class03.js
// Usage: node class03.js [pathToFile] [--readable]
// Demonstrates creating a read stream and listening for common events.

const path = process.argv[2] || 'sample.txt';
const useReadable = process.argv.includes('--readable');

const rs = fs.createReadStream(path, {
    encoding: 'utf8',
    highWaterMark: 16 * 1024, // 16KB chunks
});

rs.on('open', fd => console.log(`open -> fd=${fd} (${path})`));
rs.on('close', () => console.log('close'));
rs.on('error', err => console.error('error ->', err.message));
rs.on('end', () => console.log('\nend'));

let chunkCount = 0;

if (useReadable) {
    // Pull mode using 'readable'
    rs.on('readable', () => {
        let chunk;
        while (null !== (chunk = rs.read(64))) { // read 64 bytes at a time
            chunkCount++;
            console.log(`readable chunk #${chunkCount} (${chunk.length} bytes):`);
            process.stdout.write(chunk);
        }
    });
} else {
    // Flowing mode using 'data'
    rs.on('data', chunk => {
        chunkCount++;
        console.log(`data chunk #${chunkCount} (${chunk.length} bytes):`);
        process.stdout.write(chunk);

        // Example: pause/resume after 3 chunks
        if (chunkCount === 3) {
            console.log('\n-- pausing stream for 1s --');
            rs.pause();
            setTimeout(() => {
                console.log('-- resuming stream --');
                rs.resume();
            }, 1000);
        }
    });
}

const outPath = `${path}.copy`;
const ws = fs.createWriteStream(outPath, { encoding: 'utf8', highWaterMark: 16 * 1024 });

ws.on('open', fd => console.log(`write open -> fd=${fd} (${outPath})`));
ws.on('close', () => console.log('write close'));
ws.on('error', err => console.error('write error ->', err.message));
ws.on('finish', () => console.log('write finished (flushed)'));

if (useReadable) {
    // Manual pull-mode write with backpressure handling
    rs.on('readable', () => {
        let chunk;
        while (null !== (chunk = rs.read(64))) {
            const ok = ws.write(chunk);
            console.log(`wrote chunk (${chunk.length} bytes), ok=${ok}`);
            if (!ok) {
                console.log('backpressure: pausing readable until drain');
                rs.pause();
                ws.once('drain', () => {
                    console.log('drain -> resuming readable');
                    rs.resume();
                });
                break;
            }
        }
    });

    rs.on('end', () => {
        ws.end(); // close writer when reader ends
    });
} else {
    // Simple piping (flowing mode)
    rs.pipe(ws);
    rs.on('pipe', () => console.log(`piping ${path} -> ${outPath}`));
}

writeStream.end();

const fs = 56 ;