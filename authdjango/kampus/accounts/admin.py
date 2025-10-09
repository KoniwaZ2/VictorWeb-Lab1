# accounts/admin.py
from django.contrib import admin
from .models import Profile, Nilai

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)
    search_fields = ("user__username", "user__email")

class NilaiAdmin(admin.ModelAdmin):
    list_display = ("mahasiswa", "mata_kuliah", "nilai")
    search_fields = ("mahasiswa__username", "mata_kuliah")
    list_filter = ("mata_kuliah",)
admin.site.register(Nilai, NilaiAdmin)
