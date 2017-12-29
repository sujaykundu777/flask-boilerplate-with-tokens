# flask-boilerplate
A boilerplate for flask app with token based authentication

# Run the Seeder

$ python seeder.py

Request Authentication

# Signup

curl -i -X POST -H 'Content-Type: application/json' \
    --data '{"email":"john2@example.com", "password":"123456"}' 'http://0.0.0.0:3000/signup'

# Signin

curl -i -X POST -H 'Content-Type: application/json'  \
    --data '{"email":"john2@example.com", "password":"123456"}' 'http://0.0.0.0:3000/signin'

# Profile

It requires a access_token to get details of a user profile details

curl -i -X GET -H 'token: 12d06361-046f-4388-a699-c8012db4b4e7' \
'http://0.0.0.0:3000/profile'
