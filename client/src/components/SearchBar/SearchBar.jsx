import {Fragment, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getBooksItems} from "../../store/BooksSlice.jsx";
import {getOpenBooksItems} from "../../store/OpenBooksSlice";
import {ListItemDecorator, Stack} from "@mui/joy";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search.js";
import {useNavigate} from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import {ClickAwayListener} from '@mui/base/ClickAwayListener';
import axios from "axios";
import {BACKEND_URL} from "../../../config/env.jsx";
import SingleBookItemDrawer from "../drawers/SingleBookItemDrawer.jsx";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";

export const SearchBar = () => {
    const [book, setBook] = useState({});
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isBoxVisible, setIsBoxVisible] = useState(false);

    const currentBooks = useSelector(state => state.openBooks);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = async () => {
        console.log(searchTerm)
        const booksParameters = {
            searchQuery: searchTerm,
            filterOptions: "ebooks",
            startIndex: 0,
        };
        dispatch(getBooksItems(booksParameters));
        navigate("/books");
    }

    const handleKeyPress = (e) => {
        // Check if the Enter key is pressed (key code 13)
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setIsBoxVisible(newSearchTerm.length > 0);
        // You can add debounce logic here if needed
        const booksParameters = {
            searchQuery: searchTerm,
            filterOptions: "ebooks",
            startIndex: 0,
        };
        dispatch(getOpenBooksItems(booksParameters));

        // debounce(() => dispatch(getBooksItems(booksParameters)), 300);
        // or use a library like lodash to debounce
    };

    const inputRef = useRef(null);

    const handleClickAway = () => {
        setIsBoxVisible(false);
    }
    const showBookItemFromSearch = async (id) => {
        console.log("showBookItemFromSearch id:", id);
        try {
            const response = await axios.get(BACKEND_URL + `/api/v1/secure/book/${id}`);
            console.log(response.data);
            if (response.data) {
                setOpen(true);
                setBook(response.data);
            }
        } catch (error) {
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "danger",
                notificationMessage: "Could Not Find the Book!"
            }));
        }
    }

    const toggleDrawer = (inOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(inOpen);
    };
    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center" spacing={1.5}
                       sx={{
                           width: "200px"
                       }}>

                    <Input ref={inputRef}
                           autoComplete='off'
                           type={"text"}
                           sx={{width: {xs: "130px", sm: "200px", md: "300px"}, height: 40, borderRadius: 12}}
                           placeholder="Search A Book"
                           color="primary"
                           value={searchTerm}
                           onChange={(e) => handleInputChange(e)}

                           onKeyDown={handleKeyPress} // Call handleKeyPress when a key is pressed
                           endDecorator={
                               <Fragment>
                                   <IconButton
                                       variant="soft"
                                       sx={{
                                           width: 30,
                                           height: 30,
                                           borderRadius: 10,
                                       }}
                                       onClick={handleSearch}
                                   >
                                       <SearchIcon/>
                                   </IconButton>
                               </Fragment>
                           }
                    />
                    {isBoxVisible === true ? <Sheet color={"primary"} variant="soft" sx={{
                        position: "fixed",
                        top: "60px", // Adjust this value as needed for the desired position
                        zIndex: 1, // Make sure the box appears above other elements
                        width: "auto",
                        height: "50%",
                        borderRadius: 12,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflowY: 'scroll',
                        paddingTop: "50px",
                    }}> <List
                        component="nav"
                        sx={{
                            maxWidth: 500,
                            overflowY: 'hidden',
                        }}
                    >
                        {currentBooks?.books?.map((book) => (
                            <ListItemButton key={book.id} onClick={() => showBookItemFromSearch(book.id)}>
                                <ListItemDecorator>
                                    <img
                                        src={book.volumeInfo?.imageLinks?.thumbnail ?? ""}
                                        alt={""} style={{
                                        width: "auto",
                                        height: "40px"
                                    }}/>
                                </ListItemDecorator>
                                <Stack>
                                    <Typography level={"title-sm"}>
                                        {book.volumeInfo.title}
                                    </Typography>
                                    <Typography level={"body-sm"}>
                                        {book.volumeInfo.authors}
                                    </Typography>
                                </Stack>

                            </ListItemButton>
                        ))}

                    </List>

                    </Sheet> : <></>}

                </Stack>
            </ClickAwayListener>
            <SingleBookItemDrawer book={book} open={open} toggleDrawer={toggleDrawer}/>
        </>

    )
}