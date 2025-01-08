import fs from 'fs';
import path from 'path';

/** 
 * Create a new file with specified content.
 * @param {string} filePath - The file path where the file should be created.
 * @param {string} content - The content to write into the file.
 * @returns {Promise} - Resolves when the file is written successfully.
 */
export const createFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        reject(`Error writing file: ${err}`);
      } else {
        resolve('File created successfully');
      }
    });
  });
};

/**
 * Read the contents of a file.
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise} - Resolves with the file content.
 */
export const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Append content to an existing file.
 * @param {string} filePath - The file path to append content to.
 * @param {string} content - The content to append to the file.
 * @returns {Promise} - Resolves when the content is appended successfully.
 */
export const appendToFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, content, 'utf8', (err) => {
      if (err) {
        reject(`Error appending to file: ${err}`);
      } else {
        resolve('Content appended successfully');
      }
    });
  });
};

/**
 * Delete a file.
 * @param {string} filePath - The file path to delete.
 * @returns {Promise} - Resolves when the file is deleted.
 */
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(`Error deleting file: ${err}`);
      } else {
        resolve('File deleted successfully');
      }
    });
  });
};

/**
 * Rename a file.
 * @param {string} oldPath - The current file path.
 * @param {string} newPath - The new file path.
 * @returns {Promise} - Resolves when the file is renamed.
 */
export const renameFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(`Error renaming file: ${err}`);
      } else {
        resolve('File renamed successfully');
      }
    });
  });
};

/**
 * Create a directory.
 * @param {string} dirPath - The directory path to create.
 * @returns {Promise} - Resolves when the directory is created.
 */
export const createDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(`Error creating directory: ${err}`);
      } else {
        resolve('Directory created successfully');
      }
    });
  });
};

/**
 * Remove a directory.
 * @param {string} dirPath - The directory path to remove.
 * @returns {Promise} - Resolves when the directory is removed.
 */
export const removeDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.rmdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(`Error removing directory: ${err}`);
      } else {
        resolve('Directory removed successfully');
      }
    });
  });
};

/**
 * Check if a file or directory exists.
 * @param {string} path - The path to check.
 * @returns {Promise} - Resolves with true if exists, false if not.
 */
export const pathExists = (path) => {
  return new Promise((resolve) => {
    fs.exists(path, (exists) => {
      resolve(exists);
    });
  });
};

/**
 * Get the file stats (like size, created date, etc.).
 * @param {string} filePath - The path to the file.
 * @returns {Promise} - Resolves with file stats.
 */
export const getFileStats = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(`Error getting file stats: ${err}`);
      } else {
        resolve(stats);
      }
    });
  });
};

/**
 * Read the contents of a directory.
 * @param {string} dirPath - The path to the directory.
 * @returns {Promise} - Resolves with an array of filenames.
 */
export const readDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(`Error reading directory: ${err}`);
      } else {
        resolve(files);
      }
    });
  });
};
