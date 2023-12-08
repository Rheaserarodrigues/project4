import Button from "@mui/joy/Button";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {useState} from "react";
import {Badge, Drawer, Stack} from "@mui/joy";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useSelector} from "react-redux";
import WebsiteLogo from "./assets/websiteLogo.png";
import {SearchBar} from "./components/SearchBar/SearchBar.jsx";
import MenuIcon from "@mui/icons-material/Menu.js";
import {AuthenticatedDrawer} from "./components/drawers/AuthenticatedDrawer.jsx";
import Sheet from "@mui/joy/Sheet";
import CustomAvatar from "./components/avatar/Avatar.jsx";
import WebsiteLogoSmall from "./assets/websiteLogoSmall.png";

export default function RootLayout() {
    const cart = useSelector(state => state.cart);

    const [open, setOpen] = useState(false);


    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.refreshToken !== "");

    const toggleDrawer = (inOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(inOpen);
    };


    return (<>
        <div style={{
            position: "sticky",
            top: "0",
            zIndex: "1000",
            padding: "15px"
        }}>
            <Box color="primary" variant="soft" sx={{
                width: "100%",
                height: "30px",
                borderRadius: "10px",
                alignItems: "center",

            }}>
                <Stack direction="row"
                       justifyContent="space-between"
                       alignItems="center" sx={{}}>
                    <Box sx={{
                        display: {md: "inline", sm: "none", xs: "none"}
                    }}>
                        <NavLink to="/">
                            <img src={WebsiteLogo} style={{
                                width: "auto",
                                height: "40px"
                            }} alt={""}/> </NavLink>

                    </Box>
                    <Box sx={{
                        display: {md: "none", sm: "inline", xs: "inline"}
                    }}>
                        <NavLink to="/"> <img src={WebsiteLogoSmall} style={{
                            width: "50px",
                            height: "auto"
                        }} alt={""}/></NavLink>

                    </Box>

                    <SearchBar/>
                    {!isAuthenticated && (
                        <Stack direction="row"
                               justifyContent="space-between"
                               alignItems="center" sx={{
                            display: {md: "none", sm: "inline", xs: "inline"}
                        }}>

                            <IconButton variant={"plain"} onClick={() => setOpen(true)}>
                                <MenuIcon color={"primary"}/>
                            </IconButton>
                        </Stack>

                    )}

                    {!isAuthenticated && (
                        <Stack direction="row"
                               justifyContent="center"
                               sx={{
                                   display: {md: "inline", sm: "none", xs: "none"}
                               }}
                        >
                            <NavLink to="public-book-list">
                                <Button variant="plain" style={{
                                    fontSize: "1rem",
                                    borderRadius: "8px",
                                }}>Book Lists</Button>
                            </NavLink>
                            <NavLink to="login">
                                <Button variant="plain" style={{
                                    fontSize: "1rem",
                                    borderRadius: "8px",
                                }}>Sign in</Button>
                            </NavLink>
                            <NavLink to="register">
                                <Button variant="outlined" style={{
                                    fontSize: "1rem",
                                    borderRadius: "8px",
                                }}>Sign Up</Button>
                            </NavLink>
                        </Stack>
                    )}
                    {isAuthenticated === true ?
                        <>

                            <Stack direction={"row"} spacing={4}>
                                <Box sx={{
                                    display: {md: "inline", sm: "none", xs: "none"}
                                }}>
                                    <NavLink to="cart">
                                        <Badge badgeContent={Array.isArray(cart.cart)
                                            ? cart.cart.reduce((total, book) => total + book.quantity, 0)
                                            : 0}>
                                            <IconButton variant={"primary"}>
                                                <ShoppingCartIcon color={"primary"}/>
                                            </IconButton>
                                        </Badge>

                                    </NavLink>
                                </Box>
                                <CustomAvatar toggleDrawer={()=>setOpen(true)}/>
                            </Stack>


                        </>

                        : <></>}
                </Stack>
            </Box>


        </div>
        <main>
            <Outlet/>

            <Drawer
                anchor="right"
                color="primary"
                invertedColors
                variant="soft"
                size="md"

                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'transparent',
                            p: {md: 3, sm: 3, xs: 3},
                            boxShadow: 'none',
                        },
                    },
                }}
            >

                <Sheet
                    sx={{
                        borderRadius: 'md',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'stretch',
                        gap: 2,
                        height: '100%',
                        width: '88%',

                    }}
                    color="primary" variant="soft"
                >
                    {isAuthenticated === true ? <AuthenticatedDrawer
                        open={open}
                        toggleDrawer={toggleDrawer}
                        setOpen={setOpen}
                        badgeContent={Array.isArray(cart.cart)
                            ? cart.cart.reduce((total, book) => total + book.quantity, 0)
                            : 0}
                        navigate={navigate}/> : <>
                        <NavLink to="public-book-list">
                            <Button variant="outlined" sx={{
                                width: "100%",
                                fontSize: "1rem",
                                borderRadius: "8px",
                            }}>Book Lists</Button>
                        </NavLink>
                        <NavLink to="login">
                            <Button variant="outlined" sx={{
                                width: "100%",
                                fontSize: "1rem",
                                borderRadius: "8px",
                            }}>Sign in</Button>
                        </NavLink>

                        <NavLink to="register">
                            <Button variant="outlined" style={{
                                width: "100%",
                                fontSize: "1rem",
                                borderRadius: "8px",
                            }}>Sign Up</Button>
                        </NavLink></>

                    }

                </Sheet>
            </Drawer>


        </main>

    </>);
}