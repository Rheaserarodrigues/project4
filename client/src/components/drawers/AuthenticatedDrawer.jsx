import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded.js";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded.js";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {Divider} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/UserSlice.jsx";
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import PasswordIcon from '@mui/icons-material/Password';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import CustomAvatar from "../avatar/Avatar.jsx";
export const AuthenticatedDrawer = ({open,toggleDrawer,navigate,badgeContent, setOpen}) => {
    const dispatch = useDispatch();

    const userState = useSelector(state => state.user);
    const isAdmin = useSelector(state => state.user.role === "admin");

    function handleLogout() {
        dispatch(logOut());
        setOpen(false);
        navigate('/',);
    }

    return (
        <>
            <Box>
                <List
                    size="md"
                    sx={{
                        mt: 'auto',
                        flexGrow: 0,
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                        '--List-gap': '8px',
                        mb: 2,
                    }}
                >
                    <ListItem >
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/profile',);
                            }}>
                            <PersonRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">View Profile</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    { isAdmin ? <ListItem >
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/admin');
                            }}>
                            <PersonRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Admin Panel</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem> : <></>}
                    <ListItem >
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/update-password',);
                            }}>
                            <PasswordIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Update Password</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/orders',);
                            }}>
                            <LocalMallRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Orders</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/cart',);
                            }}>

                                <ShoppingCartRoundedIcon/>

                            <ListItemContent>
                                <Typography level="title-sm">Cart</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/book-list',);
                            }}>
                            <CollectionsBookmarkRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">My Book List</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={
                            () => {
                                setOpen(false);
                                navigate('/public-book-list',);
                            }}>
                            <ViewListRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">View Public Book List</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Divider/>

                <Box sx={{display: 'flex', gap: 1, marginTop: '12px', alignItems: 'center'}}>
                    <CustomAvatar
                        variant="outlined"
                        size="sm"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    />
                    <Box sx={{minWidth: 0, flex: 1}}>
                        <Typography
                            level="title-sm">{userState.user?.firstName} {userState.user?.lastName}</Typography>
                        <Typography level="body-xs">{userState.user?.emailId}</Typography>
                    </Box>
                    <IconButton size="sm" variant="soft" color="neutral" onClick={() => handleLogout()}>
                        <LogoutRoundedIcon/>
                    </IconButton>
                </Box>
            </Box>
        </>

    )
}