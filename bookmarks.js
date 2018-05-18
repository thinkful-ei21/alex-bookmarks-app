const bookmarks = (function () {

    const addBookmark = function(item) {
        this.bookmarkItems.unshift(item);
    };

    const deleteBookmark = function(id){
        this.bookmarkItems = this.bookmarkItems.filter(item => item.id !== id);
    }

    return {
        bookmarkItems: [],
        editBookmarkId: "",
        editNewBookmark: false,
        minRating: 1, 
        addBookmark,
        deleteBookmark,
    }
}()); 