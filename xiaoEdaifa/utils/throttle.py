from webbrowser import get

from rest_framework.throttling import SimpleRateThrottle


#s游客访问控制
class VisitThrottle(SimpleRateThrottle):
    # SimpleRateThrottle 会根据 scope  在全局配置里的参数取配置
    scope = "vister"

    def get_cache_key(self, request, view):
        return self.get_ident(request)
