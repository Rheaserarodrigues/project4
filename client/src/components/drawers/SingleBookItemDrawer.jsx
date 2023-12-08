import Sheet from "@mui/joy/Sheet";
import {Drawer, Stack} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded.js";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add.js";
import {addToCartAsyncThunk, addToCartPending} from "../../store/CartSlice.jsx";
import {useDispatch, useSelector} from "react-redux";
import {NavLink} from "react-router-dom";


const SingleBookItemDrawer = ({open, toggleDrawer, book, userDataState}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user);
    const addToCart = async (id, bookName, bookPicture, amount) => {
        console.log("id:", id);
        console.log("bookName:", bookName);
        console.log("bookPicture:", bookPicture);
        console.log("amount:", amount);
        dispatch(addToCartPending());
        try {
            const cartItemData = {
                userId: currentUser.user.id,
                data: {

                    bookId: id,
                    bookName: bookName,
                    bookPicture: bookPicture,
                    price: amount,

                }
            }
            dispatch(addToCartAsyncThunk(cartItemData))
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    return (
        <Drawer open={open} onClose={toggleDrawer(false)}
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
            <Stack>
                <Stack direction={{
                    xs: 'column',
                    sm: 'row',
                    md: 'row',
                }} alignItems={"center"} justifyContent={"flex-end"}>
                    <IconButton onClick={toggleDrawer(false)}>
                        <CloseRoundedIcon color={"primary"}/>
                    </IconButton>
                </Stack>
                <Stack direction={{
                    xs: 'row',
                    sm: 'row',
                    md: 'row',
                }} spacing={{
                    xs: 5,
                    sm: 20,
                    md: 30,

                }}>

                    <Stack direction={"column"} spacing={2}>
                        <Typography level="h2" sx={{
                            fontSize: {
                                xs: "25px",
                                sm: "28px",
                                md: "30px",
                            },
                        }
                        }> {book.volumeInfo?.title}</Typography>
                        <Typography level="title-md">
                            <b> By </b> {book.volumeInfo?.authors && book.volumeInfo.authors.map(author => author).join(', ')}
                        </Typography>
                        <Typography level="title-md">
                            <b> Category: </b> {book.volumeInfo?.categories && book.volumeInfo.categories.map(category => category).join(', ')}
                        </Typography>


                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Typography
                                level="h3">{book.saleInfo?.saleability === "FOR_SALE" || book.saleInfo?.saleability === "FOR_SALE_AND_RENTAL" ? `$${book.saleInfo.listPrice.amount}` : "Unavailable"} </Typography>

                        </Stack>

                    </Stack>

                    <img style={{
                        height: '195px',
                        borderRadius: "10px",
                        alignSelf: "center",
                        width: '150px', // Ensure the image adjusts its width proportionally
                        maxWidth: '150px', // Ensure the image does not exceed its container width


                    }}
                         src={book.volumeInfo?.imageLinks.thumbnail}
                         loading="lazy"
                         alt=""
                    />

                </Stack>
            </Stack>
            <Box sx={{
                m: {xs: 3, sm: 5, md: 8},
            }}>
                {currentUser.refreshToken === "" ?<NavLink to="/register">
                    <Button
                        variant="outlined"
                        size="md"
                        color="primary"
                        aria-label="Read"
                        style={{borderRadius: "20px", width: "200px", alignSelf: "flex-end"}}
                        // onClick={() => addToCart(book.id, book.volumeInfo.title, book.saleInfo.listPrice.amount)}
                        // onClick={toggleDrawer(true)}
                    >
                        Sign Up To Add To Cart
                    </Button>
                </NavLink>  : <Button variant="outlined" startDecorator={<Add/>} onClick={() => addToCart(book.id, book.volumeInfo.title,book.volumeInfo?.imageLinks.thumbnail, book.saleInfo.listPrice.amount)}
                                    style={{borderRadius: "20px", width: "200px", alignSelf: "flex-end"}}
                >
                    Add To Cart
                </Button>}
            </Box>

            <Sheet variant={"soft"} sx={{
                width: "100%",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px",
                padding: {xs: "1rem", md: "1rem 2rem"}

            }}>
                <Typography level="h3">
                    About this Edition
                </Typography>
                <Stack direction={{
                    xs: 'column',
                    sm: 'row',
                    md: 'row',
                }}
                       justifyContent="space-between" spacing={12}>
                    <Stack direction={"column"}>
                        <Typography level="inherit">
                            ISBN: {(book.volumeInfo?.industryIdentifiers ?? []).map(identifier => identifier.identifier).join(', ')}
                        </Typography>
                        <Typography>
                            Published: {book.volumeInfo?.publishedDate}
                        </Typography>
                        <Typography>
                            Publisher: {book.volumeInfo?.publisher}
                        </Typography>
                        <Typography>
                            Author : {book.volumeInfo?.authors}
                        </Typography>
                    </Stack>
                    <Stack direction={"column"}>
                        <Typography level="inherit">
                            Page Count: {book.volumeInfo?.pageCount}
                        </Typography>
                        <Typography>
                            Format: {book.volumeInfo?.publishedDate}
                        </Typography>
                        <Typography>
                            Language: {book.volumeInfo?.language}
                        </Typography>

                    </Stack>
                </Stack>


            </Sheet>
            <Sheet variant={"soft"} sx={{
                width: "100%",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
                padding: "1rem 2rem",
            }}>
                <Typography level="h3">
                    Description
                </Typography>
                <Typography level="inherit">
                    {book.volumeInfo?.description}
                </Typography>
            </Sheet>

            <Typography level="body-md" style={{
                marginTop: "20px",
                width: "70%",
            }}> </Typography>
            <Stack direction={"column"} spacing={2}>

            </Stack>


        </Sheet>
        </Drawer>
    );
}

export default SingleBookItemDrawer;