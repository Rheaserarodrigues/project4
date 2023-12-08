import {Stack} from "@mui/joy";
import defaultProfileImage from "../../assets/GoogleLogo.png";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
// eslint-disable-next-line react/prop-types
const CartItem = ({onPlusClick,onMinusClick,bookId,bookName,bookPicture,quantity,price}) => {



    return (


                        <Stack direction={{xs:"column",sm:"column",md:"row"}}
                               justifyContent="space-between"
                               alignItems="center"
                               sx={{
                                   height:"auto"
                               }}
                               spacing={2}
                               >
                            <Stack direction="row"
                                   justifyContent="space-between"
                                   alignItems="center"
                                   spacing={2}>
                                <Stack>
                                    <img src={bookPicture ?? defaultProfileImage} width={60}  alt="Book Cover" />
                                </Stack>
                                <Stack>
                                    <Typography level="title-md"
                                                color={"primary"}
                                                style={{ width: '200px', wordWrap: 'break-word' }}>{bookName}</Typography>

                                </Stack>
                            </Stack>

                            <Stack  direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}>
                                <IconButton variant={"soft"} color={"primary"} onClick={()=>onMinusClick(bookId)}>
                                   <RemoveRoundedIcon />
                                </IconButton>
                                <Stack direction={"column"} alignItems={"center"}>
                                    <Typography level="title-sm" color={"primary"}>Qty</Typography>
                                    <Typography level="h4" color={"primary"}>{quantity}</Typography>
                                </Stack>
                                <IconButton variant={"soft"} color={"primary"}  onClick={()=>onPlusClick(bookId,price)}>
                                    <AddRoundedIcon/>
                                </IconButton>
                            </Stack>
                            <Stack  direction="row"
                                    justifyContent="flex-end"
                                    alignItems="flex-end"
                                    spacing={2}>
                                <Stack direction={"row"} alignItems={"flex-end"} spacing={2}>
                                    <Typography  level="title-sm" color={"primary"} >Price</Typography>
                                    <Typography  level="title-lg" color={"primary"} ><i>$</i>{price}</Typography>
                                </Stack>
                            </Stack>

                            <Stack direction={"row"} alignItems={"flex-end"} spacing={2} >
                                <Typography  level="title-sm" color={"primary"} >Total</Typography>

                                <Typography  level="title-lg" color={"primary"} ><i>$</i>{price*quantity}</Typography>
                            </Stack>
                        </Stack>







    );
}

export default CartItem;