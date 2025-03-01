from django.urls import path
from .views import register_user, login_user, list_exams,create_exam, get_exam_details, submit_answers, list_users

urlpatterns = [
    path('register/', register_user, name='register'),
    path('token/', login_user, name='token_obtain_pair'),
    path('exams/', list_exams, name='list_exams'),
    path('exams/create/', create_exam, name='create_exam'),
    path('exam/', get_exam_details, name='get_exam_details'),
    path('exam/submit/', submit_answers, name='submit_answers'),
    path('users/',list_users, name='list_users'),
]

