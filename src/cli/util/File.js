import fs from 'fs';

export default class FileUtils {
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
}
