from myapp import app, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
import os


app.config.from_object('config')
MIGRATION_DIR = os.path.join('myapp', 'migrations')
migrate = Migrate(app, db, directory=MIGRATION_DIR)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

from myapp import routes


if __name__ == '__main__':
    manager.run()
