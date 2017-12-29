from myapp import app
from flask import render_template, request, jsonify, g, abort
from myapp.models import db, User, Token
from functools import wraps
import bcrypt


def requires_authorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        received_token = request.headers.get('token')
        print ('received_token', received_token)
        if received_token:
            result = User.query.join(Token, User.id == Token.user_id).filter(
                Token.value == received_token).first()
            if result is not None:
                g.user = result
                return f(*args, **kwargs)
            else:
                abort(401)
        else:
            abort(401)
    return decorated


@app.route('/')
def hello_world():
    return render_template('/pages/home.html')


@app.route('/about')
def about():
    return render_template('/pages/about.html')


@app.route('/profile', methods=['GET'])
@requires_authorization
def profile():
    return jsonify({'data': {'user': {'id': g.user.id, 'email': g.user.email}}})


@app.route('/created', methods=['GET'])
@requires_authorization
def created():
    print (g.user.__dict__)
    return jsonify({'data': g.user.created_at})


@app.route('/signin', methods=['POST'])
def signin():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    password = json_data['password']
    if user:
        print('User Exists')
        saved_hashed_password = user.password
        if bcrypt.checkpw(password.encode('utf8'), saved_hashed_password):
            status = True
            token = Token(user_id=user.id)
            db.session.add(token)
            db.session.commit()
            return jsonify({'token': token.value})
        else:
            status = 'Password Incorrect'
    else:
        print('User Do Not Exist')
        status = False
    return jsonify({'Success': status})


@app.route('/signup', methods=['POST'])
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
        status = True
    except Exception as e:
        status = 'This user is already registered'
        return jsonify({'error': str(e)})
    return jsonify({'Success': status})
