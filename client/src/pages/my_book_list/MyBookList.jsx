import Sheet from "@mui/joy/Sheet";
import {
    ButtonGroup,
    DialogTitle,
    Modal,
    ModalClose,
    ModalDialog,
    Stack, Textarea
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {updateBookList, deleteBookFromBookList, deleteBookList} from "../../store/BookListSlice.jsx";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";
import IconButton from "@mui/joy/IconButton";
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

const MyBookList = () => {
    const dispatch = useDispatch();

    const [bookId, setBookId] = useState("");
    const [bookListName, setBookListName] = useState("");
    const [bookListDescription, setBookListDescription] = useState("");
    const [sharingOption, setSharingOption] = useState("private");
    const [bookListNameInputError, setBookListNameInputError] = useState("");


    const submitUpdateBookList = () => {
        if (bookListName === "") {
            setBookListNameInputError("Book List Name cannot be empty");
            return false;
        }

        const bookListData = {
            bookListId: bookId,
            bookListName: bookListName,
            bookListDescription: bookListDescription,
            sharingOption: sharingOption
        }
        // console.log(bookListData);
        dispatch(updateBookList(bookListData)).then((res) => {
            // console.log(res)
            if (res.type === "bookLists/updateBookList/rejected") {
                console.log(res)

                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "danger",
                    notificationMessage: res.payload.response.data.error
                }))
            } else {
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Book List Updated!"
                }));
            }
            // console.log(res);
            // console.log("Book List Created");
            // setShowCreateBookList(false);

        });

    }

    const [open, setOpen] = useState(false);
    // const toggleDrawer = (inOpen) => (event) => {
    //     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //         return;
    //     }
    //
    //     setOpen(inOpen);
    // };
    const bookLists = useSelector(state => state.bookList);


    const deleteFromBookList = (bookListId, bookId) => {
        const bookListData = {
            bookListId: bookListId,
            bookId: bookId
        };
        // console.log(bookListData.bookId)

        dispatch(deleteBookFromBookList(bookListData)).then((res) => {
            if (res.type === "bookLists/deleteBookFromBookList/rejected") {
                // console.log(res)

                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "danger",
                    notificationMessage: res.payload.response.data.error
                }))
            } else {
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Book List Updated!"
                }));
            }
        });
    }

    const deleteBookListFunction = (bookListId) => {
        const bookListData = {
            bookListId: bookListId,
        };
        console.log(bookListData)

        dispatch(deleteBookList(bookListData)).then((res) => {
            if (res.type === "bookLists/deleteBookList/rejected") {
                // console.log(res)

                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "danger",
                    notificationMessage: res.payload.response.data.error
                }))
            } else {
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Book List Updated!"
                }));
            }
        });
    }

    return (
        <>


            {bookLists.bookLists.map((bookList, index) => {
                return <Box key={index} sx={{
                    m: 2,

                }}>
                    <Sheet key={index} color={"primary"} variant={"soft"} sx={{
                        width: "100%", height: "auto", borderRadius: "lg",

                    }}>


                        <Box sx={{
                            p: 2, mb: 2,

                        }}>
                            <Stack direction="row"
                                   justifyContent="space-between"
                                   alignItems="center"
                                   spacing={2} sx={{
                                pl: 2
                            }}>
                                <Stack>
                                    <Typography level="title-lg" color={"primary"}>
                                        {bookList.bookListName}
                                    </Typography>
                                    <Typography level="body-lg" color={"primary"}>
                                        {bookList.bookListDescription}
                                    </Typography>

                                </Stack>

                                <ButtonGroup
                                    disableElevation
                                    variant="contained"
                                    aria-label="Disabled elevation buttons"
                                >
                                    <Button variant={"solid"} color={"primary"} onClick={() => {
                                        setOpen(true);
                                        setBookId(bookList._id);
                                        setBookListName(bookList.bookListName);
                                        setBookListDescription(bookList.bookListDescription);
                                    }}>Edit</Button>
                                    <Button variant={"solid"} color={"primary"} onClick={()=>{
                                        deleteBookListFunction(bookList._id);
                                    }}>Delete</Button>
                                </ButtonGroup>
                            </Stack>


                            <Typography level="body-lg" color={"primary"}></Typography>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                spacing={1}
                                sx={{
                                    width: "100%",
                                }}
                            >


                                {bookList.bookList.map((book, index) => {
                                    return (<>
                                        <Sheet key={index} variant={"soft"} color={"primary"} sx={{
                                            borderRadius: "lg", p: 1, width: "150px", position: "relative", // Added position property
                                        }}>
                                            <IconButton
                                                variant={"solid"}
                                                color={"primary"}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 20,
                                                    zIndex: 1,
                                                }} // Adjust positioning as needed
                                                onClick={() => deleteFromBookList(bookList._id, book.bookId)} // Adjust the function as needed
                                            >
                                                <RemoveRoundedIcon color={"plain"}/>
                                            </IconButton>


                                            <img
                                                src={book.bookPicture}
                                                style={{
                                                    width: "120px",
                                                    height: "150px",
                                                    borderRadius: "10px",
                                                    margin: 3
                                                }}
                                                alt={"books"}
                                            />


                                            <Typography level={"title-sm"} color={"primary"}>
                                                {book.bookName}
                                            </Typography>

                                            <Stack direction={"row"}>
                                                <Typography level={"title-sm"} color={"danger"} sx={{}}>
                                                    {book.bookAuthor}
                                                </Typography>
                                            </Stack>
                                        </Sheet>

                                    </>)
                                })}


                            </Stack>

                        </Box>

                    </Sheet>
                </Box>


            })
            }
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant={"soft"} color={"primary"} invertedColors={true}>
                    <ModalClose/>
                    <DialogTitle>Update Book</DialogTitle>
                    <Stack direction="row"
                           justifyContent="space-between"
                           alignItems="center"
                           spacing={2} sx={{
                        m: 2
                    }}>
                        <Stack direction="column"
                               justifyContent="stretch"
                               alignItems="flex-start"
                        >
                            <Typography level="title-lg" color={"primary"}>
                                Book List Name
                            </Typography>
                            <Input placeholder={bookListName} variant="outlined"
                                   value={bookListName}
                                   onChange={(e) => {
                                       setBookListName(e.target.value);
                                   }}

                                   color={"primary"}
                            />
                            <Box sx={{
                                height: "20px"
                            }}>

                            </Box>
                            <Typography level="title-lg" color={"primary"}>
                                Description
                            </Typography>
                            <Textarea
                                minRows={1}
                                color={"primary"}
                                placeholder={bookListDescription}
                                value={bookListDescription}
                                variant="outlined"
                                onChange={(e) => {
                                    setBookListDescription(e.target.value);
                                }}
                                sx={{
                                    width: "100%",
                                }}
                                error={bookListNameInputError}
                            />
                            <Box sx={{
                                height: "20px"
                            }}>

                            </Box>
                            <Typography level="title-lg" color={"primary"}>
                                Sharing
                            </Typography>
                            <Select
                                defaultValue="public"
                                variant="outlined"
                                color={"primary"}
                                onChange={(event, value) => {
                                    // console.log(value);
                                    setSharingOption(value);
                                }}
                            >
                                <Option value="public">Public</Option>
                                <Option value="private">Private</Option>
                            </Select>
                        </Stack>


                    </Stack>


                    <Button type={"submit"} onClick={() => submitUpdateBookList()}>Update Book
                        List</Button>
                </ModalDialog>
            </Modal>

        </>
    );
}


export default MyBookList;