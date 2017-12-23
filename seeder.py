from myapp.models import db, User

user = User(username='sujaykundu',
            email='sujaykundu777@gmail.com', password='123456')

db.create_all()
db.session.add(user)
db.session.commit()
