from rest_framework import serializers

class SettingSerializer(serializers.Serializer):
    Value = serializers.CharField(required=True, allow_null=False)
    Active = serializers.BooleanField(required=True, allow_null=False)