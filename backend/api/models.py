# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class CustomUser(AbstractUser):
#     ROLE_CHOICES = [('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')]
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

#     groups = models.ManyToManyField(
#         "auth.Group",
#         related_name="customuser_set",  # Fix the clash here
#         blank=True
#     )

#     user_permissions = models.ManyToManyField(
#         "auth.Permission",
#         related_name="customuser_permissions_set",  # Fix the clash here
#         blank=True
#     )

#     def __str__(self):
#         return self.username

# class Exam(models.Model):
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     duration = models.IntegerField(default=3) #in minutes
#     created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.title

# class Question(models.Model):
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
#     text = models.TextField()
#     question_type = models.CharField(max_length=10, choices=[("MCQ", "MCQ"), ("Subjective", "Subjective")])
#     options = models.JSONField(blank=True, null=True)  # Store MCQ options as JSON
#     correct_answer = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.text

# class StudentAnswer(models.Model):
#     student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     answer = models.TextField()
#     is_correct = models.BooleanField(default=False)
#     marks_obtained = models.FloatField(default=0)

#     def __str__(self):
#         return f"{self.student.username} - {self.exam.title} - {self.question.text}"

# class StudentExamAttempt(models.Model):
#     student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
#     attempted = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.student.username} - {self.exam.title} - {'Attempted' if self.attempted else 'Not Attempted'}"

# class ContactMessage(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name + " - " + self.email

# class DisqualifiedAttempt(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
#     reason = models.CharField(max_length=255)
#     timestamp = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'exam')  # prevent duplicate records

#     def __str__(self):
#         return f"{self.user.username} - {self.exam.title} - {self.reason}"\


from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    # Djongo often breaks with auth.Group and auth.Permission relationships
    # So we comment these out if not explicitly needed
    # groups = models.ManyToManyField("auth.Group", related_name="customuser_set", blank=True)
    # user_permissions = models.ManyToManyField("auth.Permission", related_name="customuser_permissions_set", blank=True)

    def __str__(self):
        return self.username


class Exam(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.IntegerField(default=3)  # in minutes
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=[("MCQ", "MCQ"), ("Subjective", "Subjective")])
    options = models.TextField(blank=True, null=True)  # Changed from JSONField for Djongo compatibility
    correct_answer = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.text


class StudentAnswer(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField()
    is_correct = models.BooleanField(default=False)
    marks_obtained = models.FloatField(default=0)

    def __str__(self):
        return f"{self.student.username} - {self.exam.title} - {self.question.text}"


class StudentExamAttempt(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    attempted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.exam.title} - {'Attempted' if self.attempted else 'Not Attempted'}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name + " - " + self.email


class DisqualifiedAttempt(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    reason = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    # Djongo doesn't support 'unique_together' reliably, so we skip it for now
    # You can enforce this logic manually in views/forms

    def __str__(self):
        return f"{self.user.username} - {self.exam.title} - {self.reason}"
