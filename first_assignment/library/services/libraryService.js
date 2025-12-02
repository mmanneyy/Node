const books = [];
const members = [];
function addBook(book) {
    books.push(book);
}


function addMember(member) {
    members.push(member);
}


function findBook(title) {
    return books.find(b => b.title === title);
}


function findMember(id) {
    return members.find(m => m.memberId === id);
}


function borrow (title, memberId) {
    const b = findBook(title);
    const m = findMember(memberId);
    if(!b){
        console.log("Book is not found");
        return;
    }
    if(!m) {
        console.log("Member is not found");
        return;
    }
    if(b.borrow()) {
        m.borrowBook(b);
        console.log(`${m.name} borrowed ${b.title}`);
    }
}


function returnBook(title, memberId) {
    const b = findBook(title);
    const m = findMember(memberId);

    if(!b) {
        console.log("Book is not found");
        return;
    }
    if(!m) {
        console.log("Member is not found");
        return;
    }
    if(b.returnBook()) {
        m.returnBook(b);
        console.log(`${m.name} returned ${b.title}`);
        
    }
}


module.exports = {addBook, addMember, findBook, findMember, borrow, returnBook };