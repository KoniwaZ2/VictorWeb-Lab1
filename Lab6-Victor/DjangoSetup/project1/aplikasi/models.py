from django.db import models

class Mahasiswa(models.Model):
  nim = models.CharField(unique=True, null=True)
  firstname = models.CharField(max_length=255)
  lastname = models.CharField(max_length=255)
  jurusan = models.CharField(max_length=100,null=True)


  def __str__(self):
    return f"{self.nim} - {self.firstname} {self.lastname} - {self.jurusan}"
