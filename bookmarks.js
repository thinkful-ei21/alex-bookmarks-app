//this bookmarks iefy function acts as the 'store' object defined in the wireframing
//
//bookmarkItems is the array of bookmark objects
//
//editBookmarkId determines if the edit state is enabled and which bookmark is being edited
//
//editNewBookmark determines if an existing or new bookmark is being edited
//
//minRating filters which bookmarks are rendered by rating. is set to 1 at start of app
//
//inputError determines if an error message should be rendered
//
//bookmarks-list.js contains the bulk of the app functions
// 
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
        inputError: false,
    }
}()); 