const api = (function () {
    const BASE_URL = ' https://thinkful-list-api.herokuapp.com/alex/bookmarks';

    const getBookmarks = function (callback) {
        $.getJSON(BASE_URL,callback);
    }

    const createBookmark = function (title, url, description, rating, callback){
        const newItem = JSON.stringify({title,url,description,rating, expanded: false});
        $.ajax({
          url: BASE_URL,
          method: 'POST',
          contentType: 'application/json',
          data: newItem,
          success: callback,
        })
    };

    const updateBookmark = function(id, updateData, callback){
        const newData = JSON.stringify(updateData);
        $.ajax({
          url: BASE_URL + id,
          method: 'PATCH',
          contentType: 'application/json',
          data: newData,
          success:callback,
    
        })
      };

    return {
        getBookmarks,
        createBookmark,
        updateBookmark,
    };
}());