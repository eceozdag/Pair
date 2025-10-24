import { RecognitionService } from '../services/recognitionService';
import { PairingService } from '../services/pairingService';
import { FeedbackService } from '../services/feedbackService';

class ML_Pipeline {
    private recognitionService: RecognitionService;
    private pairingService: PairingService;
    private feedbackService: FeedbackService;

    constructor() {
        this.recognitionService = new RecognitionService();
        this.pairingService = new PairingService();
        this.feedbackService = new FeedbackService();
    }

    async processWineImage(image: Buffer): Promise<any> {
        const wineData = await this.recognitionService.recognizeWine(image);
        const pairings = await this.pairingService.getPairings(wineData);
        return { wineData, pairings };
    }

    async submitFeedback(wineId: string, feedback: any): Promise<void> {
        await this.feedbackService.processFeedback(wineId, feedback);
    }

    async getExpertPairings(wineId: string): Promise<any> {
        return await this.pairingService.getExpertPairings(wineId);
    }
}

export default new ML_Pipeline();