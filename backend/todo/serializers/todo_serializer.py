from rest_framework import serializers
from todo.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed', 'created_at', 'edited_at')
        extra_kwargs = {'created_at': {'required': False},
                        'edited_at': {'required': False}}
