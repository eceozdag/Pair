from typing import List, Dict
import joblib
import numpy as np

class WineInferencer:
    def __init__(self, model_path: str):
        self.model = joblib.load(model_path)

    def infer(self, features: List[float]) -> Dict[str, str]:
        features_array = np.array(features).reshape(1, -1)
        prediction = self.model.predict(features_array)
        return self._format_prediction(prediction)

    def _format_prediction(self, prediction) -> Dict[str, str]:
        # Assuming the model predicts wine type and pairing suggestions
        wine_type = prediction[0]
        pairing_suggestions = self.get_pairing_suggestions(wine_type)
        return {
            "wine_type": wine_type,
            "pairing_suggestions": pairing_suggestions
        }

    def get_pairing_suggestions(self, wine_type: str) -> List[str]:
        # Placeholder for actual pairing logic
        # This should connect to a database or a service to get real suggestions
        suggestions = {
            "red": ["steak", "pasta", "cheese"],
            "white": ["fish", "chicken", "salad"],
            "rose": ["light salads", "seafood"],
            "sparkling": ["desserts", "appetizers"]
        }
        return suggestions.get(wine_type, [])