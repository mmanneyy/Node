class Member {
    constructor(name, memberId) {
        this.name = name;
        this.memberId = memberId;
        this.borrowedBooks = [];
    }

    borrowBook(book) {
        this.borrowedBooks.push(book);
    }

    returnBook(book) {
        for(let i of this.borrowedBooks) {
            if(i.title === book.title) {
                if(i !== this.borrowedBooks[this.borrowedBooks.length - 1]) {
                    [i, this.borrowedBooks[this.borrowedBooks.length - 1]] = 
                    [this.borrowedBooks[this.borrowedBooks.length - 1], i];
                    this.borrowedBooks.pop();
                }
            }
        }
    }
}

module.exports = Member;