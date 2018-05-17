const bookmarkslist = (function () {
    function generateBookmarkElement(bookmark){
        if (bookmark.expanded){
            if (bookmarks.editBookmarkId === bookmark.id) {
                return `
                <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
                <div>
                    <input type="text" class="js-bookmark-title-entry" value="${bookmark.title}">
                </div>
                <div>
                    <label>URL</label>
                    <input type="text" class="js-bookmark-url-entry" value="${bookmark.url}">
                    <button type="submit" id="js-edit-bookmark-done">Done</button>
                    <button type="submit" id="js-edit-bookmark-discard">Discard</button>
                </div>
                <div>
                    <label for="">Description</label>
                    <input type="text" class="js-bookmark-desc-entry" value="${bookmark.description}">
                </div>
                </li>
                `
            } 
            else {
                return `
                <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
                <div>
                    <span class="js-bookmark-title-span">
                    ${bookmark.title}
                    <input type="button" class="bookmark-expand js-bookmark-expand" value="&lsaquo;">
                    </span>

                </div>
                <div>
                    <label>URL</label>
                    <span class="js-bookmark-url-span">${bookmark.url}</span>
                    <button type="submit" class="js-bookmark-edit">Edit</button>
                    <button type="submit" class="js-bookmark-delete">Delete</button>
                </div>
                <div>
                    <label for="">Description</label>
                    <p class="js-bookmark-desc-entry">${bookmark.description}</p>
                </div>
                </li>
                `
            }
        
        }
        else {
        return `
        <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
            <div>
                <span class="js-bookmark-title-span">
                <a class="title-link" href="${bookmark.url}">${bookmark.title}</a>
                <input type="button" class="bookmark-expand js-bookmark-expand" value="&lsaquo;">
                </span>
            </div>
        </li>
        `
        }
        
    }

    function render() {
        let items = bookmarks.bookmarkItems;

        if (bookmarks.minRating > 1) {
            items = items.filter(item => item.rating >= bookmarks.minRating);
        }
        
        const bookmarkItemsString = items.map(item => generateBookmarkElement(item)).join('');
        console.log(bookmarkItemsString);
        // insert that HTML into the DOM
        $('#js-bookmark-list').html(bookmarkItemsString);
    }

    function handleAddBookmarkButton() {
        $('#js-add-button').click(function(){
            api.createBookmark('title','http://','', 1, newBookmark => {
                newBookmark.expanded = true;
                bookmarks.addBookmark(newBookmark);
                bookmarks.editBookmarkId = newBookmark.id;
                render();
            });
        });
    }

    function getItemIdFromElement(item) {
        return $(item)
          .closest('.js-bookmark-element')
          .data('bookmark-id');
    }

    function handleBookmarkExpand() {
        $('#js-bookmark-list').on('click', 'input', function(event) {
            console.log($(event.currentTarget).val());
            const id = getItemIdFromElement(event.currentTarget);
            const bookmark = bookmarks.bookmarkItems.find(item => item.id === id);
            bookmark.expanded = !bookmark.expanded;
            render();
        })
    }

    function bindEventListeners() {
        handleAddBookmarkButton();
        handleBookmarkExpand();
    }

    return {
        render,
        bindEventListeners,
    }

}());