from myapp import db
import datetime
import uuid

# Defining  Models


def uuid_str():
    return str(uuid.uuid4())


class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.String(36), default=uuid_str, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow)


class User(Base):
    __tablename__ = 'user'
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(8), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password


class Token(Base):
    __tablename__ = 'token'
    user_id = db.Column(db.String(36), db.ForeignKey(
        'user.id'), nullable=False, default=uuid_str)
    value = db.Column(db.String(36), nullable=False, default=uuid_str)

    def __init__(self, user_id):
        self.user_id = user_id
