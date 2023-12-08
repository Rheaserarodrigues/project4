import {DialogTitle, Divider, Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addBookToBookList, getBookLists} from "../../store/BookListSlice.jsx";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";


const BookLists = ({showBookList, setShowBookList, setShowCreateBookList,bookSelected}) => {

    const dispatch = useDispatch();
    const bookLists = useSelector(state => state.bookList);
    const userDataState = useSelector((state) => state.user);

    // console.log(bookLists)

    useEffect(() => {
        // console.log("userDataState:", userDataState);
        dispatch(getBookLists(userDataState.user.id));
    }, [userDataState])

    // console.log("bookLists:", bookLists);

    function addBookToList(id) {
        // console.log("BookLists id:", id);
        // console.log("BookLists bookSelected:", bookSelected);
        const bookListData = {
            bookListId: id,
            bookData: bookSelected,
        }

        dispatch(addBookToBookList(bookListData)).then((result) => {
            console.log(result)
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "success",
                notificationMessage: "Book Added to Book List!"
            }));
            setShowBookList(false);
        });

    }

    return (
        <Modal open={showBookList} onClose={() => setShowBookList(false)}>
            <ModalDialog variant={"soft"} color={"primary"} invertedColors>
                <ModalClose/>
                <DialogTitle>Book Lists</DialogTitle>
                <Box sx={{
                    width: "400px",
                    height: "300px",
                    pt: 2,
                }}>
                    <Stack direction="column"
                           justifyContent="center"
                           alignItems="stretch">
                        <Box sx={{
                            width: "400px",
                            height: "200px",
                            pt: 2,
                            overflowY: "scroll",
                            mb: 2,
                        }}>

                            <List
                                size="md"
                                sx={{
                                    mt: 'auto',
                                    flexGrow: 0,
                                    '--ListItem-radius': (theme) => theme.vars.radius.sm,
                                    '--List-gap': '8px',
                                    mb: 2,
                                    height: "50px"
                                }}
                            >
                                {
                                    bookLists.bookLists.map((bookList) => {
                                        return <ListItem key={bookList._id}>
                                            <ListItemButton onClick={()=>addBookToList(bookList._id)}>

                                                <ListItemContent>
                                                    <Typography level="title-sm">{bookList.bookListName}</Typography>
                                                </ListItemContent>
                                            </ListItemButton>
                                        </ListItem>
                                    })
                                }


                            </List>

                        </Box>
                        <Divider orientation="horizontal"/>
                        <Stack direction="row"
                               justifyContent="center"
                               alignItems="center"
                               sx={{
                                   m: 2
                               }}>
                            <Button variant={"soft"} color={"primary"} onClick={() => setShowCreateBookList(true)}>Create
                                A Book List</Button>
                        </Stack>
                    </Stack>

                </Box>
            </ModalDialog>
        </Modal>
    );
}

export default BookLists;