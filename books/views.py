import requests
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from books.models import BooksData, KeysData


def show_home(request):
    return render(request, 'home.html')


def show_books(request):
    response_json = {'books_list': []}
    if request.method == 'GET':
        book_name = request.GET.get('book_name', '')
        try:
            books_list = BooksData.objects.filter(name__icontains=book_name)
        except Exception as e:
            books_list = BooksData.objects.all()
        for books in books_list:
            temp_json = {'id': books.id,
                         'book_id': books.book_id,
                         'name': books.name,
                         'inventory_count': books.inventory_count}
            response_json['books_list'].append(temp_json)
        response_json['success'] = True
        response_json['message'] = "The books have been displayed successfully."
    return JsonResponse(response_json)


@csrf_exempt
def update_book(request):
    response_json = {}
    if request.method == 'GET':
        book_id = request.GET.get('book_id')
        try:
            book_instance = BooksData.objects.get(book_id=book_id)
        except Exception as e:
            response_json['success'] = False
            response_json['message'] = "Please try again."
            return JsonResponse(response_json)
        response_json['id'] = book_instance.id
        response_json['book_id'] = book_instance.book_id
        response_json['name'] = book_instance.name
        response_json['inventory_count'] = book_instance.inventory_count
        response_json['success'] = True
        response_json['message'] = "The deatils have been shown."
        return JsonResponse(response_json)
    elif request.method == 'POST':
        book_id = request.POST.get('book_id')
        inventory_count = request.POST.get('inventory_count')
        try:
            book_instance = BooksData.objects.get(book_id=book_id)
            book_instance.inventory_count = inventory_count
            book_instance.save()
            response_json['success'] = True
            response_json['message'] = "Data has been upated."
            return JsonResponse(response_json)
        except Exception as e:
            response_json['success'] = False
            response_json['message'] = "Data could not be updated. Please try again later."
            return JsonResponse(response_json)


def delete_book(request):
    response_json = {}
    if request.method == 'GET':
        book_id = request.GET.get('book_id')
        try:
            book_instance = BooksData.objects.get(book_id=book_id)
            book_instance.delete()
            print(book_instance.name)
            response_json['success'] = True
            response_json['message'] = "The book has been deleted."
            return JsonResponse(response_json)
        except Exception as e:
            response_json['success'] = False
            response_json['message'] = "The book could not be deleted."
            return JsonResponse(response_json)


def search_book(request):
    json_response = {'books_list': []}
    if request.method == 'GET':
        search_keyword = request.GET.get('search_keyword')
        try:
            api_key = KeysData.objects.get(key='API_KEY').value
            request_url = 'https://www.googleapis.com/books/v1/volumes?q='
            request_url += search_keyword
            request_url += '&key=' + api_key
            response_json = requests.get(request_url).json()
            for i in response_json['items']:
                try:
                    inventory_count = BooksData.objects.get(book_id=i["id"]).inventory_count
                except Exception as e:
                    inventory_count = -1
                temp_json = {'book_id': i["id"],
                             "name": i["volumeInfo"]["title"],
                             "inventory_count": inventory_count,
                             "authors": i["volumeInfo"]["authors"]}
                json_response['books_list'].append(temp_json)
            json_response['success'] = True
            json_response['message'] = "The book list is as follows."
        except Exception as e:
            print(str(e))
            json_response['success'] = False
            json_response['message'] = "Please try again later."
            return JsonResponse(json_response)
        return JsonResponse(json_response)


@csrf_exempt
def add_book(request):
    response_json = {}
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        name = request.POST.get('name')
        inventory_count = request.POST.get('inventory_count')
        try:
            book_instance = BooksData.objects.create(book_id=book_id, name=name,
                                                     inventory_count=inventory_count)
            response_json['success'] = True
            response_json['message'] = "The book has been added to inventory."
            return JsonResponse(response_json)
        except Exception as e:
            response_json['success'] = False
            response_json['message'] = "The book could not be added."
            return JsonResponse(response_json)
