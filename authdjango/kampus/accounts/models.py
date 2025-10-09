# accounts/models.py
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ("MAHASISWA", "Mahasiswa"),
        ("DOSEN", "Dosen"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="MAHASISWA")

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

class Nilai(models.Model):
    mahasiswa = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'profile__role': 'MAHASISWA'})
    mata_kuliah = models.CharField(max_length=100)
    nilai = models.FloatField()

    def __str__(self):
        return f"{self.mahasiswa.username} - {self.mata_kuliah}: {self.nilai}"