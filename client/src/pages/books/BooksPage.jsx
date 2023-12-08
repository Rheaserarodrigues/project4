import {useState, useEffect} from "react";
import BookItem from "../../components/book_item/BookItem.jsx";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/joy/Typography";
import {getBooksItems, getNextPage, getPreviousPage} from "../../store/BooksSlice.jsx";
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CreateBookList from "../../components/modals/CreateBookList.jsx";
import BookLists from "../../components/modals/BookLists.jsx";

export default function BooksPage() {
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.user);
    const currentBooks = useSelector(state => state.books);

    const [showBookList, setShowBookList] = useState(false);
    const [showCreateBookList, setShowCreateBookList] = useState(false);

    const [bookSelected, setBookSelected] = useState({});

    const [favorites, setFavorites] = useState([]); // Array to store favorite books

    const [currentPage, setCurrentPage] = useState(1);


    // console.log("currentBooks:", currentBooks);


    // Function to fetch books on initial page load
    const fetchInitialBooks = () => {
        const booksParameters = {
            searchQuery: "Dogs",
            filterOptions: "ebooks",
            startIndex: 0,
        };
        dispatch(getBooksItems(booksParameters));
    };

    useEffect(() => {
        fetchInitialBooks();
    }, []);

    // Function to fetch next page of books
    const fetchNextPage = () => {
        console.log("books:", currentBooks);
        dispatch(getNextPage({
            searchQuery: currentBooks.searchQuery,
            filterOptions: currentBooks.filterOptions,
            startIndex: (currentBooks.currentPage + 1)
        }));
    };

    // Function to fetch previous page of books
    const fetchPreviousPage = () => {

        dispatch(getPreviousPage({
            searchQuery: currentBooks.searchQuery,
            filterOptions: currentBooks.filterOptions,
            startIndex: (currentBooks.currentPage - 1)
        }));
    };





    const addToBookList = (id,bookName,bookPictures,totalPages,author) => {
        setShowBookList(true);
        setBookSelected({
            bookId: id,
            bookName: bookName,
            bookPicture: bookPictures,
            bookAuthor: author,
            totalPages: totalPages
        })
        console.log("id:",id);
        console.log("bookName:",bookName);
        console.log("bookPictures:",bookPictures);
        console.log("totalPages:",totalPages);


    };

    // console.log(showBookList)


    return (
        <>

            <Box sx={{display: "flex", justifyContent: "space-between", margin: "20px"}}>

                {!currentBooks.loading &&
                    <>
                        <Box style={{
                            display: "flex", justifyContent: "center", flexDirection: "row", flexWrap: "wrap", gap: 50,
                        }}>
                            {currentBooks.books.map((book) => (
                                <BookItem key={book.id} book={book} addToFavorite={addToBookList}
                                          favorite={favorites}/>
                            ))}
                        </Box>

                    </>

                }

            </Box>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px"}}>
                <IconButton disabled={currentBooks.currentPage === 1} onClick={fetchPreviousPage}>
                    <KeyboardArrowLeftRoundedIcon/>
                </IconButton>
                <Typography style={{margin: "0 10px"}}>Page {currentPage}</Typography>
                <IconButton onClick={fetchNextPage}>
                    <KeyboardArrowRightRoundedIcon/>
                </IconButton>
            </Box>
            ?
            <BookLists showBookList={showBookList} setShowBookList={setShowBookList}
                       setShowCreateBookList={setShowCreateBookList} bookSelected={bookSelected}
            />
            {showCreateBookList === true ? <CreateBookList showCreateBookList={showCreateBookList}
                                                           setShowCreateBookList={setShowCreateBookList}/> : <></>}

        </>
    );
}
