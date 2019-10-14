

class VIPPermission(object):
    def has_permission(self, request, view):
        return True
        if request.user.type == 2:
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
        if request.user.type == 98 :
            return True
        return False
