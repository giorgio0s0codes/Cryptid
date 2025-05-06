const alert = require('cli-alerts');    //For Alerts.
const fs = require('fs');               //File processing.
const jimp = require('jimp');           //Image processing.
const path = require('path');           //Path management.

const encrypt = async (flags) => {

    //Checks if path is valid.
    const filePath = flags.e;
    if (!filePath) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path'
        });
        throw new Error('Invalid file path');
    }

    //Checks if the file exists.
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path'
        });
        throw new Error('Invalid file path');
    }

    try {

        //Reads File using Jimp.
        const image = await jimp.read(fullPath);
        const extension = image.getExtension();
        const fileNameWithoutExtension = path.basename(fullPath, path.extname(fullPath));
        
        let outputImageFile = `${fileNameWithoutExtension}_encrypted.${extension}`;
        if (flags.o) {
            outputImageFile = path.resolve(flags.o);
        }
        

        //Creates output file.
        if (fs.existsSync(outputImageFile)) {
            alert({
                type: 'error',
                name: 'Invalid output image file name',
                msg: `The output image file name already exists: ${outputImageFile}`
            });
            throw new Error('Invalid output image file name');
        }
        
        //Manages errors and gives an output message.
        let outputKeyFile = `${fileNameWithoutExtension}_key.txt`;
        if (flags.p) {
            outputKeyFile = path.resolve(flags.p);
        }
        
        if (fs.existsSync(outputKeyFile)) {
            alert({
                type: 'error',
                name: 'Invalid output key file name',
                msg: `The output key file name already exists: ${outputKeyFile}`
            });
            throw new Error('Invalid output key file name');
        }
        


        //Extracts RGB data from image.
        const rgba = image.bitmap.data;
        //Gets image lenght using rgb.
        const length = rgba.length;

        //Generates random key of same lenght.
        const key = [];
        for (let i = 0; i < length; i++) {
            //Math random is a js function to generate the random numbers.
            key.push(Math.floor(Math.random() * 256));
        }
        
        //Stores each image byte with corresponding byte from key.
        for (let i = 0; i < length; i++) {
            const k = key[i];
            rgba[i] = rgba[i] ^ k;
        }
        
        //Writes the encrypted image.
        image.bitmap.data = rgba;
        image.write(outputImageFile);
        
        //Writes encryption key.
        fs.writeFileSync(outputKeyFile, Buffer.from(key).toString('base64'));
        
        //Alerts of success or error.
        alert({
            type: 'success',
            name: 'Image encrypted successfully',
            msg: `Image encrypted successfully:\nEncrypted Image: ${outputImageFile}\nKey: ${outputKeyFile}`
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

//Exports function so that it can be used by other files.
module.exports = encrypt;