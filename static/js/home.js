function get_all_books()
{
    var temp = "";
        $.ajax({
        url: '/api/books/',
        type: "GET",
        dataType: 'json',
        success: function (data) {
            var length = data.books_list.length;
            for(j=0; j<length; j++)
            {
                temp+= '<div class="col s12 m6 l4">';
                temp+= '<div class="card">';
                temp += '<div class="card-content center">';
                temp += '<span class="card-title"><h4>';
                temp += data.books_list[j].name;
                temp += '</h4></span>';
                if(data.books_list[j].inventory_count > 0)
                {
                    temp += '<p style="color: green;">In Stock</p>';
                }
                else
                {
                    temp += '<p style="color: red">Out of Stock</p>';
                }
                temp += '</div>';
                temp += '<div class="card-action">';
                temp += '<a class="waves-effect waves-light btn" style="float: left" onclick="open_edit_modal(' + '\'' + data.books_list[j].book_id + '\'' + ')">Update</a>';
                temp += '<a class="waves-effect waves-light btn red" style="float:right;" onclick="open_delete_modal(' + '\'' + data.books_list[j].book_id + '\'' + ')">Remove</a>';
                temp += '</div>';
                temp += '</div>';
                temp += '</div>';
            }
            $("#books_data").html(temp);
        },
        error: function () {
            alert("Please try again.");

        },
    });
}
$(document).ready(function () {
    $('.modal').modal();
    get_all_books();
});

function open_edit_modal(book_id) {
    $.ajax({
        type: "GET",
        data: {'book_id': book_id},
        url: '/api/update/',
        success: function (data) {
            $("#book_id").val(data.book_id);
            $("#book_name").val(data.name);
            $("#book_count").val(data.inventory_count);
            $("#edit_modal").modal('open');
        },
    });
}

function confirm_edit() {
    $.ajax({
        type: "POST",
        data: {'book_id': $("#book_id").val(), 'inventory_count': $("#book_count").val()},
        url: "/api/update/",
        success: function (data) {
            M.toast({html: data.message, classes: 'rounded'});
            get_all_books();
        }
    });
}

function open_delete_modal(book_id) {
    $("#book_id_del").val(book_id);
    $("#delete_modal").modal('open');
}

function confirm_delete() {
    $.ajax({
        type: "GET",
        data: {"book_id": $("#book_id_del").val()},
        url: '/api/delete/',
        success: function (data) {
            M.toast({html: data.message, classes: 'rounded'});
            get_all_books();
        }
    });
}

function search_book() {
    var keyword = $("#search").val();
    var temp = "";
    if(keyword.trim().length == 0)
    {
        alert("Search query is empty.");
    }
    else {
        $.ajax({
            type: "GET",
            data: {"search_keyword": $("#search").val()},
            url: "/api/search/",
            success: function (data) {
                if(data.success == true) {
                    var len = data.books_list.length;
                    for (j = 0; j < len; j++) {
                        var add_action = '<a class="waves-effect waves-light btn" style="float: left" onclick="open_edit_modal(' + '\'' + data.books_list[j].book_id + '\'' + ')">Update</a>';
                        var flag=0;
                        temp += '<div class="col s12 m6 l4">';
                        temp += '<div class="card" style="height: 300px">';
                        temp += '<div class="card-content center" style="overflow: auto">';
                        temp += '<span class="card-title"><h4>';
                        temp += data.books_list[j].name;
                        temp += '</h4></span>';
                        for(i=0; i<data.books_list[j].authors.length; i++)
                        {
                            temp += '<h6>' + data.books_list[j].authors[i] + '</h6>';
                        }
                        if (data.books_list[j].inventory_count > 0) {
                            temp += '<p style="color: green;">In Stock</p>';
                        } else if (data.books_list[j].inventory_count == 0) {
                            temp += '<p style="color: red">Out of Stock</p>';
                        }
                        else
                        {
                            temp += '<p style="color: gray">Not in Inventory</p>';
                            add_action = '<a class="waves-effect waves-light btn green" style="float: left;"' +
                                ' onclick="open_add_modal(' + '\'' + data.books_list[j].book_id + '\'' + '\,' +'\'' +
                                data.books_list[j].name + '\'' + ')">Add</a>';
                        }
                        temp += '</div>';
                        temp += '<div class="card-action">';
                        temp += add_action;
                        temp += '<a class="waves-effect waves-light btn red" style="float:right;" onclick="open_delete_modal(' + '\'' + data.books_list[j].book_id + '\'' + ')">Remove</a>';
                        temp += '</div>';
                        temp += '</div>';
                        temp += '</div>';
                    }
                    $("#search").val('');
                    $("#books_data").html(temp);
                }
        },
        error: function () {
            alert("Please try again.");

        },
        });
    }
}

function open_add_modal(book_id, name) {
    $("#add_book_id").val(book_id);
    $("#add_book_name").val(name);
    $("#add_modal").modal('open');
}

function confirm_add() {
    $.ajax({
        type: 'POST',
        url: '/api/add/',
        data: {'book_id': $("#add_book_id").val(), 'name': $("#add_book_name").val(), 'inventory_count': $("#add_book_count").val()},
        success: function (data) {
            M.toast({html: data.message, classes: 'rounded'});
            get_all_books();
            $("#add_book_id").val('');
            $("#add_book_name").val('');
            $("#add_book_count").val('');
        }
    });
}