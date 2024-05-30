from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from django.db.models import Q
from ..serializers.consumer import ConsumerSerializer
from ..serializers.storage import DateTimeSerializer
from ..messages.consumer import ConsumerMessage
from ..models.consumer import Consumer
from ..models.parameter import Parameter
from ..models.payment import Payment
from ..models.order import Order
import copy

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
        if  (not consumer_name or 
            (len(consumer_name) < int(minConsumerNameLength.Value) and minConsumerNameLength.Active == True) or 
            (len(consumer_name) > int(maxConsumerNameLength.Value) and maxConsumerNameLength.Active == True)):
            return Response(
                {
                     "success": False,
                     "message": ConsumerMessage.MSG1001
                },
                  status=status.HTTP_400_BAD_REQUEST
             )
        
        if  (not address or
            (len(address) < int(minAddressLength.Value) and minAddressLength.Active == True) or
            (len(address) > int(maxAddressLength.Value) and maxAddressLength.Active == True)):
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1002
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if  (not phone or 
            (len(phone) > int(maxPhoneLength.Value) and maxPhoneLength.Active == True) or 
            (len(phone) < int(minPhoneLength.Value) and minPhoneLength.Active == True) or 
            not phone.isdigit()):
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
            if ((len(email) > int(maxEmailLength.Value) and maxEmailLength.Active == True) or ' ' in email or '@' not in email):
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
            if  (not consumer_name or 
                (len(consumer_name) < int(minConsumerNameLength.Value) and minConsumerNameLength.Active == True) or 
                (len(consumer_name) > int(maxConsumerNameLength.Value) and maxConsumerNameLength.Active == True)):
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1001
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if  (not address or
                (len(address) < int(minAddressLength.Value) and minAddressLength.Active == True) or
                (len(address) > int(maxAddressLength.Value) and maxAddressLength.Active == True)):
                    return Response(
                        {
                            "success": False,
                            "message": ConsumerMessage.MSG1002
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if  (not phone or 
                (len(phone) > int(maxPhoneLength.Value) and maxPhoneLength.Active == True) or 
                (len(phone) < int(minPhoneLength.Value) and minPhoneLength.Active == True) or 
                not phone.isdigit()):
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
                if ((len(email) > int(maxEmailLength.Value) and maxEmailLength.Active == True) or ' ' in email or '@' not in email):
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
            payment = Payment.objects.filter(ConsumerId = pk).exists()
            order = Order.objects.filter(ConsumerId = pk).exists()
            if payment or order:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1007,
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

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
        

class GetMonthDebtReportAPIView(GenericAPIView):
    serializer_class =  DateTimeSerializer
    def post(seft, request):

        dateData = DateTimeSerializer(data=request.data)
        if not dateData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": ConsumerMessage.MSG0003
            }, status=status.HTTP_400_BAD_REQUEST)
    
        startDate = dateData.validated_data['startDate']
        endDate = dateData.validated_data['endDate']

        order_start = Order.objects.filter(
            Q(Created__date__lte=startDate)
        )
        order_end = Order.objects.filter(
            Q(Created__date__gt=startDate) & Q(Created__date__lte=endDate)
        )
        payment_start = Payment.objects.filter(
            Q(Created__date__lte=startDate)
        )
        payment_end = Payment.objects.filter(
            Q(Created__date__gt=startDate) & Q(Created__date__lte=endDate)
        )
        
        # All Order Record from begin to the start date
        orderStartData = {}
        for iter, order in enumerate(order_start):
            orderStartData[f"{iter+1}"] = model_to_dict(order)
        
        debtStart = {}
        for iter, order in enumerate(order_start):
            orderDict = model_to_dict(order)
            consumerId = orderDict["ConsumerId"]
            debt = orderDict["RemainingValue"]
            created = orderDict["Created"]
        
            try:
                consumer = Consumer.objects.get(pk=consumerId)
            except Consumer.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG0004
                    }, status=status.HTTP_400_BAD_REQUEST
                )
            
            if consumerId in debtStart:
                debtStart[consumerId]["Debt"] += debt
            else:
                debtStart[consumerId] = {
                    "ConsumerName": consumer.Name,
                    "Debt": debt,
                    "Created": created
                }
        
         # All Payment Record from begin to the start date
        paymentStartData = {}
        for iter, payment in enumerate(payment_start):
            paymentStartData[f"{iter+1}"] = model_to_dict(payment)

        for iter, payment in enumerate(payment_start):
            paymentDict = model_to_dict(payment)
            consumerId = paymentDict["ConsumerId"]
            debt = paymentDict["Value"]
            created = paymentDict["Created"]

            try:
                consumer = Consumer.objects.get(pk=consumerId)
            except Consumer.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG0004
                    }, status=status.HTTP_400_BAD_REQUEST
                )
            
            if consumerId in debtStart:
                debtStart[consumerId]["Debt"] -= debt
            else:
                debtStart[consumerId] = {
                    "ConsumerName": consumer.Name,
                    "Debt": debt,
                    "Created": created
                }
            
        # All Order Record from start to the end date
        orderEndData = {}
        for iter, order in enumerate(order_end):
            orderEndData[f"{iter+1}"] = model_to_dict(order)
        
        debtOrderNow ={}
        for iter, order in enumerate(order_end):
            orderDict = model_to_dict(order)
            consumerId = orderDict["ConsumerId"]
            debt = orderDict["RemainingValue"]
            created = orderDict["Created"]
        
            try:
                consumer = Consumer.objects.get(pk=consumerId)
            except Consumer.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG0004
                    }, status=status.HTTP_400_BAD_REQUEST
                )
            
            if consumerId in debtOrderNow:
                debtOrderNow[consumerId]["Debt"] += debt
            else:
                debtOrderNow[consumerId] = {
                    "ConsumerName": consumer.Name,
                    "Debt": debt,
                    "Created": created
                }

        # All Payment Record from start to the end date
        paymentEndData = {}
        for iter, payment in enumerate(payment_end):
            paymentEndData[f"{iter+1}"] = model_to_dict(payment)

        debtPaymentNow = {}
        for iter, payment in enumerate(payment_end):
            paymentDict = model_to_dict(payment)
            consumerId = paymentDict["ConsumerId"]
            debt = paymentDict["Value"]
            created = paymentDict["Created"]

            try:
                consumer = Consumer.objects.get(pk=consumerId)
            except Consumer.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG0004
                    }, status=status.HTTP_400_BAD_REQUEST
                )
            
            if consumerId in debtPaymentNow:
                debtPaymentNow[consumerId]["Debt"] -= debt
            else:
                debtPaymentNow[consumerId] = {
                    "ConsumerName": consumer.Name,
                    "Debt": -debt,
                    "Created": created
                }

        # Total debt difference between the begin-start and start-end book storage
        debtEnd = copy.deepcopy(debtStart)
        
        for consumerId, orderData in debtOrderNow.items():
            if consumerId in debtEnd:
                debtEnd[consumerId]["Debt"] += orderData["Debt"]
            else:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1008
                    }
                )

        for consumerId, paymentData in debtPaymentNow.items():
            if consumerId in debtEnd:
                debtEnd[consumerId]["Debt"] += paymentData["Debt"]
            else:
                return Response(
                    {
                        "success": False,
                        "message": ConsumerMessage.MSG1009
                    }
                )

        data = {
            "Start": startDate,
            "End": endDate,
            "DebtStart": debtStart,
            "OrderNow": debtOrderNow,
            "PaymentNow": debtPaymentNow,
            "DebtEnd": debtEnd

        }
        return Response({
                "success": True,
                "message": ConsumerMessage.MSG0001,
                "data": data
            }, status=status.HTTP_200_OK)

        
        