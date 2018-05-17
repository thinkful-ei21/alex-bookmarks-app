const bookmarks = (function () {

    const addBookmark = function(item) {
        this.bookmarkItems.push(item);
    };

    return {
        bookmarkItems: [],
        editBookmarkId: "",
        minRating: 1, 
        addBookmark,
    }
}()); 