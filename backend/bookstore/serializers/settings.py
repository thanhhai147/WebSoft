from rest_framework import serializers

class SettingSerializer(serializers.Serializer):
    ParameterName = serializers.CharField(required=True, allow_null=False)
    Value = serializers.CharField(required=True, allow_null=False)
    Active = serializers.BooleanField(required=True, allow_null=False)