/* eslint-disable @typescript-eslint/no-unsafe-return */
import sharp from 'sharp';
import admin from 'firebase-admin';
import axios from 'axios';

export const optimizeImg = async (url: string) => {
  try {
    const { data }: { data: Buffer } = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const imageBucket = admin.storage().bucket();
    const i = url.indexOf('recipeImages/');
    const fileName = url.slice(i + 13, i + 19);
    const file = imageBucket.file(fileName);

    const [fileExists] = await file.exists();
    if (fileExists) {
      return file.publicUrl();
    }

    const buffer = await sharp(data)
      .webp({ quality: 75 })
      .toBuffer({ resolveWithObject: true });

    console.log('file prepared to be saved');
    await file.save(buffer.data, {
      metadata: {
        contentType: 'image/webp',
      },
    });

    console.log('File saved to storage', buffer.data);

    await file.makePublic();
    console.log('file made public');

    const resultUrl = file.publicUrl();

    return resultUrl;
  } catch (error) {
    let errorMessage = 'Error processing or uploading the image: ';
    if (error instanceof Error) {
      errorMessage += error;
    }
    console.log(errorMessage);
  }
};
