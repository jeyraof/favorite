# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, redirect, url_for, send_from_directory
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


@app.route("/favorite/list")
@app.route("/favorite/<int:f_id>/get")
def get_favorites(f_id=None):
    if f_id:

        return jsonify(ok=True)

    else:
        pos = request.args.get('pos', None)
        favorites = Favorite.query.filter(Favorite.id <= pos) if pos else Favorite.query
        favorites = favorites.order_by('-id').limit(Config.ITEM_EA).all()

        favorite_list = []
        for favorite in favorites:
            dump = {
                'id': favorite.id,
                'title': favorite.title,
                'subtitle': favorite.subtitle,
                'uid': favorite.uid,
            }
            picture = Picture.query.filter_by(favorite_id=favorite.id).order_by('-id').first()
            dump['picture'] = picture.path if picture else None
            favorite_list.append(dump)

        return jsonify(ok=True, favorites=favorite_list)


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


@app.route("/data/<path:filename>", methods=['GET'])
def get_data(filename):
    return send_from_directory('data/', filename)

if __name__ == '__main__':
    app.run()