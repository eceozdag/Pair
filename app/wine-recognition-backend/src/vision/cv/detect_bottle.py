import cv2
import numpy as np

class BottleDetector:
    def __init__(self, model_path):
        self.model = cv2.dnn.readNetFromONNX(model_path)

    def detect_bottle(self, image):
        blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
        self.model.setInput(blob)
        outputs = self.model.forward(self.model.getUnconnectedOutLayersNames())

        boxes, confidences, class_ids = self._process_outputs(outputs)
        return boxes, confidences, class_ids

    def _process_outputs(self, outputs):
        boxes = []
        confidences = []
        class_ids = []
        height, width = outputs[0].shape[2:4]

        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.5:  # Confidence threshold
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
        boxes = [boxes[i] for i in indices.flatten()]
        confidences = [confidences[i] for i in indices.flatten()]
        class_ids = [class_ids[i] for i in indices.flatten()]

        return boxes, confidences, class_ids

    def draw_boxes(self, image, boxes, confidences, class_ids):
        for i in range(len(boxes)):
            x, y, w, h = boxes[i]
            label = f"Bottle: {confidences[i]:.2f}"
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(image, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        return image