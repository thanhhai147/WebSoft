from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from ..serializers.consumer import ConsumerSerializer
from ..messages.consumer import ConsumerMessage
from ..models.consumer import Consumer

class CreateConsumerAPIView(GenericAPIView):
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
        debt = consumer_data.data['Debt']
        created = consumer_data.data['Created']

        # Checking if the consumer already exists
        if not consumer_name or len(consumer_name) == 0 or len(consumer_name) >= 255 or not consumer_name.isalnum():
            return Response(
                {
                    "success": False,
                    "message": ConsumerMessage.MSG1001
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not address or len(address) == 0 or len(address) >= 255:
            return Response(
                {
                    "success": False,
                    "message": ConsumerMessage.MSG1002
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not phone or len(phone) >= 11 or len(phone) <= 0 or not phone.isdigit():
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
            if len(email) >= 320 or ' ' in email or '@' not in email:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1005
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        if debt < 0:
            return Response(
                {
                    "success": False,
                    "message": ConsumerMessage.MSG1006
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        Consumer(
            Name= consumer_name,
            Address = address,
            Phone = phone,
            Email = email,
            Debt = debt,
            Created = created
            ).save()
        
        return Response(
            {
                "success": True,
                "message": ConsumerMessage.MSG0001,
                "data": ConsumerSerializer(consumer_data).data
            },
            status=status.HTTP_200_OK
        )


class GetConsumerDetailAPIView(GenericAPIView):
    def get(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            consumer_data = ConsumerSerializer(consumer)
            return Response(consumer_data.data)
        except Consumer.DoesNotExist:
            return Response(
                {"message": ConsumerMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdateConsumerAPIView(GenericAPIView):
    def put(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            consumer_data = ConsumerSerializer(consumer, data=request.data)
            if not consumer_data.is_valid(raise_exception=True):
                return Response({
                "success": False,
                "message": ConsumerMessage.MSG0003
                }, status=status.HTTP_400_BAD_REQUEST)
            
            consumer_name = consumer_data.data['Name']
            address = consumer_data.data['Address']
            phone = consumer_data.data['Phone']
            email = consumer_data.data['Email']
            debt = consumer_data.data['Debt']
            created = consumer_data.data['Created']

        # Checking if the consumer already exists
            if not consumer_name or len(consumer_name) == 0 or len(consumer_name) >= 255 or not consumer_name.isalnum():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1002
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not address or len(address) == 0 or len(address) >= 255:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1003
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not phone or len(phone) >= 11 or len(phone) <= 0 or not phone.isdigit():
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1004
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if Consumer.objects.filter(Phone=phone).exists():
                return Response({
                    "success": False,
                    "message": ConsumerMessage.MSG1005
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if email:
                if len(email) >= 320 or ' ' in email or '@' not in email:
                    return Response(
                        {
                            "success": False,
                            "message": ConsumerMessage.MSG1006
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if debt < 0:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1007
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            consumer.Name = consumer_name
            consumer.Address = address
            consumer.Phone = phone
            consumer.Email = email
            consumer.Debt = debt
            consumer.Created = created
            consumer.save()

            return Response(
                {
                    "success": True,
                    "message": ConsumerMessage.MSG0001,
                    "data": ConsumerSerializer(consumer_data.instance).data
                },
                status=status.HTTP_200_OK
            )
        
        except Consumer.DoesNotExist:
            return Response(
                {"message": ConsumerMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )


class DeleteConsumerAPIView(GenericAPIView):
    def delete(self, request, pk):
        try:
            consumer = Consumer.objects.get(pk=pk)
            consumer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Consumer.DoesNotExist:
            return Response(
                {"message": ConsumerMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )