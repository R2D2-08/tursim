from django.shortcuts import render
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeExecutionSerializer

class CodeExecutionView(APIView):
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = requests.post(
                'http://coderunner:5000/execute',
                json=serializer.validated_data,
                timeout=30 
            )
            
            return Response(response.json(), status=response.status_code)
            
        except requests.RequestException as e:
            return Response(
                {'error': f'Failed to execute code: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
