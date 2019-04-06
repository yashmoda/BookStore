from django.contrib import admin

# Register your models here.
from books.models import BooksData, KeysData

admin.site.register(BooksData)
admin.site.register(KeysData)
