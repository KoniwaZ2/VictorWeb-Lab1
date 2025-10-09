# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import LoginForm
from .models import Profile, Nilai

def login_view(request):
    if request.user.is_authenticated:
        return redirect("accounts:dashboard")

    form = LoginForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = authenticate(
            request,
            username=form.cleaned_data["username"],
            password=form.cleaned_data["password"],
        )
        if user:
            login(request, user)
            messages.success(request, "Berhasil masuk.")
            return redirect("accounts:dashboard")
        messages.error(request, "Username atau password salah.")
    return render(request, "accounts/login.html", {"form": form})

def logout_view(request):
    logout(request)
    messages.info(request, "Anda telah logout.")
    return redirect("accounts:login")

@login_required
def dashboard(request):
    # role-based UI rendering
    role = getattr(getattr(request.user, "profile", None), "role", "MAHASISWA")

    return render(request, "accounts/dashboard.html", {"role": role})

# ---- contoh halaman khusus dosen ----
def is_dosen(user):
    return hasattr(user, "profile") and user.profile.role == "DOSEN"

@user_passes_test(is_dosen, login_url="accounts:login")
def dosen_only_view(request):
    # Ambil semua data nilai untuk ditampilkan kepada dosen
    nilai_list = Nilai.objects.all()
    return render(request, "accounts/dosen_only.html", {"nilai_list": nilai_list})

@login_required
def dashboard_with_nilai(request):
    role = getattr(getattr(request.user, "profile", None), "role", "MAHASISWA")

    if role == "DOSEN":
        nilai_list = Nilai.objects.all()
    else:
        nilai_list = Nilai.objects.filter(mahasiswa=request.user)
    
    return render(request, "accounts/dashboard.html", {
        "role": role,
        "nilai_list": nilai_list
    })