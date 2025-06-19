from rest_framework import serializers

class CodeExecutionSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    language = serializers.CharField(default='python')
    input_data = serializers.CharField(required=False, allow_blank=True) 