import fs from 'fs';

export default class FileUtils {
    static async exists(path) {
        return new Promise(resolve => {
            fs.exists(path, exists => resolve(exists));
        });
    }

    static async renameFolder(path1, path2) {
        return new Promise((resolve, reject) => {
            fs.rename(path1, path2, error => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }

    static async remove(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, error => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }
}
