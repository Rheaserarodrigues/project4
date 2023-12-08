import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Rating from '@mui/material/Rating';
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import {useState} from "react";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import SingleBookItemDrawer from "../drawers/SingleBookItemDrawer.jsx";

export default function BookItem({book, addToFavorite}) {

    const [open, setOpen] = useState(false);
    // const userDataState = useSelector((state) => state.user.refreshToken);
    // console.log("Login Page",userDataState);
    const toggleDrawer = (inOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(inOpen);
    };


    return (
        <>

            <Box sx={{
                height: "200px",
                width: "400px",
            }}>
                <Sheet sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    borderRadius: "10px",

                }}>
                    <div onClick={toggleDrawer(true)}>
                        <img style={{
                            height: '195px',
                            borderRadius: "10px",
                            alignSelf: "center",
                            width: '150px', // Ensure the image adjusts its width proportionally
                            maxWidth: '150px', // Ensure the image does not exceed its container width


                        }}
                             src={book.volumeInfo?.imageLinks?.thumbnail ?? ""}
                             loading="lazy"
                             alt=""
                        />
                    </div>
                    <Sheet variant={"soft"} sx={{
                        width: "180px",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                        borderRadius: "10px",
                        padding: "1rem 2rem",


                    }}>

                        <Typography level="title-lg" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: "200px"
                        }}>{book.volumeInfo.title}</Typography>
                        <Typography fontSize="sm" fontWeight="md" color="neutral" sx={{
                            marginTop: "10px",
                        }}>
                            {book.volumeInfo.categories}
                        </Typography>
                        <Rating sx={{
                            '& .MuiRating-iconFilled': {
                                color: 'primary.main',
                            },
                            marginTop: "10px"
                        }} name="read-only" value={book.volumeInfo.averageRating} readOnly size="small"/>
                        <Typography fontSize="sm" fontWeight="md" color="primary" sx={{
                            marginTop: "10px",
                        }}>
                            {book.saleInfo.saleability === "FOR_SALE" || book.saleInfo.saleability === "FOR_SALE_AND_RENTAL" ? `$${book.saleInfo.listPrice.amount}` : "Unavailable"}
                        </Typography>
                        <Box sx={{
                            marginTop: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                            <Button
                                variant="soft"
                                size="md"
                                color="primary"
                                aria-label="Read"
                                // onClick={() => addToCart(book.id, book.volumeInfo.title, book.saleInfo.listPrice.amount)}
                                onClick={toggleDrawer(true)}
                            >
                                View
                            </Button>

                            {book.saleInfo.saleability === "FOR_SALE" || book.saleInfo.saleability === "FOR_SALE_AND_RENTAL" ?
                                <IconButton
                                    aria-label=""
                                    variant="soft"
                                    color="primary"
                                    sx={{ml: 'auto', alignSelf: "center", fontWeight: 600}}
                                    size="sm"
                                    onClick={() => addToFavorite(
                                        book.id,
                                        book.volumeInfo.title,
                                        book.volumeInfo.imageLinks.thumbnail,
                                        book.volumeInfo.pageCount,
                                        book.volumeInfo.authors[0]
                                    )}
                                >
                                    <BookmarkAddIcon sx={{
                                        color: "primary.main",
                                    }}/>
                                </IconButton> : <div></div>}

                        </Box>


                    </Sheet>
                </Sheet>
            </Box>


            <SingleBookItemDrawer book={book} open={open}
                                  toggleDrawer={toggleDrawer}/>
        </>




        // <CardContent orientation="horizontal">

        // </CardContent>

    );
}


// <Typography level="body-sm">{book.volumeInfo.publishedDate}</Typography>