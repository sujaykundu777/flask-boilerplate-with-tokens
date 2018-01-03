# flask-boilerplate
A boilerplate for flask app with token based authentication

## Instructions

clone the Repo :

`$ git clone https://gitlab.com/skillenza/interns/flask-boilerplate.git`

### Setup virtual environment to use python3.6 for the project

Install virtual environment

`$ sudo apt-get install python-virtualenv`

Virtualenv is installed. Now to use it for my project:

`$ cd flask-boilerplate`
`$ virtualenv -p python3.6 venv --no-site-packages`

This will create a venv folder and activate python3.6 for my project. To check:

`$ python -V Python 3.6.3`
`$ pip -V pip 9.0.1`

Install all the required python plugins using pip using the requirements.txt

`$ pip install -r requirements.txt`

### Setting up the database

```
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
```

This will create the initial tables for the database

### Creating the first user

Signup

```
$ curl -i -X POST -H 'Content-Type: application/json' \
    --data '{"email":"john2@example.com", "password":"123456"}' 'http://0.0.0.0:5000/signup'
```
Signin

```
$ curl -i -X POST -H 'Content-Type: application/json'  \
    --data '{"email":"john2@example.com", "password":"123456"}' 'http://0.0.0.0:5000/signin'
```

Signing in successfully will return a token. This can be used to visit authenticated routes

Profile

It requires a access_token to get details of a user profile details

```
curl -i -X GET -H 'token: 33a059ed-adb0-4f9c-a69f-b4a990c77fd3' \
'http://0.0.0.0:5000/profile'
```
