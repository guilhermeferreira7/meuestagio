import { Injectable } from '@nestjs/common';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase-config';

@Injectable()
export class ImagesService {
  async uploadImage(
    image: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const imageRef = ref(storage, folder);
    const imageUpload = await uploadBytes(imageRef, image.buffer);
    const imageUrl = await getDownloadURL(imageUpload.ref);

    return imageUrl;
  }
}
