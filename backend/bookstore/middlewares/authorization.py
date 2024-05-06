from django.utils.deprecation import MiddlewareMixin

class AuthorizationMiddleware(MiddlewareMixin):    
    def process_view(self, request, view_func, *view_args, **view_kwargs):
        print(request)