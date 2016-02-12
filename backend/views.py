from django.contrib.auth import get_user_model
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import AuthenticationForm

from api.models import Engineer, Product, Category


def engineers(request):
    return render(request, 'engineers.html', {
        'meta': Engineer._meta
    })


def products(request):
    return render(request, 'products.html', {
        'meta': Product._meta
    })


def categories(request):
    return render(request, 'categories.html', {
        'meta': Category._meta
    })


def users(request):
    return render(request, 'users.html', {
        'meta': get_user_model()._meta
    })


def login(request):
    if request.method == "POST":
        form = AuthenticationForm(request, request.POST)
        form.fields['username'].widget.attrs['class'] = "form-control text-center"
        form.fields['password'].widget.attrs['class'] = "form-control text-center"
        if form.is_valid(): 
            formName = form.cleaned_data['username']
            formPassword = form.cleaned_data['password']
            user = authenticate(username=formName, password=formPassword)
            if user is not None:
                # the password verified for the user
                if user.is_active:
                    auth_login(request, user)
                    return redirect('/engineers')
                else:
                    # print("The password is valid, but the account has been disabled!")
                    return render(request, 'login.html',{'form': form, 'FormError': 'the account has been disabled!'})
            else:
                # the authentication system was unable to verify the username and password
                return render(request, 'login.html',{'form': form, 'FormError': 'The username and/or password were incorrect'})

    else:
        form = AuthenticationForm()
        form.fields['username'].widget.attrs['class'] = "form-control text-center"
        form.fields['username'].widget.attrs['placeholder'] = "Username"
        form.fields['password'].widget.attrs['class'] = "form-control text-center"
        form.fields['password'].widget.attrs['placeholder'] = "Password"
    
    return render(request, 'login.html',{'form': form})