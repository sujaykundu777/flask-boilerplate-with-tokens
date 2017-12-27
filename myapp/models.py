from myapp import db

# Defining  Models


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(8), nullable=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
