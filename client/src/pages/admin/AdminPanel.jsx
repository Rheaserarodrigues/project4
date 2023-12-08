import Table from '@mui/joy/Table';
import Sheet from "@mui/joy/Sheet";
import {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_URL} from "../../../config/env.jsx";
import {Chip} from "@mui/joy";
import Button from "@mui/joy/Button";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";
import {useDispatch} from "react-redux";



export const AdminPanel = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        const res = await axios.get(BACKEND_URL + "/api/v1/admin/control/users");
        // console.log(res.data);
        setUsers(res.data.users);
    }
    // get all users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(BACKEND_URL + "/api/v1/admin/control/users");
            // console.log(res.data);
            setUsers(res.data.users);
        }

        fetchUsers();
    }, [])

    // console.log(users)

    return (
        <Sheet
            variant="soft"
            color="primary"

            sx={{
                mt: 2,
                pt: 0,
                borderRadius: 'lg',
                transition: '0.3s',
                background: (theme) =>
                    `linear-gradient(45deg, ${theme.vars.palette.primary[100]}, ${theme.vars.palette.primary[100]})`,
                '& tr:last-child': {
                    '& td:first-child': {
                        borderBottomLeftRadius: '8px',
                    },
                    '& td:last-child': {
                        borderBottomRightRadius: '8px',
                    },
                },
            }}
        >

            <Table aria-label="table variants" variant={"soft"} sx={{
                borderRadius: '10px',
            }}  borderAxis="bothBetween"
                   color="primary"
                   stickyFooter={false}
                   stickyHeader>
                <thead>
                <tr>
                    <th style={{
                        width: '5%',
                    }}>ID
                    </th>
                    <th style={{
                        width: '8%',
                    }}>First Name
                    </th>
                    <th style={{
                        width: '8%',
                    }}>Last Name
                    </th>
                    <th>Email-ID</th>
                    <th style={{
                        width: '5%',
                    }}>Role
                    </th>
                    {/*<th style={{*/}
                    {/*    width: '8%',*/}
                    {/*}}>Created On</th>*/}
                    {/*<th>Last Updated On</th>*/}
                    <th style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>Access Control</th>
                    <th>Update Access</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td style={{
                            overflow: 'hidden',
                        }}>{user._id}</td>
                        <td style={{

                            overflow: 'hidden',
                        }}>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td style={{

                            overflow: 'hidden',
                        }}>{user.email}</td>
                        <td>{user.role}</td>
                        <td style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}> <Chip color={user.status === "active" ? "success": "danger"} variant={"solid"}>{user.status}</Chip></td>
                        <td><Button variant={"outlined"} onClick={()=>{

                                axios.put(BACKEND_URL + "/api/v1/admin/control/mark-user-status", {
                                    userId: user._id
                                }).then((res) => {
                                    // console.log(res.data);
                                    dispatch(notificationStateChange({
                                        notification: true,
                                        notificationMessage: "Status Updated to " + res.data.newStatus +" ! ",
                                        notificationColor: "success"
                                    }));
                                  fetchUsers();
                                })

                        }}> Update</Button> </td>
                        {/*<td>{formatDate(user.updatedAt)}</td>*/}
                    </tr>
                ))}
                </tbody>
            </Table>
        </Sheet>
    );
}



const formatDate = (timestampString) => {
    const date = new Date(timestampString);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getUTCDay()];

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Toronto', // Time zone for Ontario, Canada
    };

    const formattedDate = `${date.toLocaleString('en-US', options)}`;

    return formattedDate;
};