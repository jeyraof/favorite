# -*- coding: utf-8 -*-


class Config(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///favorite.db'

    ITEM_EA = 10

    UPLOAD_DIR = 'data/'
    ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']