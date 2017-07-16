import progress from 'progress-stream';
import fetch from 'isomorphic-fetch';
import unzip from 'unzip';
import fs from 'fs';

export default class ZipUtils {
    static async download(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'application/zip'
            }
        });

        return response.body;
    }

    static async writeStream(stream, value, onProgress) {
        const progressTracker = progress({ time: 100 }, onProgress);

        return new Promise((resolve, reject) => {
            stream
                .pipe(progressTracker)
                .pipe(fs.createWriteStream(`${value}.zip`))
                .on('error', error => reject(error))
                .on('close', () => resolve('file written'));
        });
    }

    static async extract(path) {
        return new Promise((resolve, reject) => {
            fs
                .createReadStream(`${path}.zip`)
                .pipe(unzip.Extract({ path: '.' }))
                .on('error', error => reject(error))
                .on('close', _ => resolve('file written'));
        });
    }
}
