from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.settings import SettingSerializer
from ..messages.settings import SettingMessage
from ..models.parameter import Parameter

class GetSettingViewAPI(GenericAPIView):
    serializer_class = SettingSerializer
    def get(self, request):
        try:
            parameters = Parameter.objects.all()
            parameter_data = {}
            for parameter in parameters:
                parameter_data[parameter.ParameterName] = model_to_dict(parameter)
            return Response(
                {
                    "success": True,
                    "message": SettingMessage.MSG0001,
                    "data": parameter_data
                },
                status=status.HTTP_200_OK
            )
        except Parameter.DoesNotExist:
            return Response(
                {"message": SettingMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )
        
class GetSettingWithNameViewAPI(GenericAPIView):
    serializer_class = SettingSerializer
    def get(self, request, pk):
        try:
            paramter = Parameter.objects.get(pk=pk)
            return Response(
                {
                    "success": True,
                    "message": SettingMessage.MSG0001,
                    "data": model_to_dict(paramter)
                },
                status=status.HTTP_200_OK
            )
        except Parameter.DoesNotExist:
            return Response(
                {"message": SettingMessage.MSG1001},
                status=status.HTTP_404_NOT_FOUND
            )

class EditSettingViewAPI(GenericAPIView):
    serializer_class = SettingSerializer
    def put(self, request, pk):
        try:
            parameter = Parameter.objects.get(pk=pk)
            parameter_data = SettingSerializer(data=request.data, partial=True)
            if not parameter_data.is_valid(raise_exception=True):
                return Response({
                "success": False,
                "message": SettingMessage.MSG0003
                }, status=status.HTTP_400_BAD_REQUEST)

            value = parameter_data.data['Value']
            active = parameter_data.data['Active']

            parameter.Value = value
            parameter.Active = active
            parameter.save()
            
            return Response(
                {
                    "success": True,
                    "message": SettingMessage.MSG0001,
                    "data": { 
                        "consumerID": parameter.pk,
                        **parameter_data.data
                    }
                },
                status=status.HTTP_200_OK
            )
        
        except Parameter.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": SettingMessage.MSG1001
                },
                status=status.HTTP_404_NOT_FOUND
            )

class DeleteSettingViewAPI(GenericAPIView):
    serializer_class = SettingSerializer
    def delete(self, request, pk):
        try:
            parameter = Parameter.objects.get(pk=pk)
            
            parameter.Active = False
            parameter.save()

            return Response(
                {
                    "success": True,
                    "message": SettingMessage.MSG0001,
                },status=status.HTTP_200_OK)
        except Parameter.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": SettingMessage.MSG1001,
                },status=status.HTTP_404_NOT_FOUND
            )
        
