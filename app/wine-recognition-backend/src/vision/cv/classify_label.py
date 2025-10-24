from typing import List
import cv2
import numpy as np

class LabelClassifier:
    def __init__(self, model_path: str):
        self.model = self.load_model(model_path)

    def load_model(self, model_path: str):
        # Load the pre-trained model for label classification
        model = cv2.dnn.readNetFromONNX(model_path)
        return model

    def classify(self, image: np.ndarray) -> str:
        # Preprocess the image for classification
        blob = cv2.dnn.blobFromImage(image, 1/255.0, (224, 224), (0, 0, 0), swapRB=True, crop=False)
        self.model.setInput(blob)
        output = self.model.forward()
        label = self.get_label_from_output(output)
        return label

    def get_label_from_output(self, output: np.ndarray) -> str:
        # Convert model output to a human-readable label
        class_id = np.argmax(output)
        labels = self.load_labels()
        return labels[class_id]

    def load_labels(self) -> List[str]:
        # Load the labels from a file or define them directly
        return ["Red Wine", "White Wine", "Rose Wine", "Sparkling Wine", "Dessert Wine"]

# Example usage:
# classifier = LabelClassifier('path/to/model.onnx')
# label = classifier.classify(cv2.imread('path/to/wine_label_image.jpg'))
# print(label)