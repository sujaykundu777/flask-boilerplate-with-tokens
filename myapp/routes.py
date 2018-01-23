from myapp import app
from flask import request, jsonify, g, abort, redirect, url_for, render_template, make_response, Response
from myapp.models import db, User, Token
from functools import wraps
import bcrypt
import json

# Check for authorization headers


def requires_authorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        received_token = request.cookies.get('token')
        print(received_token)
        if received_token:
            #check if received token == token.value s
            result = User.query.join(Token, User.id == Token.user_id).filter(
                Token.value == received_token).first()
            if result is not None:
                # Give Access To Page
                g.user = result
                return f(*args, **kwargs)
            else:
                # Unauthorized Access
                abort(401)
        else:
            abort(401)
    return decorated

@app.route('/', methods=['GET','POST'])
def index():
    return render_template('index.html')

@app.route('/profile', methods=['GET'])
@requires_authorization
def profile():
    print (g.user.__dict__)
    return render_template('index.html')


@app.route('/dashboard', methods=['GET'])
@requires_authorization
def dashboard():
    return render_template('index.html')


@app.route('/user', methods=['GET'])
@requires_authorization
def created():
    print (g.user.__dict__)
    return jsonify({'created_at': g.user.created_at, 'email': g.user.email})

# Login API


@app.route('/api/signin', methods=['POST'])
def signin():
    # get the user data
    json_data = request.json
    # fetch the user
    user = User.query.filter_by(email=json_data['email']).first()
    if user:
        password = json_data['password']
        saved_hashed_password = user.password
        if bcrypt.checkpw(password.encode('utf8'), saved_hashed_password):
            token = Token(user_id=user.id)
            if token:
                db.session.add(token)
                db.session.commit()
                responseObj = {
                    'status': 'success',
                    'message': 'Successfully logged in'
                }
                response = Response(json.dumps(
                    responseObj, indent=2), status=200, mimetype=u'application/json')
                response.set_cookie('token', token.value)
                return response
            else:
                responseObject = {
                    'status': 'failure',
                    'message': 'Token Not Received',
                }
                return make_response(jsonify(responseObject)), 404
        else:
            return make_response(jsonify({'status': 'User Password do not match'})), 404
    else:
        return make_response(jsonify({'status': 'User Does Not Exist'})), 404

# Register API


@app.route('/api/signup', methods=['POST'])
def signup():
    email = request.json.get('email')
    password = request.json.get('password')
    # Encrypt the password and save it to database
    hashed_password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    user = User(email=email, password=hashed_password)
    try:
        db.session.add(user)
        db.session.commit()
        responseObj = {
            'status': 'success',
            'message': 'User Successfully Registered'
        }
        return make_response(jsonify(responseObj)), 200
    except:
        responseObj = {
            'status': 'failure',
            'message': 'User Already Exists'
        }
        return make_response(jsonify(responseObj)), 404


# Signout

@app.route('/signout', methods=['GET'])
@requires_authorization
def signout():
    responseObj = {
        'status': 'success',
        'message': 'Successfully logged out'
    }
    # redirect_to_index = redirect('/')
    # response = make_response(redirect_to_index )
    response = Response(json.dumps(responseObj, indent=2), status=200, mimetype=u'application/json')
    response.set_cookie('token',value=" ")
    return response
