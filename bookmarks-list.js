const bookmarkslist = (function () {
    function generateBookmarkElement(bookmark){
        if (bookmark.desc === 'empty'){bookmark.desc = ''}
        if (bookmark.expanded){
            if (bookmarks.editBookmarkId === bookmark.id) {
                $("#js-add-button").attr("disabled", true);
                return `
                <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
                <form>
                <div>
                    <input type="text" class="js-bookmark-title-entry" value="${bookmark.title}">
                    <select class="js-bookmark-rating-select">
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
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
                    <label>${bookmark.rating} star</label>
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
                <label>${bookmark.rating} star</label>
                </span>
            </div>
        </li>
        `
        }
        
    }

    function render() {
        let items = bookmarks.bookmarkItems;
        //filter bookmark list if min rating above 1
        if (bookmarks.minRating > 1) {
            items = items.filter(item => item.rating >= bookmarks.minRating);
        }
        
        const bookmarkItemsString = items.map(item => generateBookmarkElement(item)).join('');
        
        // insert that HTML into the DOM
        $('#js-bookmark-list').html(bookmarkItemsString);
    }

    //handles add bookmark button events
    function handleAddBookmarkButton() {
        $('#js-add-button').click(function(){
            api.createBookmark('title','http://','', 5, newBookmark => {
                newBookmark.expanded = true;
                bookmarks.addBookmark(newBookmark);
                bookmarks.editBookmarkId = newBookmark.id;
                render();
            });
        });
    }

    //gets bookmark id from li element
    function getItemIdFromElement(item) {
        return $(item)
          .closest('.js-bookmark-element')
          .data('bookmark-id');
    }

    //handle click event from expand/collapse bookmark button
    function handleBookmarkExpand() {
        $('#js-bookmark-list').on('click', '.js-bookmark-expand', function(event) {
            const id = getItemIdFromElement(event.currentTarget);
            const bookmark = bookmarks.bookmarkItems.find(item => item.id === id);
            bookmark.expanded = !bookmark.expanded;
            render();
        })
    }
    //handles click event from discard button in expanded bookmark item
    function handleBookmarkDiscard() {
        $('#js-bookmark-list').on('click', '.js-bookmark-discard', function(event) {
            bookmarks.editBookmarkId = '';
            render();
            $("#js-add-button").removeAttr("disabled");
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
                rating: $(item).find('.js-bookmark-rating-select').val(),
            }
            if (updatedBookmark.desc === ''){updatedBookmark.desc = 'empty'}
            
            api.updateBookmark(id, updatedBookmark, updateBookmarkItem => {
                Object.assign(bookmarks.bookmarkItems.find(item => item.id === id), updatedBookmark);
                console.log(bookmarks.bookmarkItems.find(item => item.id === id));
                render();
            });
            bookmarks.editBookmarkId = '';
            $("#js-add-button").removeAttr("disabled");
        })
    }
    //handle click event on delete button in expanded bookmark
    function handleBookmarkDelete() {
        $('#js-bookmark-list').on('click', '.js-bookmark-delete', function(event) {
            const id = getItemIdFromElement(event.currentTarget);
            api.deleteBookmark(id, callback => {
                bookmarks.deleteBookmark(id);
                render();
            })
            bookmarks.editBookmarkId = '';
        })
    }
    //handle change event from bookmark rating select in edit view
    function handleBookmarkRatingSelect() {
        $('#js-min-rating-select').on('change', function(event) {
            const minRat = $(event.currentTarget).val();
            bookmarks.minRating = minRat;
            render();
        })
    }

    function bindEventListeners() {
        handleAddBookmarkButton();
        handleBookmarkExpand();
        handleBookmarkEdit();
        handleBookmarkDiscard();
        handleBookmarkDone();
        handleBookmarkDelete();
        handleBookmarkRatingSelect();
    }

    return {
        render,
        bindEventListeners,
    }

}());