from django.db import models

# Create your models here.


class BooksData(models.Model):
    book_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    inventory_count = models.IntegerField()

    def __str__(self):
        return str(self.name)


class KeysData(models.Model):
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

