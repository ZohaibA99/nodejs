// Importing the 'fs' module with promises
const fs = require('fs').promises;

// Reading the current directory
fs.readdir(__dirname)
  .then(files => {
    // Mapping each filename to a promise that resolves to an object with file information
    return Promise.all(
      files.map(async filename => {
        const stats = await fs.stat(filename);
        return {
          Name: filename,
          Size: stats.size,
          Date: stats.mtime,
        };
      }),
    );
  })
  .then(result => console.table(result));