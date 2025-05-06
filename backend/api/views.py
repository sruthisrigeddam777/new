from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Exam, Question, StudentAnswer, StudentExamAttempt,ContactMessage, DisqualifiedAttempt
from .serializers import ExamSerializer, QuestionSerializer, ContactMessageSerializer
from django.http import JsonResponse
from django.db import models
import smtplib
import random
import time
#from pymongo import MongoClient
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.core.cache import cache
from django.conf import settings
from .utils import send_email_custom
import traceback
from difflib import SequenceMatcher
from ultralytics import YOLO
import cv2
import numpy as np
import base64

from django.views.decorators.csrf import csrf_exempt
import json
import io
from PIL import Image
from io import BytesIO
import os
from datetime import datetime

yolo_model = YOLO("yolov8n.pt")

def similarity_score(answer, correct_answer):
    return SequenceMatcher(None, answer.lower(), correct_answer.lower()).ratio()


def homepage(request):
    return JsonResponse({"message":"Welcome to the Online Exam System"})

User = get_user_model()

# Generate JWT Tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# User Registration API
@api_view(['POST'])
def register_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role', 'student')  # Default role is student

        if not username or not password or not email:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Ensure email is verified before registration
        if email not in verified_emails:
            return Response({"error": "Email not verified. Please complete OTP verification."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # # ✅ Use PyMongo to check if the username already exists
        # if users_collection.find_one({"username": username}):
        #     return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


        user = User.objects.create(username=username, password=make_password(password), email=email, role=role)
        # # ✅ Insert user into MongoDB
        # new_user = {
        #     "username": username,
        #     "email": email,
        #     "password": make_password(password),  # Hash password
        #     "role": role
        # }
        # users_collection.insert_one(new_user)
        verified_emails.remove(email)

        #del otp_storage[email]

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("🔥 Error in register_user:", str(e))  # ✅ Debugging
        traceback.print_exc()  # ✅ Print full error in terminal
        return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# User Login API
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#Create Exam
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_exam(request):
    if request.user.role not in ['teacher', 'admin']:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    exam_data = request.data
    exam = Exam.objects.create(title=exam_data["title"], description=exam_data["description"], created_by=request.user)
    for question in exam_data["questions"]:
        Question.objects.create(
            exam=exam,
            text=question["text"],
            question_type=question["question_type"],
            options=question.get("options", None),
            correct_answer=question.get("correct_answer", None)
        )
    serializer = ExamSerializer(exam)
    return Response({"message": "Exam and questions created successfully", "exam": serializer.data}, status=status.HTTP_201_CREATED)

# Fetch All Exams
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_exams(request):
    exams = Exam.objects.all()
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exam_details(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        questions = exam.questions.all()  # Use the correct related name

        exam_data = {
            "id": exam.id,
            "title": exam.title,
            "description": exam.description,
            "duration": exam.duration,
            "questions": [
                {
                    "id": q.id,
                    "text": q.text,
                    "question_type": q.question_type,
                    "options": [{"id": idx, "text": opt} for idx, opt in enumerate(q.options)] if q.options else [],
                    #"options": q.options if q.options else [],  # ✅ Fix: Directly return options list
                    #"options":[{"id":opt.id, "text": opt.text} for opt in q.options.all()],
                    "correct_answer": q.correct_answer if request.user.role == "teacher" else None
                }
                for q in questions
            ]
        }
        return Response(exam_data, status=status.HTTP_200_OK)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)


# Submit Exam Answers
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answers(request):
    answers_data = request.data.get("answers", [])

    if not answers_data:
        return Response({"error": "No answers provided"}, status=status.HTTP_400_BAD_REQUEST)


    # Mark the exam as attempted
    exam_id = answers_data[0]["exam_id"]

    #StudentExamAttempt.objects.update_or_create(student=request.user, exam_id=exam_id, defaults={"attempted": True})
    # ✅ Ensure the exam is marked as "Attempted"
    student_attempt, created = StudentExamAttempt.objects.get_or_create(
        student=request.user,
        exam_id=exam_id
    )
    student_attempt.attempted = True
    student_attempt.save()

    for answer in answers_data:
        question = Question.objects.get(id=answer["question_id"])
        # is_correct = (answer["answer"] == question.correct_answer) if question.question_type == "MCQ" else None
        # marks = 1 if is_correct else 0
        is_correct = None  # Subjective questions can't be auto-graded
        #marks = 1 if (question.question_type == "MCQ" and answer["answer"] == question.correct_answer) else None
        marks =0

        if question.question_type == "MCQ":
            is_correct = answer["answer"] == question.correct_answer
            marks = 1 if is_correct else 0
        elif question.question_type == "Subjective" and question.correct_answer:
            similarity = similarity_score(answer["answer"], question.correct_answer)
            marks = round(similarity, 2)  # Score between 0 to 1
            is_correct = marks >= 0.7  # Mark correct if similarity ≥ 70%


        StudentAnswer.objects.create(
            student=request.user,
            exam_id=exam_id,
            question_id=answer["question_id"],
            answer=answer["answer"],
            is_correct=is_correct,
            marks_obtained=marks
        )

    return Response({"message": "Exam submitted successfully"}, status=status.HTTP_201_CREATED)

# List Users (Only for Admins)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all().values("id", "username", "email", "role")
    return Response(list(users), status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exam_score(request, exam_id):
    try:
        print(f"🔍 Fetching score for exam_id: {exam_id}")
        # ✅ Fetch exam directly using MongoDB _id
        exam = Exam.objects.get(id=exam_id)

        if not exam:
            print(f"🚨 Exam with id {exam_id} not found in database")  # ✅ Debugging log
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

        print(f"✅ Exam found: {exam.title}")

        # Get total marks for this student and exam
        total_score = StudentAnswer.objects.filter(student=request.user, exam=exam).aggregate(
            total_marks=models.Sum('marks_obtained')
            )["total_marks"]

        print(f"📊 Total Score: {total_score}")

        if total_score is None:
            total_score = 0

        return Response({"total_marks": total_score}, status=status.HTTP_200_OK)

    except Exam.DoesNotExist:
        print(f"🚨 Exam ID {exam_id} does not exist!")
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        import traceback
        print("Error in get_exam_score:", traceback.format_exc())
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_exams(request):
    exams = Exam.objects.all()
    student_attempts = StudentExamAttempt.objects.filter(student=request.user)

    print("Student Attempts:", student_attempts)
    # Convert to a dictionary for quick lookup
    attempted_exam_ids = {attempt.exam.id for attempt in student_attempts}

    exam_data = []
    for exam in exams:
        exam_data.append({
            "id": exam.id,
            "title": exam.title,
            "description": exam.description,
            "attempted": exam.id in attempted_exam_ids
        })

    return Response(exam_data, status=status.HTTP_200_OK)

# Store OTPs temporarily
otp_storage = {}
verified_emails = set()

@api_view(['POST'])
def send_otp(request):
    email = request.data.get("email")

    # ✅ Check if email is already registered
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Generate a 6-digit OTP
    otp = random.randint(100000, 999999)
    otp_storage[email] = otp  # Store OTP in memory (Use DB in production)

    # ✅ Use custom function instead of Django's send_mail()
    subject = "Your OTP for Registration"
    message = f"Your OTP is: {otp}. Do not share it with anyone."
    success = send_email_custom(subject, message, email)

    if success:
        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp_entered = int(request.data.get("otp"))

    # ✅ Check if OTP is valid
    if email in otp_storage and otp_storage[email] == otp_entered:
        del otp_storage[email]  # Remove OTP after successful verification
        verified_emails.add(email)
        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def send_reset_otp(request):
    email = request.data.get("email")

    # ✅ Check if user exists
    if User.objects.filter(email=email).count() == 0:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Generate OTP
    otp = random.randint(100000, 999999)
    otp_storage[email] = otp

    # ✅ Use the same method as `send_otp`
    subject = "Password Reset OTP"
    message = f"Your OTP for password reset is: {otp}. Do not share it with anyone."
    success = send_email_custom(subject, message, email)

    if success:
        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def verify_reset_otp(request):
    email = request.data.get("email")
    otp_entered = int(request.data.get("otp"))

    if email in otp_storage and otp_storage[email] == otp_entered:
        del otp_storage[email]
        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    # ✅ Check if user exists
    try:
        user = User.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def submit_contact(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Message received successfully!"}, status=201)
    return Response(serializer.errors, status=400)

def decode_base64_image(image_data):
    try:
        if ',' in image_data:
            header, image_data = image_data.split(',')
            print("Image header:", header)
        img_bytes = base64.b64decode(image_data)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print("Error decoding image:", e)
        return None

def increment_violation(user, key):
    cache_key = f"violation:{user.id}:{key}"
    #cache_key = f"violation:{user.id}"
    count = cache.get(cache_key, 0) + 1
    cache.set(cache_key, count, timeout=60 * 60)  # keep for 1 hour
    return count

def log_violation(user, category, image_data=None):
    # Save the violation details to a folder (or database later)
    folder = "violation_logs"
    os.makedirs(folder, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    username = user.username
    filename = f"{folder}/{username}_{category}_{timestamp}.jpg"

    if image_data:
        try:
            with open(filename, "wb") as f:
                f.write(base64.b64decode(image_data))
            print(f"[LOGGED] Violation saved: {filename}")
        except Exception as e:
            print("Failed to save image log:", e)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_face(request):
    try:
        image_data = request.data.get("image")
        exam_id = request.data.get("exam_id")

        if not image_data or not exam_id:
            return Response({"error": "Missing image or exam_id."}, status=400)

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=404)

        if ',' in image_data:
            _, image_data = image_data.split(',')

        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return Response({"error": "Failed to decode image"}, status=400)

        # Run YOLOv8 inference
        results = yolo_model(frame)[0]
        names = yolo_model.names

        person_count = 0
        unauthorized_items = []

        for r in results.boxes.data.tolist():
            _, _, _, _, _, class_id = r
            label = names[int(class_id)]

            if label == "person":
                person_count += 1
            if label in ["cell phone", "book", "laptop"]:
                unauthorized_items.append(label)

        # Evaluate detection results
        if person_count == 0:
            strikes = increment_violation(request.user, "no_person")
            log_violation(request.user, "no_person", image_data=image_data)

            if strikes >= 3:
                DisqualifiedAttempt.objects.get_or_create(user=request.user, exam=exam, defaults={
                    "reason": "no_person"
                })
                return Response({"status": "disqualified", "reason": "No person detected multiple times."})
            return Response({"status": "no_person", "strikes": strikes})

        elif person_count > 1:
            strikes = increment_violation(request.user, "multiple_faces")
            log_violation(request.user, "multiple_faces", image_data=image_data)

            if strikes >= 3:
                DisqualifiedAttempt.objects.get_or_create(user=request.user, exam=exam, defaults={
                    "reason": "multiple_faces"
                })
                return Response({"status": "disqualified", "reason": "Multiple persons are detected multiple times."})
            return Response({"status": "multiple_faces", "strikes": strikes})

        elif unauthorized_items:
            strikes = increment_violation(request.user, "unauthorized_object")
            log_violation(request.user, "unauthorized_object", image_data=image_data)

            if strikes >= 3:
                DisqualifiedAttempt.objects.get_or_create(user=request.user, exam=exam, defaults={
                    "reason": "unauthorized_object"
                })
                return Response({"status": "disqualified", "reason": "Unauthorized objects are detected multiple times."})
            return Response({"status": "unauthorized_object", "items": unauthorized_items, "strikes": strikes})
        else:
            return Response({"status": "ok"})

    except Exception as e:
        import traceback
        print("Error in verify_face:", traceback.format_exc())
        return Response({"error": "Internal error during detection"}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_available_exams(request):
    disqualified_ids = DisqualifiedAttempt.objects.filter(user=request.user).values_list("exam_id", flat=True)
    available_exams = Exam.objects.exclude(id__in=disqualified_ids)
    data = [{"id": exam.id, "title": exam.title, "description": exam.description} for exam in available_exams]
    return Response(data)