from rest_framework import exceptions
from user import models
from rest_framework.authentication import BaseAuthentication
import logging
logger = logging.getLogger('stu')
import traceback


class Authtication(BaseAuthentication):
    def authenticate(self,request):

        token = request._request.GET.get('access_token')
        if token is None or token == "":
            token =  request._request.COOKIES.get("access_token")
        if token is None or token == "":
            raise exceptions.AuthenticationFailed("用户认证失败")

        print('token{}'.format(token))
        token_obj = models.UserToken.objects.filter(token=token).first()

        if  token_obj is None:
            logger.info('%s url:%s method:%s' % ("用户认证失败token:"+token, request.path, request.method))
            raise exceptions.AuthenticationFailed("用户认证失败")
        # zai rest  framework 内部会将两字段复制给request（request.user,request.util），
        return (token_obj.user, token_obj)

    def authenticate_header(self,request):
        pass


# 后台认证
class BackStageAuthentication(BaseAuthentication):
    def authenticate(self,request):
        token = request._request.GET.get('access_token_bk')
        if token is None or token == "":
            token = request._request.COOKIES.get("access_token_bk")
        print("access_token_bk:",token)

        # if token is None or token == "":
        #     token = request._request.GET.get('access_token_nh')
        #     if token is None or token == "":
        #         token = request._request.COOKIES.get("access_token_nh")
        #     print("access_token_nh:", token)
        if token is None or token == "":
            logger.info('%s url:%s method:%s'%("用户认证失败token is Nosne", request.path, request.method))
            return None
            # raise exceptions.AuthenticationFailed("用户认证失败")

        print('token{}'.format(token))
        token_obj = models.UserToken.objects.filter(token=token).first()

        if token_obj is None:
            logger.info('%s url:%s method:%s' % ("用户认证失败token:"+token, request.path, request.method))
            raise exceptions.AuthenticationFailed("用户认证失败")
        # zai rest  framework 内部会将两字段复制给request（request.user,request.util），
        return (token_obj.user, token_obj)

    def authenticate_header(self,request):
        pass


# 拿货app端认证
class BackStageNahuoAuthentication(BaseAuthentication):
    def authenticate(self,request):
        token = request._request.GET.get('access_token_nh')
        if token is None or token == "":
            token = request._request.COOKIES.get("access_token_nh")
        print("access_token_nh:",token)
        if token is None or token == "":
            logger.info('%s url:%s method:%s'%("用户认证失败token is Nosne", request.path, request.method))
            # return None
            raise exceptions.AuthenticationFailed("用户认证失败")

        print('token{}'.format(token))
        token_obj = models.UserToken.objects.filter(token=token).first()

        if  token_obj is None:
            logger.info('%s url:%s method:%s' % ("用户认证失败token:"+token, request.path, request.method))
            raise exceptions.AuthenticationFailed("用户认证失败")
        # zai rest  framework 内部会将两字段复制给request（request.user,request.util），
        return (token_obj.user, token_obj)

    def authenticate_header(self,request):
        pass