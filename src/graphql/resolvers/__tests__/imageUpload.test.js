import 'dotenv/config';
import { imageUpload, getFile } from '../../../utils/image.utils';
import { file, failingFile } from '../__mocks__/contribution.mocks';


const regex = /^(image|application)\/((jpeg)|(png)|(jpg))$/gi;

describe('image', () => {
  it('should test image upload', async () => {
    await imageUpload(file, regex);
  });
  it('should throw an error when there is a fake createReadStream', async () => {
    try {
      await imageUpload(failingFile, regex);
    } catch (err) {
      expect(err.message).toEqual('File not supported!');
    }
  });

  it('should test getFile function', async () => {
    await getFile(file, regex);
  });
});
