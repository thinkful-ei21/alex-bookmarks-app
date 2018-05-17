$(document).ready(function() {
    bookmarkslist.bindEventListeners();
    api.getBookmarks((items) => {
      items.forEach((item) => bookmarks.addBookmark(item));
      console.log(items);
      bookmarkslist.render();
    })
}());