# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, redirect, url_for
from config import Config
from database import db, Favorite, Url, Picture

app = Flask(__name__)
app.config.from_object(Config)
db.app = app
db.init_app(app)


@app.route("/")
def main():
    return render_template('index.html',
                           debug=app.config.get('DEBUG', False),
                           )


@app.route("/favorite/get")
def get_favorites():
    pass


@app.route("/favorite/add", methods=['POST'])
def add_favorite():

    title = request.form.get('title', None)
    subtitle = request.form.get('subtitle', None)
    uid = request.form.get('uid', '')
    taken = True if request.form.get('taken', None) else False

    favorite = Favorite(title=title, subtitle=subtitle, uid=uid, taken=taken)
    db.session.add(favorite)
    db.session.commit()

    return redirect(url_for('main'))


@app.route("/favorite/validate", methods=['POST'])
def validate_favorite():
    title = request.form.get('title', None)
    subtitle = request.form.get('subtitle', None)

    if None in (title, subtitle):
        return jsonify(ok=False, msg=u'Invalid request.')

    return jsonify(ok=True)

if __name__ == '__main__':
    app.run()