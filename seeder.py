from myapp.models import db, User, Token
db.create_all()
user = User(email='john@example.com',
            password='$2b$12$zeG/LqtQtB72sOcBsVdzluIqxZoghGGsmSFEmHzajYPl96KqYc/h6')
db.session.add(user)
db.session.commit()

token = Token(user_id=user.id)
db.session.add(token)
db.session.commit()

print ('token', token.value)
