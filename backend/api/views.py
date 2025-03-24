# from django.contrib.auth import get_user_model
# from django.contrib.auth.hashers import make_password
# #from rest_framework.decorators import api_view
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken
# from .models import Exam, Question, StudentAnswer
# from .serializers import ExamSerializer, QuestionSerializer
# from django.http import JsonResponse
# import traceback
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# #from PIL import Image
# import json
# from io import BytesIO
# from .models import ProctoringLog
# import base64
# from django.core.files.base import ContentFile

# def homepage(request):
#     return JsonResponse({"message":"Welcome to the Online Exam System API"})

# User = get_user_model()

# # Generate JWT Tokens
# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)
#     refresh["role"] = user.role
#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     }

# # User Registration API
# @api_view(['POST'])
# def register_user(request):
#     try:
#         username = request.data.get('username')
#         password = request.data.get('password')
#         email = request.data.get('email')
#         role = request.data.get('role', 'student')  # Default role is student

#         if not username or not password or not email:
#             return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

#         if User.objects.filter(username=username).exists():
#             return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


#         user = User.objects.create(username=username, password=make_password(password), email=email, role=role)

#         return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         print("🔥 Error in register_user:", str(e))  # ✅ Debugging
#         traceback.print_exc()  # ✅ Print full error in terminal
#         return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # User Login API
# @api_view(['POST'])
# def login_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     try:
#         user = User.objects.get(username=username)
#         if not user.check_password(password):
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#         tokens = get_tokens_for_user(user)
#         return Response(tokens, status=status.HTTP_200_OK)

#     except User.DoesNotExist:
#         return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_exam(request):
#     if request.user.role not in ['teacher', 'admin']:
#         return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

#     # Ensure created_by is set to the authenticated user's ID
#     #exam_data = request.data.copy()
#     #exam_data["created_by"] = request.user.id

#     exam_data = request.data
#     exam = Exam.objects.create(title=exam_data["title"],description=exam_data["description"],created_by=request.user)

#     for question in exam_data["questions"]:
#         Question.objects.create(
#             exam=exam,
#             text=question["text"],
#             question_type=question["question_type"],
#             options=question.get("options", None),
#             correct_answer=question.get("correct_answer", None)
#         )

#     serializer = ExamSerializer(data=exam_data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Exam and questions created successfully"}, status=status.HTTP_201_CREATED)



#     print("Errors:", serializer.errors)  # Debugging
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# # Fetch All Exams
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def list_exams(request):
#     exams = Exam.objects.all()
#     serializer = ExamSerializer(exams, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# # Get Exam Details with Questions
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_exam_details(request, exam_id):
#     try:
#         exam = Exam.objects.get(id=exam_id)
#         serializer = ExamSerializer(exam)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exam.DoesNotExist:
#         return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# # Submit Exam Answers
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def submit_answers(request):
#     answers_data = request.data.get("answers", [])

#     for answer in answers_data:
#         student_answer = StudentAnswer(
#             student=request.user,
#             exam_id=answer["exam_id"],
#             question_id=answer["question_id"],
#             answer=answer["answer"],
#             is_correct=(answer["answer"] == Question.objects.get(id=answer["question_id"]).correct_answer)
#         )
#         student_answer.save()

#     return Response({"message": "Exam submitted successfully"}, status=status.HTTP_201_CREATED)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def list_users(request):
#     if request.user.role != "admin":
#         return Response({"error": "Unauthorized"}, status=403)

#     users = User.objects.all().values("id", "username", "email", "role")
#     return Response(list(users), status=200)


# # @csrf_exempt
# # def upload_proctoring_image(request):
# #     if request.method == "POST":
# #         data = request.POST.get("image")
# #         image_data = base64.b64decode(data.split(",")[1])
# #         image = Image.open(BytesIO(image_data))
# #         image.save("proctoring_images/student_capture.png")

# #         return JsonResponse({"status": "Image Received"})
    
# @csrf_exempt
# def upload_proctoring_image(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         student = data.get("student")
#         image_data = data.get("image")

#         # Decode and save the image
#         with open(f"proctoring_images/student_{student}.png", "wb") as f:
#             f.write(base64.b64decode(image_data.split(",")[1]))

#         ProctoringLog.objects.create(student=student, violation_type="Image Captured")
#         return JsonResponse({"status": "Image saved"})

# @csrf_exempt
# def log_violation(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         student = data.get("student")
#         action = data.get("action")

#         ProctoringLog.objects.create(student=student, violation_type=action)
#         return JsonResponse({"status": "Logged"})

# @csrf_exempt  # Disable CSRF for testing (remove in production)
# def upload_frame(request):
#     if request.method == "POST":
#         try:
#             data = request.POST.get("image")  # Get base64 image data
#             if not data:
#                 return JsonResponse({"error": "No image data provided"}, status=400)

#             # Convert base64 image to a file
#             format, imgstr = data.split(";base64,")
#             ext = format.split("/")[-1]  
#             image_data = ContentFile(base64.b64decode(imgstr), name=f"frame.{ext}")

#             # ✅ Save the image to a folder (optional)
#             with open(f"media/proctoring/frame.{ext}", "wb") as f:
#                 f.write(image_data.read())

#             print("✅ Image received and saved!")  # Debugging log

#             return JsonResponse({"message": "Frame received successfully"}, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request"}, status=400)








#this is new 
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import traceback
import base64
from django.core.files.base import ContentFile
from .models import Exam, Question, StudentAnswer, ProctoringLog
from .serializers import ExamSerializer, QuestionSerializer

# Homepage API
def homepage(request):
    return JsonResponse({"message": "Welcome to the Online Exam System API"})

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
        role = request.data.get('role', 'student')

        if not username or not password or not email:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create(username=username, password=make_password(password), email=email, role=role)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        traceback.print_exc()
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

# Create Exam API
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
    serializer = ExamSerializer(data=exam_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Exam and questions created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Fetch All Exams API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_exams(request):
    exams = Exam.objects.all()
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get Exam Details API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exam_details(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        serializer = ExamSerializer(exam)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# Submit Exam Answers API
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answers(request):
    answers_data = request.data.get("answers", [])
    for answer in answers_data:
        student_answer = StudentAnswer(
            student=request.user,
            exam_id=answer["exam_id"],
            question_id=answer["question_id"],
            answer=answer["answer"],
            is_correct=(answer["answer"] == Question.objects.get(id=answer["question_id"]).correct_answer)
        )
        student_answer.save()
    return Response({"message": "Exam submitted successfully"}, status=status.HTTP_201_CREATED)

# List Users API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)
    users = User.objects.all().values("id", "username", "email", "role")
    return Response(list(users), status=200)

# Upload Proctoring Image API
@csrf_exempt
def upload_proctoring_image(request):
    if request.method == "POST":
        data = json.loads(request.body)
        student = data.get("student")
        image_data = data.get("image")
        with open(f"proctoring_images/student_{student}.png", "wb") as f:
            f.write(base64.b64decode(image_data.split(",")[1]))
        ProctoringLog.objects.create(student=student, violation_type="Image Captured")
        return JsonResponse({"status": "Image saved"})

# Log Violation API
@csrf_exempt
def log_violation(request):
    if request.method == "POST":
        data = json.loads(request.body)
        student = data.get("student")
        action = data.get("action")
        ProctoringLog.objects.create(student=student, violation_type=action)
        return JsonResponse({"status": "Logged"})

# Upload Frame API
@csrf_exempt
def upload_frame(request):
    if request.method == "POST":
        try:
            data = request.POST.get("image")
            format, imgstr = data.split(";base64,")
            ext = format.split("/")[-1]  
            image_data = ContentFile(base64.b64decode(imgstr), name=f"frame.{ext}")
            with open(f"media/proctoring/frame.{ext}", "wb") as f:
                f.write(image_data.read())
            return JsonResponse({"message": "Frame received successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

# Log Cheating API
@csrf_exempt
def log_cheating(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        exam_id = data.get("exam_id")
        reason = data.get("reason")
        print(f"Cheating Attempt: User {user_id} in Exam {exam_id} - {reason}")
        return JsonResponse({"message": "Cheating logged successfully"})
    return JsonResponse({"error": "Invalid request"}, status=400)
