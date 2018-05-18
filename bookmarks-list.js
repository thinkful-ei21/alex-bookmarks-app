const bookmarkslist = (function () {
    //generates html for state of each bookmark
    function generateBookmarkElement(bookmark){
        if (bookmark.desc === 'empty'){bookmark.desc = ''}
        //expanded bookmark
        if (bookmark.expanded){
            //expanded and being edited
            if (bookmarks.editBookmarkId === bookmark.id) {
                $("#js-add-button").attr("disabled", true);
                $("#js-min-rating-select").attr("disabled", true);
                return `
                <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
                <form class="edit-form">
                ${generateErrorMessage()}
                <div>
                    <input type="text" class="js-bookmark-title-entry" value="${bookmark.title}">
                    ${generateSelectElement(bookmark.rating)}
                </div>
                <div>
                    <label>URL: </label>
                    <input type="text" class="js-bookmark-url-entry" value="${bookmark.url}">
                    <button type="submit" class="js-bookmark-done">Done</button>
                    <button type="submit" class="js-bookmark-discard">Discard</button>
                </div>
                <div class="desc-div">
                    <label for="" class="desc-label">Description:</label>
                    <textarea class="js-bookmark-desc-entry bookmark-desc-box desc-input">${bookmark.desc}</textarea>
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
                    <input type="button" class="bookmark-expand js-bookmark-expand" value="&#x25BC;" title="Collapse bookmark">
                    <label class="rating-stars">${generateRatingStars(bookmark.rating)}</label>
                    </span>

                </div>
                <div>
                    <label>URL: </label>
                    <span class="js-bookmark-url-span"><a class="url-link" href="${bookmark.url}">${bookmark.url}</a></span>
                    <button type="submit" class="js-bookmark-edit">Edit</button>
                    <button type="submit" class="js-bookmark-delete">Delete</button>
                </div>
                <div>
                    <label for="" class="desc-label">Description:</label>
                    <p class="js-bookmark-desc-entry bookmark-desc-box">${bookmark.desc}</p>
                </div>
                </li>
                `
            }
        
        }
        //collapsed bookmark
        else {
        return `
        <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
            <div>
                <span class="js-bookmark-title-span">
                <a class="title-link" href="${bookmark.url}">${bookmark.title}</a>
                <input type="button" class="bookmark-expand js-bookmark-expand" value="&#x25C4;" title="Expand bookmark.">
                <label class="rating-stars">${generateRatingStars(bookmark.rating)}</label>
                </span>
            </div>
        </li>
        `
        }
        
    }
    //function that renders all dynamic content
    //is called after almost every app action
    function render() {
        let items = bookmarks.bookmarkItems;
        //filter bookmark list if min rating above 1
        if (bookmarks.minRating > 1) {
            items = items.filter(item => {
                if(item.rating >= bookmarks.minRating) { 
                    return item;
                }
                else {
                    item.expanded = false;
                }
            });
        }
        //generate long single html string
        const bookmarkItemsString = items.map(item => generateBookmarkElement(item)).join('');
        
        // insert that HTML into the DOM
        $('#js-bookmark-list').html(bookmarkItemsString);
    }
    //generates the correct starting option for particular bookmark in the select element
    function generateSelectElement(rating){
        let selectElementString = '';
        selectElementString += `<select class="js-bookmark-rating-select">`;
        for (let x = 1; x <= 5; x++) {
            if (rating == x) {
                selectElementString += `<option value="${x}" selected="selected">${x} Star</option>`;
            }
            else {
                selectElementString += `<option value="${x}">${x} Star</option>`;
            }
        }
        selectElementString += `</select>`;
        return selectElementString;
    }

    //generates star graphic to correspond with bookmark rating
    function generateRatingStars (rating) {
        let starRatingString = '';
        for (let x = 1; x <= 5; x++) {
            if (x <= rating) {
                starRatingString += '&#x2605;'
            }
            else {
                starRatingString += '&#x2606;'
            }
        }
        return starRatingString;
    }
    //generates error message is title or url fields left empty
    function generateErrorMessage () {
        if (bookmarks.inputError) {
            return `<label class="error-box">Title and URL fields cannot be left empty</label>`;
        }
        return '';
    }

    //handles add bookmark button events
    function handleAddBookmarkButton() {
        $('#js-add-button').click(function(){
            api.createBookmark('title','http://','', 5, newBookmark => {
                newBookmark.expanded = true;
                bookmarks.addBookmark(newBookmark);
                bookmarks.editBookmarkId = newBookmark.id;
                bookmarks.editNewBookmark = true;
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
            event.preventDefault();
            bookmarks.inputError = false;
            //if bookmark is new discard deletes bookmark
            if (bookmarks.editNewBookmark){
                const id = getItemIdFromElement(event.currentTarget);
                console.log(id);
                api.deleteBookmark(id, callback => {
                    bookmarks.deleteBookmark(id);
                    bookmarks.editBookmarkId = '';
                    bookmarks.editNewBookmark = false;
                    render();
                    $("#js-add-button").removeAttr("disabled");
                    $("#js-min-rating-select").removeAttr("disabled");
                })
            }
            else {
                bookmarks.editBookmarkId = '';
                render();
                $("#js-add-button").removeAttr("disabled");
                $("#js-min-rating-select").removeAttr("disabled");
            }
        })
    }
    //handles click event from edit button in expanded bookmark item
    function handleBookmarkEdit() {
        $('#js-bookmark-list').on('click', '.js-bookmark-edit', function(event) {
            if (bookmarks.editNewBookmark){bookmarks.editNewBookmark = false}
            const id = getItemIdFromElement(event.currentTarget);
            bookmarks.editBookmarkId = id;
            bookmarks.inputError = false;
            render();
        })
    }
    //handles click event from done button in expanded bookmark item
    function handleBookmarkDone() {
        $('#js-bookmark-list').on('click', '.js-bookmark-done', function(event) {
            event.preventDefault();
            const id = getItemIdFromElement(event.currentTarget);
            const item = $(event.currentTarget).closest('form');
            //displays error message if title or url fields empty
            if ($(item).find('.js-bookmark-title-entry').val() === '' || $(item).find('.js-bookmark-url-entry').val()===''){
                bookmarks.inputError = true;
                render();
                return;
            }
            const updatedBookmark = {
                title: $(item).find('.js-bookmark-title-entry').val(),
                url: $(item).find('.js-bookmark-url-entry').val(),
                desc: $(item).find('.js-bookmark-desc-entry').val(),
                rating: $(item).find('.js-bookmark-rating-select').val(),
            }

            if (updatedBookmark.desc === ''){updatedBookmark.desc = 'empty'}
            //updates api data and local bookmarks array with updated bookmark
            api.updateBookmark(id, updatedBookmark, updateBookmarkItem => {
                Object.assign(bookmarks.bookmarkItems.find(item => item.id === id), updatedBookmark);
                bookmarks.inputError = false;
                render();
            });

            bookmarks.editBookmarkId = '';
            bookmarks.editNewBookmark = false;
            $("#js-add-button").removeAttr("disabled");
            $("#js-min-rating-select").removeAttr("disabled");
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
    //binds all event listeners
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