from ultralytics import YOLO
import cv2

# Load a pre-trained YOLOv8 model
model = YOLO("yolov8n.pt")  # use 'yolov8s.pt' or 'yolov8m.pt' for better accuracy

# Start webcam
cap = cv2.VideoCapture(0)  # Use 0 for default camera

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run YOLO inference
    # results = model(frame, verbose=False)

    # Detect objects
    results = model(frame)[0]
    names = model.names

    # Initialize counters
    person_count = 0
    unauthorized_items = []

    for r in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = r
        label = names[int(class_id)]

        # Count persons
        if label == "person":
            person_count += 1

        # Flag unauthorized items
        if label in ["cell phone", "book", "laptop"]:
            unauthorized_items.append(label)

        # Draw box
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(frame, label, (int(x1), int(y1) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

    # Show alerts
    status_text = ""
    if person_count == 0:
        status_text = "⚠️ No person detected"
    elif person_count > 1:
        status_text = f"⚠️ Multiple persons detected: {person_count}"
    elif unauthorized_items:
        status_text = f"⚠️ Unauthorized: {', '.join(unauthorized_items)}"
    else:
        status_text = "✅ Monitoring: All clear"

    print(status_text)

    # Display result
    cv2.putText(frame, status_text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    cv2.imshow("YOLOv8 Proctoring", frame)
    # Draw results on frame
    #annotated_frame = results[0].plot()

    # Display
    #cv2.imshow("YOLOv8 Detection", annotated_frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()