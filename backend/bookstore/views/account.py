import hashlib
from django.utils import timezone
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status

from ..serializers.account import SignInSerializer
from ..models import Account, Token, Parameter

from ..messages.account import AccountMessage

# Sign-in
class SignInViewAPIView(GenericAPIView):
    serializer_class = SignInSerializer
    
    def post(self, request):
        signin_data = SignInSerializer(data=request.data)
        # Signin data is empty or is not valid serializer format
        if not signin_data.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": AccountMessage.MSG1003
            }, status=status.HTTP_400_BAD_REQUEST)
        
        username = signin_data.data['username']
        password = signin_data.data['password']
        password = hashlib.sha256(password.strip().encode('utf-8')).hexdigest()
 
        account = Account.objects.filter(AccountName=username, Password=password).first()
        # AccountName or Password does not correct
        if account is None:
            return Response(
                {
                    "status": False,
                    "message": AccountMessage.MSG1004
                }
            )
        else:
            token = Token.objects.filter(AccountId=account.AccountId).first()
            key = hashlib.sha256((username + str(timezone.now())).encode("utf-8")).hexdigest()
            if token is None:
                token = Token.objects.create(Key=key, AccountId=account.AccountId, Created=timezone.now())
            else:
                Token.objects.filter(AccountId=account.AccountId).update(Key=key, Created=timezone.now())
                token = Token.objects.filter(AccountId=account.AccountId).first()
            
            return Response({
                "success": True,
                "message": "",
                "data": {
                    "account": username,
                    "token": key
                }
            }, status=status.HTTP_200_OK)

# Authorization by token
class GetAccessFunctionAPIView(GenericAPIView):

    def get(self, request):
        try:
            token = request.headers['Authorization']
        except:
            return Response(
                {
                    "success": False,
                    "message": AccountMessage.MSG1005,
                }, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        token = Token.objects.filter(Key=token).first()

        if token is None:
            return Response({
                "success": False,
                "message": AccountMessage.MSG1006,
            }, status=status.HTTP_401_UNAUTHORIZED)

        token_expire_time = Parameter.objects.filter(ParameterName='TokenExpireTime').first()
        if (token.Created + timedelta(hours=token_expire_time.Value)) < timezone.now():
            return Response({
                "success": False,
                "message": AccountMessage.MSG1007,
            }, status=status.HTTP_403_FORBIDDEN)

        return Response({
            "success": True,
            "message": "",
        }, status=status.HTTP_200_OK)

# Sign out
class SignOutAPIView(APIView):
   
    def put(self, request):
        try:
            token = request.headers['Authorization']
        except:
            return Response(
                {
                    "success": False,
                    "message": AccountMessage.MSG1005,
                }, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        token = Token.objects.filter(Key=token).first()

        if token is None:
            return Response({
                "success": False,
                "message": AccountMessage.MSG1006,
            }, status=status.HTTP_401_UNAUTHORIZED)

        token_expire_time = Parameter.objects.filter(ParameterName='TokenExpireTime').first()
        if (token.Created + timedelta(hours=token_expire_time.Value)) < timezone.now():
            return Response({
                "success": False,
                "message": AccountMessage.MSG1007,
            }, status=status.HTTP_403_FORBIDDEN)
        else:
            token_expire_bonus_time = Parameter.objects.filter(ParameterName="TokenExpireBonusTime").first()
            token.Created -= timedelta(hours=token_expire_bonus_time.Value)
            token.save()
            return Response({
                "success": True,
                "message": AccountMessage.MSG1008,
            }, status=status.HTTP_200_OK)
