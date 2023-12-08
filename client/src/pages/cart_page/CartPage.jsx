import CartItem from "../../components/cart_item/CartItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {addToCartAsyncThunk, deleteFromCartAsyncThunk, getCartItems} from "../../store/CartSlice.jsx";
import {Divider, Stack} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {useEffect} from "react";
import axios from "axios";
import {BACKEND_URL} from "../../../config/env.jsx";


export const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const userDataState = useSelector((state) => state.user.user);

    const userStateRefreshToken = useSelector((state) => state.user);

    useEffect(() => {
        console.log("userDataState:", userDataState)
        dispatch(getCartItems(userDataState.id)).then((data) => {
            console.log('data getCartItems Login:', data);
        });
    },[userDataState]);

    const handlePlusClick = (bookId, price) => {
        console.log("itemId:", bookId)
        console.log("price:", price)
        const cartItem = {
            userId: userDataState.id,
            data: {
                bookId: bookId,
                price: price
            }
        }
        dispatch(addToCartAsyncThunk(cartItem))
    };

    const handleMinusClick = (bookId) => {

        try {
            const cartItem = {
                userId: userDataState.id,
                bookId: bookId,
            }
            dispatch(deleteFromCartAsyncThunk(cartItem));
        } catch (e) {
            console.log("error:", e);
        }

    };

    const payToCart = () => {
        // console.log("payToCart cart:", cart);
        const cartItem = {
            userId: userDataState.id,
            cartId: cart.cartId,
            data: {
                cart: cart.cart.map((item,index) => ({
                    id: index,
                    name: item.bookName,
                    price:  parseFloat(item.price).toFixed(2),
                    cartQuantity: item.quantity,
                    // Add other properties as needed
                })),
                cartTotal: parseFloat(cart.cartTotal).toFixed(2),
            }
        }
       console.log("cartItem:", cartItem)   ;
        axios
            .post(`${BACKEND_URL}/api/v1/secure/cart/create-checkout-session`, {
                cartItems: cartItem.data.cart,
                userId: userDataState.id,
            })
            .then((response) => {
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            })
            .catch((err) => console.log(err.message));
    }


    return (
        <div>
            <Stack direction="column"
                   justifyContent="space-between"
                   alignItems="center"
                   spacing={0}
                   sx={{
                       p: 3,
                   }}>
                <Sheet sx={{
                    width: "100%",
                    height: "auto",
                    padding: "10px",
                    borderRadius: "10px",
                }}>
                    <Stack direction="row"
                           justifyContent="space-between"
                           alignItems="center"
                           spacing={0}>
                        <Typography level="h2">Shopping Cart</Typography>

                    </Stack>
                </Sheet>
                {cart.cart?.map ?    <Sheet variant="soft" sx={{
                    width: "100%",
                    height: "auto",
                    padding: "10px",
                    borderRadius: "10px",


                }}>
                    <Stack direction={"column"}
                           divider={<Divider orientation="horizontal"/>}
                           spacing={4} sx={{
                        p: 2
                    }}>
                        {cart.cart.map((item) => (
                            <CartItem
                                key={item.bookId}
                                bookId={item.bookId}
                                bookName={item.bookName}
                                bookPicture={item.bookPicture}
                                quantity={item.quantity}
                                price={item.price}
                                onPlusClick={handlePlusClick}
                                onMinusClick={handleMinusClick}
                            />
                        ))}
                    </Stack>
                    <Divider orientation="horizontal" sx={{
                        height: "2px",
                        mr: 2,
                        ml: 2,
                        mb: 2,

                    }}/>
                    <Stack direction="row"
                           justifyContent="flex-end"
                           alignItems="center"
                           spacing={2} sx={{
                        mr: 2
                    }}>
                        <Typography level="h4" color={"primary"}>Total</Typography>
                        <Typography level="h4" color={"primary"}>$ {(cart.cartTotal == null ? 0 : cart.cartTotal ).toFixed(2)}</Typography>
                    </Stack>
                    {/*<Stack direction="row"*/}
                    {/*       justifyContent="flex-end"*/}
                    {/*       alignItems="center"*/}
                    {/*       spacing={2} sx={{*/}
                    {/*    mr: 2,*/}
                    {/*    mb:2*/}
                    {/*}}>*/}
                    {/*    <Typography level="h4" color={"primary"}>Tax </Typography>*/}
                    {/*    <Typography level="h4" color={"primary"}>$ {(0.13 * cart.cartTotal).toFixed(2)}</Typography>*/}
                    {/*</Stack>*/}

                    <Stack direction="row"
                           justifyContent="flex-end"
                           alignItems="center"
                           spacing={2} sx={{
                               mt:2,
                        mr: 2,
                    }}>
                        <Button color="danger">
                            <Typography level={
                                'h4'
                            } color={"plain"} onClick={()=>{
                                payToCart()
                            }}>Pay $ {(cart.cartTotal == null ? 0 : cart.cartTotal ).toFixed(2)}</Typography>
                        </Button>


                    </Stack>
                </Sheet> : (
                    <Typography level={"h3"} color={"primary"}>No items in the cart</Typography>
                )}

            </Stack>


        </div>
    );
};