﻿"""
Django settings for xiaoEdaifa project.

Generated by 'django-admin startproject' using Django 2.0.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&u32dk@hij(zvh612y^!@_zmrfcxy8w51!(6u4(o6$egfy3#ki'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

#ALLOWED_HOSTS = ['192.168.1.109','localhost']

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'user',
    'trade',
    'backstage',
    'nahuo_client',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware', # 注意顺序
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'xiaoEdaifa.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'xiaoEdaifa.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

DATABASES = {
    'default': {
         'ENGINE': 'django.db.backends.mysql',
         'NAME': 'xiaoedaifa',
         'USER': 'moon',
         'PASSWORD': 'a123a123a',
         'HOST': '127.0.0.1',
         'PORT': '4406',
         'OPTIONS': {
            'charset': 'utf8mb4',
         },
    }
}




# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
TEMP_FILE_DIRS = os.path.join(BASE_DIR, 'static/temp')
# 解决跨域设置
CORS_ORIGIN_ALLOW_ALL  = True
CORS_ALLOW_CREDENTIALS = True
# CORS_ORIGIN_WHITELIST = (
#     '*'
# )
CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
    'VIEW',
)
CORS_ALLOW_HEADERS = (
    'XMLHttpRequest',
    'X_FILENAME',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'Pragma',
)


REST_FRAMEWORK = {
    # 用户认证全局配置
    "DEFAULT_AUTHENTICATION_CLASSES":['utils.auth.UserAuthtication'],
    # 访问频率
    "DEFAULT_THROTTLE_CLASSES":['utils.throttle.VisitThrottle'],
    #
    "DEFAULT_THROTTLE_RATES": {
    # 每分钟60次频率
        'vister': '600/m',
    },
   # "DEFAULT_PARSER_CLASSES": ['rest_framework.parsers.JSONParser', 'rest_framework.parsers.FormParser'],
}
#
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'file': {
#             'level': 'DEBUG',
#             'class': 'logging.FileHandler',
#             'filename': 'c:/debug.log',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file'],
#             'level': 'DEBUG',
#             'propagate': True,
#         },
#     },
# }

LOGGING = {
    # 规定只能这样写
    'version': 1,
    # True表示禁用loggers
    'disable_existing_loggers': False,
    # 指定文件写入的格式——这里写了两个不同的格式，方便在后面不同情况需要的时候使用
    'formatters': {
        'default': {
            'format': '%(levelno)s %(funcName)s %(asctime)s %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(module)s %(asctime)s %(message)s'
        }
    },
    'handlers': {
        'stu_handlers': {
            'level': 'DEBUG',
            # 日志文件指定为多大(5M)， 超过大小(5M)重新命名，然后写新的日志文件
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 5 * 1024 * 1024,
            # 储存到的文件地址
            'filename': "c:/log.txt",
            'formatter': 'default'
        },
        'uauth_handlers': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 5 * 1024 * 1024,
            'filename': "c:/log.txt",
            'formatter': 'simple'
        }
    },

    'loggers': {
        'stu': {
            'handlers': ['stu_handlers'],
            'level': 'INFO'
        },
        'auth': {
            'handlers': ['uauth_handlers'],
            'level': 'INFO'
        }
    },
}

EMAIL_HOST = 'smtp.qq.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
#发送邮件的邮箱
EMAIL_HOST_USER = '137637653@qq.com'
#在邮箱中设置的客户端授权密码
EMAIL_HOST_PASSWORD = 'puoahkhhoirvcaaa'
#收件人看到的发件人
EMAIL_FROM = '修改密码<137637653@qq.com>'

