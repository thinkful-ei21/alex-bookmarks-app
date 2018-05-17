const bookmarkslist = (function () {
    function generateBookmarkElement(bookmark){
        if (bookmark.desc === 'empty'){bookmark.desc = ''}
        if (bookmark.expanded){
            if (bookmarks.editBookmarkId === bookmark.id) {
                return `
                <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
                <form>
                <div>
                    <input type="text" class="js-bookmark-title-entry" value="${bookmark.title}">
                </div>
                <div>
                    <label>URL</label>
                    <input type="text" class="js-bookmark-url-entry" value="${bookmark.url}">
                    <button type="submit" class="js-bookmark-done">Done</button>
                    <button type="submit" class="js-bookmark-discard">Discard</button>
                </div>
                <div>
                    <label for="">Description</label>
                    <input type="text" class="js-bookmark-desc-entry" value="${bookmark.desc}">
                </div>
                </form>
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
                    <p class="js-bookmark-desc-entry">${bookmark.desc}</p>
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
        //console.log(bookmarkItemsString);
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
        $('#js-bookmark-list').on('click', '.js-bookmark-expand', function(event) {
            //console.log($(event.currentTarget).val());
            const id = getItemIdFromElement(event.currentTarget);
            const bookmark = bookmarks.bookmarkItems.find(item => item.id === id);
            bookmark.expanded = !bookmark.expanded;
            render();
        })
    }
    //handles click event from discard button in expanded bookmark item
    function handleBookmarkDiscard() {
        $('#js-bookmark-list').on('click', '.js-bookmark-discard', function(event) {
            //console.log($(event.currentTarget).val());
            bookmarks.editBookmarkId = '';
            render();
        })
    }
    //handles click event from edit button in expanded bookmark item
    function handleBookmarkEdit() {
        $('#js-bookmark-list').on('click', '.js-bookmark-edit', function(event) {
            //console.log($(event.currentTarget).val());
            const id = getItemIdFromElement(event.currentTarget);
            bookmarks.editBookmarkId = id;
            render();
        })
    }
    //handles click event from done button in expanded bookmark item
    function handleBookmarkDone() {
        $('#js-bookmark-list').on('click', '.js-bookmark-done', function(event) {
            event.preventDefault();
            const id = getItemIdFromElement(event.currentTarget);
            const item = $(event.currentTarget).closest('form');
            const updatedBookmark = {
                title: $(item).find('.js-bookmark-title-entry').val(),
                url: $(item).find('.js-bookmark-url-entry').val(),
                desc: $(item).find('.js-bookmark-desc-entry').val(),
                rating: 1,
            }
            if (updatedBookmark.desc === ''){updatedBookmark.desc = 'empty'}
            
            api.updateBookmark(id, updatedBookmark, updateBookmarkItem => {
                Object.assign(bookmarks.bookmarkItems.find(item => item.id === id), updatedBookmark);
                console.log(bookmarks.bookmarkItems.find(item => item.id === id));
                render();
            });
            bookmarks.editBookmarkId = '';
        })
    }

    function bindEventListeners() {
        handleAddBookmarkButton();
        handleBookmarkExpand();
        handleBookmarkEdit();
        handleBookmarkDiscard();
        handleBookmarkDone();
    }

    return {
        render,
        bindEventListeners,
    }

}());