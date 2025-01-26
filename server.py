from flask_app import app
from flask_app.controllers import root_controller

#Run Server
if __name__ == '__main__':
    app.run(debug=True)