from myapp import app
from flask import request, jsonify, g, abort, redirect, url_for, render_template, make_response
from myapp.models import db, User, Token
from functools import wraps
import bcrypt

# Check for authorization headers


def requires_authorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        received_token = request.cookies.get('token')
        if received_token:
            result = User.query.join(Token, User.id == Token.user_id).filter(
                Token.value == received_token).first()
            if result is not None:
                g.user = result
                return f(*args, **kwargs)
            else:
                return redirect(url_for("index"))
                abort(401)
        else:
            return redirect(url_for("index"))
            abort(401)
    return decorated


@app.route('/', defaults={'path': ''},  methods=['GET', 'POST'])
@app.route('/<path:path>', methods=['GET', 'POST'])
def index(path):
    return render_template('index.html')


@app.route('/profile', methods=['GET'])
@requires_authorization
def profile():
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
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    password = json_data['password']
    if user:
        saved_hashed_password = user.password
        if bcrypt.checkpw(password.encode('utf8'), saved_hashed_password):
            token = Token(user_id=user.id)
            status = True
            db.session.add(token)
            db.session.commit()
            response = make_response()
            response.set_cookie('token', token.value)
            return response
        else:
            return jsonify({'status': 'User Password do not match'})
    else:
        status = 'Login Error, User Do Not Exist'
    return jsonify({'status': status})

# Register API


@app.route('/api/signup', methods=['POST'])
def signup():
    print ('data', request.data)
    print ('args', request.args)
    print ('json', request.json)
    email = request.json.get('email')
    password = request.json.get('password')
    # Encrypt the password and save it to database
    hashed_password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    user = User(email=email, password=hashed_password)
    try:
        db.session.add(user)
        db.session.commit()
        status = 'User Registered'
    except Exception as e:
        status = 'This user is already registered'
        return jsonify({'error': str(e)})
    return jsonify({'status': status})


@app.route('/logout', methods=['GET'])
@requires_authorization
def logout():
    response = make_response()
    response.set_cookie('token', "", expires=0)
    return response
