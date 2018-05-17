const bookmarks = (function () {

    const addBookmark = function(item) {
        this.bookmarkItems.unshift(item);
    };

    return {
        bookmarkItems: [],
        editBookmarkId: "",
        minRating: 1, 
        addBookmark,
    }
}()); 