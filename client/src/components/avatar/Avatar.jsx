import Avatar from '@mui/joy/Avatar';
import {useSelector} from "react-redux";

const CustomAvatar = ({ toggleDrawer,size="md",sx }) => {
    const userState = useSelector(state => state.user);

    return userState.user.profilePicture === null ?
            <Avatar variant="soft" color="primary"
                    onClick={toggleDrawer}
                    size={size}
                    sx={sx}
            >
                {userState.user.firstName && userState.user.lastName
                    ? `${userState.user.firstName[0]}${userState.user.lastName[0]}`
                    : userState.user.firstName
                        ? userState.user.firstName[0]
                        : ''}
            </Avatar> : <Avatar onClick={toggleDrawer}
                src={userState.user.profileImage}
            />

};

export default CustomAvatar;
