from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////%s' % os.path.join(
    os.getcwd(), 'test.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)


@app.route('/')
def hello_world():
    return render_template('/pages/home.html')


@app.route('/about')
def about():
    return render_template('/pages/about.html')
