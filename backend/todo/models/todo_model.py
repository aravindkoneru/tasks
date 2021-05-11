from django.db import models
from django.utils import timezone

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    edited_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

