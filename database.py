# -*- coding: utf-8 -*-

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    subtitle = db.Column(db.String(255), nullable=False)
    uid = db.Column(db.String(255), nullable=True)
    taken = db.Column(db.Boolean, default=False)


class Picture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(255), nullable=False)
    favorite_id = db.Column(db.Integer, db.ForeignKey(Favorite.id), nullable=False)
    favorite = db.relationship(Favorite, backref=db.backref('pictures', lazy='dynamic'))


class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    favorite_id = db.Column(db.Integer, db.ForeignKey(Favorite.id), nullable=False)
    favorite = db.relationship(Favorite, backref=db.backref('urls', lazy='dynamic'))