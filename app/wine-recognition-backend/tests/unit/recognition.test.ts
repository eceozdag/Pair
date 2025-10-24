import { RecognitionService } from '../../src/services/recognitionService';

describe('RecognitionService', () => {
    let recognitionService: RecognitionService;

    beforeEach(() => {
        recognitionService = new RecognitionService();
    });

    it('should recognize a wine bottle correctly', async () => {
        const imagePath = 'path/to/test/image.jpg';
        const result = await recognitionService.recognizeWine(imagePath);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('vintage');
        expect(result).toHaveProperty('region');
    });

    it('should return an error for an invalid image', async () => {
        const invalidImagePath = 'path/to/invalid/image.jpg';
        await expect(recognitionService.recognizeWine(invalidImagePath)).rejects.toThrow('Invalid image');
    });

    it('should provide pairing suggestions based on recognized wine', async () => {
        const recognizedWine = { name: 'Chardonnay', vintage: 2020, region: 'California' };
        const pairings = await recognitionService.getPairings(recognizedWine);
        expect(pairings).toBeInstanceOf(Array);
        expect(pairings.length).toBeGreaterThan(0);
    });
});