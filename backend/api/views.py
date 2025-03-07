from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
#from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Exam, Question, StudentAnswer
from .serializers import ExamSerializer, QuestionSerializer
from django.http import JsonResponse
import traceback

def homepage(request):
    return JsonResponse({"message":"Welcome to the Online Exam System API"})

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

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


        user = User.objects.create(username=username, password=make_password(password), email=email, role=role)

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_exam(request):
    if request.user.role not in ['teacher', 'admin']:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # Ensure created_by is set to the authenticated user's ID
    #exam_data = request.data.copy()
    #exam_data["created_by"] = request.user.id

    exam_data = request.data
    exam = Exam.objects.create(title=exam_data["title"],description=exam_data["description"],created_by=request.user)

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



    print("Errors:", serializer.errors)  # Debugging
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Fetch All Exams
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_exams(request):
    exams = Exam.objects.all()
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get Exam Details with Questions
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exam_details(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        serializer = ExamSerializer(exam)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# Submit Exam Answers
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    users = User.objects.all().values("id", "username", "email", "role")
    return Response(list(users), status=200)