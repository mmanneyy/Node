class Book {
    constructor(title, author, isBorrowed) {
        this.title = title;
        this.author = author;
        this.isBorrowed = false;
    }

    borrow() {
        if(this.isBorrowed) {
            console.log(`${this.title} is not available at the moment`);
            return false;
        }
        this.isBorrowed = true;
        return true;
    }

    returnBook() {
        if(!this.isBorrowed) {
            console.log(`${this.title} is not borrowed`);
            return false;
        }
        this.isBorrowed = false;
        return true;
    }
}

module.exports = Book; 