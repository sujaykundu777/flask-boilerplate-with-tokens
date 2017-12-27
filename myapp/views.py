from myapp import app
from flask import render_template
from myapp.forms import RegisterForm, LoginForm

@app.route('/')
def hello_world():
    return render_template('/pages/home.html')

@app.route('/about')
def about():
    return render_template('/pages/about.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    return render_template('/pages/login.auth.html' , form = form )

@app.route('/register')
def register():
    form = RegisterForm()
    return render_template('/pages/register.auth.html', form = form)
