const alert = require('cli-alerts');    //For Alerts.
const fs = require('fs');               //File processing.
const jimp = require('jimp');           //Image processing.
const path = require('path');           //Path management.

const decrypt = async (flags) => {
    //Checks if path is valid.
    const filePath = flags.d;
    const keyPath = flags.k;
    if (!filePath || !keyPath) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path and key file path'
        });
        throw new Error('Invalid file path or key file path');
    }

    //Checks if the file exists and resolves paths (resolves meaning relative to an absolute path).
    const fullPath = path.resolve(filePath);
    const fullKeyPath = path.resolve(keyPath);

    if (!fs.existsSync(fullPath) || !fs.existsSync(fullKeyPath)) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path and key file path'
        });
        throw new Error('Invalid file path or key file path');
    }

    //Reads Image and keys.
    try {
        const image = await jimp.read(fullPath);
        const keyBase64 = fs.readFileSync(fullKeyPath, 'utf8');
        const key = Buffer.from(keyBase64, 'base64');

        //Checks if the key matches with the length
        if (key.length !== image.bitmap.data.length) {
            alert({
                type: 'error',
                name: 'Invalid key',
                msg: 'The key length does not match the image data length'
            });
            throw new Error('Invalid key length');
        }

        //Reads Image data.
        const rgba = image.bitmap.data;
        //Gets Length
        const length = rgba.length;
        
        //Decryption with the key. 
        for (let i = 0; i < length; i++) {
            const k = key[i];
            rgba[i] = rgba[i] ^ k;
        }

        //Replaces Image encrypted image with new data.
        image.bitmap.data = rgba;

        //Generates formatted file name.
        let outputImageFile = path.resolve(filePath).replace('_encrypted', '_decrypted');
        if (flags.o) {
            outputImageFile = path.resolve(flags.o);
        }

        //Checks if name already exists.
        if (fs.existsSync(outputImageFile)) {
            alert({
                type: 'error',
                name: 'Invalid output image file name',
                msg: `The output image file name already exists: ${outputImageFile}`
            });
            throw new Error('Invalid output image file name');
        }

        // If not, then saves it.
        image.write(outputImageFile);

        //Success or error promts.
        alert({
            type: 'success',
            name: 'Image decrypted successfully',
            msg: `Image decrypted successfully:\nDecrypted Image: ${outputImageFile}`
        });
    } catch (error) {
        alert({
            type: 'error',
            name: 'Error',
            msg: error.message || 'Unknown error'
        });
        throw error;
    }
};

//Exports it for use on other files.
module.exports = decrypt;