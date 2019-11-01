

class VIPPermission(object):
    def has_permission(self, request, view):

        if request.user.type == 2:
            return True
        return False


# 普通用户
class UserPermission(object):
    def has_permission(self, request, view):
        if request.user.type == 1:
            return True
        return False


class Superpermission(object):

    def has_permission(self, request, view):
        print("Superpermission",request.user)

        if request.user.type == 99:
            return True
        return False


class NahuoUserpermission(object):

    def has_permission(self, request, view):
        print("NahuoUserpermission")
        if request.user.type == 98 or request.user.type == 99:
            return True
        return False
