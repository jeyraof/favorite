# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, redirect, url_for, send_from_directory
from config import Config
from database import db, Favorite, Url, Picture
from time import time
import os

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
        favorites = Favorite.query.filter(Favorite.id < pos) if pos else Favorite.query
        favorites = favorites.order_by('-id').limit(Config.ITEM_EA).all()

        favorite_list = []
        for favorite in favorites:
            dump = {
                'id': favorite.id,
                'title': favorite.title,
                'subtitle': favorite.subtitle,
                'uid': favorite.uid,
                'taken': favorite.taken,
                'url_count': favorite.urls.count(),
                'picture_count': favorite.pictures.count(),
            }
            picture = Picture.query.filter_by(favorite_id=favorite.id).order_by('-id').first()
            dump['picture'] = picture.path if picture else None
            favorite_list.append(dump)

        return jsonify(ok=True, favorites=favorite_list)


@app.route("/favorite/<int:f_id>/pic/add", methods=['POST'])
def add_picture_to_favorite(f_id=0):
    if not f_id > 0:
        return jsonify(ok=False, msg=u'1')

    if request.method == 'POST':
        files = request.files.get('pic', None)
        if files and allowed_file(files.filename):
            filename = str(time()) + get_ext(files.filename)
            path = os.path.join(Config.UPLOAD_DIR, filename)
            files.save(path)

            pic = Picture(favorite_id=f_id, path=path)
            db.session.add(pic)
            db.session.commit()

            favorite = Favorite.query.filter_by(id=f_id).first()

            return jsonify(ok=True,
                           favorite_id=f_id,
                           favorite_title=favorite.title,
                           favorite_subtitle=favorite.subtitle,
                           path=path)

    return jsonify(ok=False, msg=u'2')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in Config.ALLOWED_EXTENSIONS


def get_ext(filename):
    if '.' in filename:
        return '.' + filename.rsplit('.', 1)[1]
    else:
        return None


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