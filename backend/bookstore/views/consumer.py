from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.consumer import ConsumerSerializer
from ..messages.consumer import ConsumerMessage
from ..models.consumer import Consumer
from ..models.parameter import Parameter

class CreateConsumerAPIView(GenericAPIView):
    serializer_class = ConsumerSerializer
    def post(self, request):
        consumer_data = ConsumerSerializer(data=request.data)

        if not consumer_data.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": ConsumerMessage.MSG0003
            }, status=status.HTTP_400_BAD_REQUEST)
        
        consumer_name = consumer_data.data['Name']
        address = consumer_data.data['Address']
        phone = consumer_data.data['Phone']
        email = consumer_data.data['Email']

        maxConsumerNameLength = Parameter.objects.filter(ParameterName='maxConsumerNameLength').first()
        minConsumerNameLength = Parameter.objects.filter(ParameterName='minConsumerNameLength').first()
        maxAddressLength = Parameter.objects.filter(ParameterName='maxAddressLength').first()
        minAddressLength = Parameter.objects.filter(ParameterName='minAddressLength').first()
        maxPhoneLength = Parameter.objects.filter(ParameterName='maxPhoneLength').first()
        minPhoneLength = Parameter.objects.filter(ParameterName='minPhoneLength').first()
        maxEmailLength = Parameter.objects.filter(ParameterName='maxEmailLength').first()

        # Checking if the consumer already exists
        if not consumer_name or len(consumer_name) < int(minConsumerNameLength.Value) or len(consumer_name) > int(maxConsumerNameLength.Value) or consumer_name.isalnum():
            return Response(
                {
                     "success": False,
                     "message": ConsumerMessage.MSG1001
                },
                  status=status.HTTP_400_BAD_REQUEST
             )
        
        if not address or len(address) < int(minAddressLength.Value) or len(address) > int(maxAddressLength.Value):
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1002
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if not phone or len(phone) > int(maxPhoneLength.Value) or len(phone) <  int(minPhoneLength.Value) or not phone.isdigit():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1003
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        if Consumer.objects.filter(Phone=phone).exists():
                return Response({
                    "success": False,
                    "message": ConsumerMessage.MSG1004
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if email:
            if len(email) > int(maxEmailLength.Value) or ' ' in email or '@' not in email:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1005
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Consumer.objects.filter(Email=email).exists():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1006
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        consumer_instance = Consumer(
            Name= consumer_name,
            Address = address,
            Phone = phone,
            Email = email
            )
        consumer_instance.save()
        
        return Response(
            {
                "success": True,
                "message": ConsumerMessage.MSG0001,
                "data": {
                            "ConsumerId": consumer_instance.ConsumerId,
                            **consumer_data.validated_data
                        }
            },
            status=status.HTTP_200_OK
        )

class GetAllConsumerDetailAPIView(GenericAPIView):
    serializer_class = ConsumerSerializer
    def get(self, request):
        try:
            consumers = Consumer.objects.all()
            consumer_data = {}
            for consumer in consumers:
                consumer_data[consumer.ConsumerId] = model_to_dict(consumer)
            return Response(
                {
                    "success": True,
                    "message": ConsumerMessage.MSG0001,
                    "data": consumer_data
                },
                status=status.HTTP_200_OK
                )
        except Consumer.DoesNotExist:
            return Response(
                {"message": ConsumerMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )
        
class GetConsumerDetailAPIView(GenericAPIView):
    serializer_class = ConsumerSerializer
    def get(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            return Response(
                {
                    "success": True,
                    "message": ConsumerMessage.MSG0001,
                    "data": model_to_dict(consumer)
                },
                status=status.HTTP_200_OK
            )
        except Consumer.DoesNotExist:
            return Response(
                {"message": ConsumerMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdateConsumerAPIView(GenericAPIView):
    serializer_class = ConsumerSerializer
    def put(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            consumer_data = ConsumerSerializer(data=request.data, partial=True)
            if not consumer_data.is_valid(raise_exception=True):
                return Response({
                "success": False,
                "message": ConsumerMessage.MSG0003
                }, status=status.HTTP_400_BAD_REQUEST)

            consumer_name = consumer_data.data['Name']
            address = consumer_data.data['Address']
            phone = consumer_data.data['Phone']
            email = consumer_data.data['Email']

            maxConsumerNameLength = Parameter.objects.filter(ParameterName='maxConsumerNameLength').first()
            minConsumerNameLength = Parameter.objects.filter(ParameterName='minConsumerNameLength').first()
            maxAddressLength = Parameter.objects.filter(ParameterName='maxAddressLength').first()
            minAddressLength = Parameter.objects.filter(ParameterName='minAddressLength').first()
            maxPhoneLength = Parameter.objects.filter(ParameterName='maxPhoneLength').first()
            minPhoneLength = Parameter.objects.filter(ParameterName='minPhoneLength').first()
            maxEmailLength = Parameter.objects.filter(ParameterName='maxEmailLength').first()

        # Checking if the consumer already exists
            if not consumer_name or len(consumer_name) < int(minConsumerNameLength.Value) or len(consumer_name) > int(maxConsumerNameLength.Value) or consumer_name.isalnum():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1001
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            if not address or len(address) < int(minAddressLength.Value) or len(address) > int(maxAddressLength.Value):
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1002
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not phone or len(phone) > int(maxPhoneLength.Value) or len(phone) <  int(minPhoneLength.Value) or not phone.isdigit():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1003
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Consumer.objects.filter(Phone=phone).exclude(pk=pk).exists():
                return Response({
                    "success": False,
                    "message": ConsumerMessage.MSG1004
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if email:
                if len(email) > int(maxEmailLength.Value) or ' ' in email or '@' not in email:
                    return Response(
                        {
                            "success": False,
                            "message": ConsumerMessage.MSG1005
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if Consumer.objects.filter(Email=email).exclude(pk=pk).exists():
                    return Response(
                        {
                            "success": False,
                            "message": ConsumerMessage.MSG1006
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            consumer.Name = consumer_name
            consumer.Address = address
            consumer.Phone = phone
            consumer.Email = email
            consumer.save()
            
            return Response(
                {
                    "success": True,
                    "message": ConsumerMessage.MSG0001,
                    "data": { 
                            "consumerID": consumer.pk,
                            **consumer_data.data
                            }
                },
                status=status.HTTP_200_OK
            )
        
        except Consumer.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": ConsumerMessage.MSG0004
                },
                status=status.HTTP_404_NOT_FOUND
            )


class DeleteConsumerAPIView(GenericAPIView):
    serializer_class = ConsumerSerializer
    def delete(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            consumer.delete()
            return Response(
                {
                    "success": True,
                    "message": ConsumerMessage.MSG0001,
                },status=status.HTTP_200_OK)
        except Consumer.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": ConsumerMessage.MSG0004,
                },status=status.HTTP_404_NOT_FOUND
            )