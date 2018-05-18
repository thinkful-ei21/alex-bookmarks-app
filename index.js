//app functionality starts after dom is loaded
$(document).ready(function() {
    bookmarkslist.bindEventListeners();
    api.getBookmarks((items) => {
      items.forEach((item) => bookmarks.addBookmark(item));
      bookmarkslist.render();
    })
}());