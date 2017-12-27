import os

WTF_CSRF_ENABLED = True

# Database Config
SQLALCHEMY_DATABASE_URI = 'sqlite:////%s' % os.path.join(os.getcwd(), 'database.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True
