from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo
from django.utils.dateparse import parse_datetime

# Create your views here.
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

    def get_queryset(self):
        req = self.request;
        print(req)
        date_str = req.query_params.get("date")
        if date_str:
            self.queryset = Todo.objects.filter(created_at__date=parse_datetime(date_str).date())

        return self.queryset

