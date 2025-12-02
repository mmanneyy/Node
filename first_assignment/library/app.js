const Book = require("./models/Book");
const Member = require("./models/Member");
const library = require("./services/libraryService");

const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald");
const book2 = new Book("Nineteen Eighty Four", "George Orwell");
library.addBook(book1);
library.addBook(book2);
const member1 = new Member("Alice", 1);
const member2 = new Member("Bob", 2);
library.addMember(member1);
library.addMember(member2);
library.borrow("The Great Gatsby", 1);
library.borrow("Nineteen Eighty Four", 2);
console.log(library.findMember(member2));
console.log(member1);
library.returnBook("The Great Gatsby", 1);
console.log(member1);
