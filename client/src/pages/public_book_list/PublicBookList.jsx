import {ButtonGroup, Drawer, Modal, ModalClose, ModalDialog, Stack, Switch, Textarea} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion, {accordionClasses} from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {BACKEND_URL} from "../../../config/env.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";
import SingleBookItemDrawer from "../../components/drawers/SingleBookItemDrawer.jsx";
import {useDispatch, useSelector} from "react-redux";
import Rating from "@mui/material/Rating";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const PublicBookList = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user.refreshToken !== "");
    const userData = useSelector(state => state.user.user);


    const [bookLists, setBookLists] = useState([]);

    const [open, setOpen] = useState(false);
    const [book, setBook] = useState({});

    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);
    const [ratingDescription, setRatingDescription] = useState("");

    const [bookTempId, setBookTempId] = useState({});
    const [openReviews, setReviews] = useState(false);
    const [bookListReviews, setBookListReviews] = useState([]);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const fetchBookLists = async () => {
            try {
                const response = await axios.get(isAuthenticated === true ? BACKEND_URL + '/api/v1/secure/book-list/top-book-lists' : BACKEND_URL + '/api/v1/open/books/top-book-lists');
                setBookLists(response.data);
                // console.log("response", response.data)
            } catch (error) {
                // console.error('Error fetching book lists:', error);
            }
        };

        // Call the fetch function
        fetchBookLists();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    const showBookItemFromBookList = async (id) => {
        console.log("showBookItemFromSearch id:", id);
        try {

            const response = await axios.get(BACKEND_URL +`/api/v1/secure/book/${id}`);
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

    const submitReview = async () => {
        // console.log(bookTempId, userData.id, ratingValue, ratingDescription);
        try {
            const response = await axios.post(BACKEND_URL + `/api/v1/secure/book-list/add-review`, {
                bookListId: bookTempId,
                userId: userData.id,
                userName: userData.firstName + " " + userData.lastName,
                rating: ratingValue,
                comment: ratingDescription
            });
            console.log(response.data);
            if (response.data) {
                setOpenReviewModal(false);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Review Added Successfully!"
                }));
            }
        } catch (error) {
            console.log(error);
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "danger",
                notificationMessage: "Could Not Add Review!"
            }));
        }
    }

    const getBookListReviewsForAdmin = async (bookListId) => {
        console.log(bookListId,userData.role);
        try {
            // console.log("isAdmin", isAdmin)
            const response = await axios.get(BACKEND_URL + "/api/v1/admin/control/reviews/"+bookListId );
            // console.log(response.data)
            if (Array.isArray(response.data) && response.data.length !== 0) {
                const newData = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setBookListReviews(newData);
                // setReviews(false);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "No Reviews have Been Added Yet!"
                }));
            }
        } catch (error) {
            console.log(error);
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "danger",
                notificationMessage: "Could Not Get Reviews Something went Wrong"
            }));
        }
    }

    const getBookListReviews = async (bookListId) => {
        console.log(bookListId);
        try {

            const response = await axios.get(BACKEND_URL + `/api/v1/secure/book-list/reviews/` + bookListId);


            if (Array.isArray(response.data) && response.data.length !== 0) {
                const newData = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setBookListReviews(newData);

                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "No Reviews have Been Added Yet!"
                }));
            }
        } catch (error) {
            console.log(error);
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "danger",
                notificationMessage: "Could Not Get Reviews Something went Wrong"
            }));
        }
    }

    const hideBookListReviews = async (bookListId, reviewId,hide) => {
        console.log(bookListId);
        try {
            const response = await axios.put(BACKEND_URL + "/api/v1/admin/control/hide-review/"+bookListId+"/"+reviewId+"?hide="+hide.toString());
            console.log(response.data);
            setBookListReviews(response.data.reviews);

            if (Array.isArray(response.data) && response.data.length === 0) {
                // setReviews(false);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Review Hidden Successfully!"
                }));
            }
        } catch (error) {
            console.log(error);
            dispatch(notificationStateChange({
                notification: true,
                notificationColor: "danger",
                notificationMessage: "Could Not Add Review!"
            }));
        }
    }

    return (
        <>
            <div>
                <AccordionGroup sx={{
                    width: "100%",
                    [`& .${accordionClasses.root}`]: {
                        marginTop: '0.5rem',
                        transition: '0.2s ease',
                        bgcolor: 'primary.100',
                        borderRadius: 'lg',
                        p: 2
                    },
                    [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                        bgcolor: 'primary.100',
                        borderRadius: 'lg',
                        borderBottom: '0px solid',
                        borderColor: 'background.level2',
                    },
                    '& [aria-expanded="true"]': {
                        boxShadow: (theme) => `inset 0 -1px 0 ${theme.vars.palette.divider}`,
                    },
                }}>
                    {
                        bookLists.map((bookList, index) => {
                            return (
                                <Accordion key={index} sx={{
                                    m: 3
                                }}>
                                    <AccordionSummary>
                                        <Stack direction={{md: "row", sm: "row", xs: "column"}}
                                               justifyContent="flex-start"
                                               alignItems="flex-start" spacing={{md: 3, sm: 2, xs: 2}}>
                                            <Typography level="title-lg">{`"${bookList.bookListName}"`}</Typography>
                                            <Typography variant={"primary"} level="title-sm" sx={{
                                                ml: 2
                                            }}>Created By: {bookList.creatorName}</Typography>
                                            <Typography variant={"primary"} color={"primary"}
                                                        level={"title-sm"}>Total
                                                Pages: {bookList.totalPagesOfBooksInList}</Typography>
                                            <Typography variant={"primary"} color={"primary"}
                                                        level={"title-sm"}>Book
                                                Count: {bookList.totalBooks}</Typography>
                                        </Stack>


                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Sheet color={"primary"} variant={"soft"} sx={{
                                            width: "100%", height: "auto", borderRadius: "lg",

                                        }}>


                                            <Box sx={{
                                                p: 2, mb: 2,
                                            }}>
                                                <Typography>
                                                    {bookList.bookListDescription}
                                                </Typography>
                                                <Stack
                                                    direction="row"
                                                    justifyContent="flex-start"
                                                    spacing={1}
                                                    sx={{
                                                        width: "100%", overflowX: "scroll",
                                                    }}
                                                >


                                                    {bookList.bookList.map((book, index) => {
                                                        return (<>
                                                            <Sheet key={index} variant={"soft"} color={"primary"} sx={{
                                                                borderRadius: "lg", p: 1, width: "150px",
                                                            }}>
                                                                <Stack direction="column"
                                                                       justifyContent="center"
                                                                       alignItems="center"
                                                                       sx={{
                                                                           width: "100%",

                                                                       }}
                                                                >

                                                                    <div>
                                                                        <img src={book.bookPicture} style={{
                                                                            width: "120px",
                                                                            height: "150px",
                                                                            borderRadius: "10px",
                                                                            margin: 3,
                                                                        }} alt={"books"}/>
                                                                    </div>
                                                                    <Stack direction="column"
                                                                           alignItems="flex-start"
                                                                           sx={{
                                                                               width: "100%",

                                                                           }}
                                                                    >
                                                                        <Typography level={"title-sm"} color={"primary"}
                                                                                    sx={{
                                                                                        mb: 2,
                                                                                        mt: 1,
                                                                                        pl: 2,
                                                                                        height: "20px",
                                                                                        width: "130px",
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                    }}
                                                                        >
                                                                            {book.bookName}
                                                                        </Typography>
                                                                        <Stack direction="column"
                                                                               justifyContent="center"
                                                                               alignItems="stretch" sx={{
                                                                            pl: 2
                                                                        }}>

                                                                            <Button
                                                                                variant="solid"
                                                                                size="md"
                                                                                color="primary"
                                                                                aria-label="Read"
                                                                                // onClick={() => addToCart(book.id, book.volumeInfo.title, book.saleInfo.listPrice.amount)}
                                                                                onClick={() => showBookItemFromBookList(book.bookId)}
                                                                            >
                                                                                View
                                                                            </Button>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Stack>


                                                            </Sheet>

                                                        </>)
                                                    })}


                                                </Stack>
                                            </Box>
                                            <Stack direction="row"
                                                   justifyContent="space-between"
                                                   alignItems="center"
                                                   spacing={2}>

                                                {
                                                    isAuthenticated === true ? <ButtonGroup color="primary"
                                                                                            size="sm"
                                                                                            variant="soft">
                                                        <Button startDecorator={<RateReviewRoundedIcon/>}
                                                                onClick={() => {
                                                                    setOpenReviewModal(true);
                                                                    setBookTempId(bookList._id);
                                                                }
                                                                }>
                                                            Add A Review
                                                        </Button>
                                                            {userData.role !== "admin" ?  <Button endDecorator={<CommentRoundedIcon/>}
                                                                onClick={() => {
                                                                    setReviews(true);
                                                                    console.log("I WAS CLICKED ?")
                                                                        getBookListReviews(bookList._id)
                                                                }}>
                                                            Check Review
                                                        </Button> : <Button endDecorator={<CommentRoundedIcon/>}
                                                                            onClick={() => {
                                                                                setReviews(true);

                                                                                    getBookListReviewsForAdmin(bookList._id)

                                                                            }}>
                                                                Check Review Admin
                                                            </Button>}
                                                    </ButtonGroup> : <></>
                                                }

                                            </Stack>
                                            <Modal open={openReviewModal} onClose={() => setOpenReviewModal(false)}>
                                                <ModalDialog variant="soft">
                                                    <ModalClose/>
                                                    <Typography level="h4" color={"primary"}>Review</Typography>
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={ratingValue}
                                                        onChange={(event, newValue) => {
                                                            setRatingValue(newValue);
                                                        }}
                                                    />
                                                    <Typography level="title-lg" color={"primary"}>
                                                        Comment
                                                    </Typography>
                                                    <Textarea
                                                        minRows={1}
                                                        color={"primary"}
                                                        placeholder={"Write you Review here"}
                                                        value={ratingDescription}
                                                        variant="outlined"
                                                        onChange={(e) => {
                                                            setRatingDescription(e.target.value);
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                        // error={bookListNameInputError}
                                                    />
                                                    <Button startDecorator={<RateReviewRoundedIcon/>}
                                                            onClick={() => submitReview(bookList._id)}>
                                                        Submit Review
                                                    </Button>
                                                </ModalDialog>
                                            </Modal>


                                            <Drawer open={openReviews} onClose={() => setReviews(false)}
                                                    anchor="bottom"
                                                    color="primary"
                                                    invertedColors
                                                    size="lg"
                                                    variant="soft"
                                                    slotProps={{
                                                        content: {
                                                            sx: {
                                                                bgcolor: 'transparent',
                                                                height: '100%',
                                                                width: '100%',
                                                                p: {md: 1.5, sm: 0, xs: 0},
                                                                // width: {md: 300, sm: '100%'},
                                                                boxShadow: 'none',
                                                            },
                                                        },
                                                    }}
                                            ><Sheet
                                                sx={{
                                                    borderRadius: 'md',
                                                    p: {xs: 5, sm: 7, md: 10},
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    // alignItems: 'stretch',
                                                    // gap: 2,
                                                    m: {xs: 1, sm: 2, md: 3},
                                                    height: 'auto',
                                                    // width: '88%',
                                                    // overflow: 'auto',
                                                }}
                                                color="primary" variant="soft"
                                            >
                                                <Stack direction={{
                                                    xs: 'column',
                                                    sm: 'row',
                                                    md: 'row',
                                                }} alignItems={"center"} justifyContent={"flex-end"}>
                                                    <IconButton onClick={() => setReviews(false)}>
                                                        <CloseRoundedIcon color={"primary"}/>
                                                    </IconButton>
                                                </Stack>
                                                <Stack
                                                    direction="column"
                                                    justifyContent="flex-start"
                                                    alignItems="stretch"
                                                    spacing={2}>

                                                    {Array.isArray(bookListReviews) && bookListReviews.length === 0
                                                        ?
                                                        <Typography level={"title-lg"} color={"primary"}>No Reviews have
                                                            been added yet!</Typography>
                                                        : <></>
                                                    }

                                                    {bookListReviews.map((review, index) => {

                                                        const nameArray = review.userName.split(" ");
                                                        const initials = nameArray.map(part => part.charAt(0));
                                                        const initialsString = initials.join("");

                                                        return (
                                                            <Sheet key={index} color={"primary"} variant="soft" sx={{
                                                                borderRadius: "lg", width: "100%",
                                                                pb: 2
                                                            }}>

                                                                <Box key={index} sx={{
                                                                    p: 2, mb: 2,
                                                                }}>
                                                                    <Stack direction="row"
                                                                           justifyContent="flex-start"
                                                                           alignItems="center"
                                                                           spacing={2}>
                                                                        <Avatar variant={"solid"}>
                                                                            {initialsString}
                                                                        </Avatar>
                                                                        <Typography level="title-md"
                                                                                    color={"primary"}>{review.userName}</Typography>
                                                                    </Stack>
                                                                    <Stack direction="row"
                                                                           justifyContent="flex-start"
                                                                           alignItems="center"
                                                                           sx={{
                                                                               pl: 7
                                                                           }}
                                                                    >

                                                                        <Typography level="title-sm"
                                                                                    color={"primary"}>Book List
                                                                            Rating:</Typography>
                                                                        <Rating
                                                                            name="simple-controlled"
                                                                            value={review.rating}
                                                                            readOnly
                                                                            sx={{
                                                                                pl: 1
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                    <Typography level="body-lg" sx={{
                                                                        pl: 7
                                                                    }}
                                                                                color="danger">
                                                                        {review.comment}
                                                                    </Typography>
                                                                </Box>

                                                                {userData.role === "admin" ? <Stack direction="row"
                                                                                  justifyContent="center"
                                                                                  alignItems="center"
                                                                                  spacing={2}>
                                                                    <Switch
                                                                        checked={review.hidden}
                                                                        onChange={(event) =>{
                                                                            hideBookListReviews(bookList._id, review._id,event.target.checked)
                                                                            setChecked(event.target.checked)
                                                                        }}
                                                                        color={review.hidden ? 'success' : 'neutral'}
                                                                        variant={review.hidden ? 'solid' : 'outlined'}
                                                                        endDecorator={review.hidden ? 'Hidden' : 'Not Hidden'}
                                                                        slotProps={{
                                                                            endDecorator: {
                                                                                sx: {
                                                                                    minWidth: 24,
                                                                                },
                                                                            },
                                                                        }}
                                                                    />
                                                                </Stack> : <></>}

                                                            </Sheet>

                                                        )
                                                    })}
                                                </Stack>
                                            </Sheet>
                                            </Drawer>


                                        </Sheet>
                                    </AccordionDetails>
                                </Accordion>
                            );

                        })
                    }
                </AccordionGroup>
            </div>
            <SingleBookItemDrawer book={book} open={open} toggleDrawer={toggleDrawer}/>

        </>
    )
}

export default PublicBookList;