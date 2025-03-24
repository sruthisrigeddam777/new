from django.urls import path
from .views import register_user, login_user, list_exams,create_exam, get_exam_details, submit_answers, list_users,get_student_exams,get_exam_score, send_otp,verify_otp,send_reset_otp, verify_reset_otp, reset_password

urlpatterns = [
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('register/', register_user, name='register'),
    path('token/', login_user, name='token_obtain_pair'),
    path('exams/', list_exams, name='list_exams'),
    path('exams/create/', create_exam, name='create_exam'),
    path('exam/<int:exam_id>/', get_exam_details, name='get_exam_details'),
    path('exam/submit/', submit_answers, name='submit_answers'),
    path('users/',list_users, name='list_users'),
    path('student/exams/', get_student_exams, name='get_student_exams'),
    path('exam/<int:exam_id>/score/', get_exam_score, name='get_exam_score'),
    path('send-reset-otp/', send_reset_otp, name='send_reset_otp'),
    path('verify-reset-otp/', verify_reset_otp, name='verify_reset_otp'),
    path('reset-password/', reset_password, name='reset_password'),
]