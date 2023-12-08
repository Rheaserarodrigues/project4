import {useLocation} from "react-router-dom";
import {Fragment, useEffect, useState} from "react";
import {BACKEND_URL} from "../../../config/env.jsx";
import {useSelector} from "react-redux";
import Box from "@mui/joy/Box";
import axios from "axios";
import {Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import IconButton from "@mui/joy/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
function createData(name, calories, fat, carbs, protein, price) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

function Row({row, index}) {

    const [open, setOpen] = useState(index || false);

    return (
        <Fragment>
            <tr>
                <td>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </td>


                <td style={{
                    width: '50%',
                }}><Typography level={"title-md"}>Ordered on {formatDate(row.createdAt)}</Typography></td>
                <tdv><Typography level={"title-lg"} color={"primary"}>  ${row.totalBill}</Typography></tdv>
            </tr>
            <tr>
                <td style={{height: 0, padding: 0}} colSpan={6}>
                    {open && (
                        <Sheet
                            variant="soft"
                            sx={{p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)'}}
                        >
                            <Typography level="body-lg" color={"primary"}>
                                What Books you ordered?

                            </Typography>
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="purchases"
                                sx={{
                                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                                        {textAlign: 'right'},
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Book name</th>
                                    <th>Quantity</th>
                                    <th>Total price ($)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {row?.orderedItems.map((historyRow,index) => (
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <th scope="row">{historyRow.name}</th>
                                        <td>{historyRow.cartQuantity}</td>
                                        <td>{historyRow.price}</td>

                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>
        </Fragment>
    );
}


const OrdersPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('id');

    const [loading, setLoading] = useState(false);

    const [orderData, setOrderData] = useState(null);

    const userDataState = useSelector((state) => state.user.user);
    console.log("userDataState:", userDataState);

    useEffect(() => {
        console.log("HIHI", userId)
        const fetchOrderDataWithoutId = async () => {
            setLoading(true);
            console.log("HIHI")
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/secure/order/${userDataState.id}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('fetchOrderDataWithoutId data:', data);
                setOrderData(data);
                setLoading(false)
                return data;
            } catch (error) {
                console.error('Error:', error);
            }
        }


        fetchOrderDataWithoutId();
    }, [userDataState]);

    useEffect(() => {
        const fetchOrderData = async () => {

            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/secure/cart/deleteCart/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = response.data;
                console.log('data:', data);
                setOrderData(data);
                setLoading(false)
                return data;
            } catch (error) {
                console.error('Error:', error);
            }
        }


        if (userId) {
            fetchOrderData();
        }

    }, [userId]);
    return (
        <div>
            <Stack direction={"row"}
                   justifyContent={"center"}
            >
                <Typography level={"h4"} color={"primary"}>Orders History</Typography>

            </Stack>

            <Box>
                <Sheet>
                    <Table
                        aria-label="collapsible table"
                        sx={{
                            '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                                {textAlign: 'right'},
                            '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                                {
                                    borderBottom: 0,
                                },
                        }}
                    >

                        <tbody>
                        {orderData?.map((row, index) => (
                            <Row key={index} row={row} initialOpen={index === 0}/>
                        ))}
                        </tbody>
                    </Table>
                </Sheet>
            </Box>

        </div>
    );
}

export default OrdersPage;