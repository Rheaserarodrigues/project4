import Sheet from "@mui/joy/Sheet";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import WebsiteLogoSmall from "../../assets/websiteLogoSmall.png";
import Box from "@mui/joy/Box";
import {Drawer, Stack} from "@mui/joy";
import MenuIcon from "@mui/icons-material/Menu.js";
import Button from "@mui/joy/Button";
import {SearchBar} from "../SearchBar/SearchBar.jsx";

import {AuthenticatedDrawer} from "./AuthenticatedDrawer.jsx";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {useSelector} from "react-redux";

export const ResponsiveDrawer = ({open, setOpen}) => {

    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.user.refreshToken !== "");


    return (<>

        <Box sx={{
            m:2,
            width: "95%",
            height: "30px",
            borderRadius: "10px",
            alignItems: "center",

        }}>
            <Stack direction="row"
                   justifyContent="space-between"
                   alignItems="center" sx={{}}>
                <NavLink to="/"> <img src={WebsiteLogoSmall} style={{
                    width: "50px",
                    height: "auto"
                }} alt={""}/></NavLink>

                <SearchBar/>

                <IconButton variant={"plain"} onClick={() => setOpen(true)}>
                    <MenuIcon color={"primary"}/>
                </IconButton>
            </Stack>
        </Box>

        <main>
            <Outlet/>
            <Drawer
                anchor="right"
                color="primary"
                invertedColors
                variant="soft"
                size="md"

                open={open}
                onClose={setOpen}
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
                        height: '98%',
                        width: '200px',
                        overflow: "none",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: 2,
                        p: {md: 3, sm: 3, xs: 3},
                    }}
                    color="primary" variant="soft"
                >
                    <IconButton style={{
                        alignSelf: "flex-end"
                    }} onClick={() => setOpen(false)}>
                        <CloseRoundedIcon/>
                    </IconButton>
                    {!isAuthenticated && (
                        <>


                            <NavLink to="login">
                                <Button variant="soft" sx={{
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
                            </NavLink>
                        </>
                    )}
                    {isAuthenticated === true ? <>


                        <AuthenticatedDrawer/>

                    </> : <></>}

                </Sheet>

            </Drawer>

        </main>

    </>);
}