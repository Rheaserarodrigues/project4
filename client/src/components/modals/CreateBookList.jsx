import {
    FormControl,
    FormHelperText,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog, Radio, RadioGroup,
    Stack,
    Textarea
} from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import {InfoOutlined} from "@mui/icons-material";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createBookList, getBookLists} from "../../store/BookListSlice.jsx";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";

const CustomInputField = ({
                              label,
                              type,
                              value,
                              onChange,
                              error,
                              styleProps
                          }) => (
    <FormControl error={Boolean(error)}>
        <FormLabel><Typography color="primary">{label}</Typography></FormLabel>
        <Input
            // placeholder={`Type in ${label.toLowerCase()}…`}
            size="md"
            variant="soft"
            type={type}
            value={value}
            onChange={onChange}
            sx={{...styleProps}}
        />
        {Boolean(error) && (
            <FormHelperText>
                <InfoOutlined/>
                {error}
            </FormHelperText>
        )}
    </FormControl>
);

const CustomInputFieldTextArea = ({
                              label,
                              type,
                              value,
                              onChange,
                              error,
                              styleProps
                          }) => (
    <FormControl error={Boolean(error)}>
        <FormLabel><Typography color="primary">{label}</Typography></FormLabel>
        <Textarea
            // placeholder={`Type in ${label.toLowerCase()}…`}
            size="md"
            variant="soft"
            minRows={2}
            type={type}
            value={value}
            onChange={onChange}
            sx={{...styleProps}}
        />
        {Boolean(error) && (
            <FormHelperText>
                <InfoOutlined/>
                {error}
            </FormHelperText>
        )}
    </FormControl>
);
const CreateBookList = ({showCreateBookList,setShowCreateBookList}) => {
    const [bookListName,setBookListName] = useState("");
    const [bookListDescription,setBookListDescription] = useState("");
    const [sharingOption,setSharingOption] = useState("private");
    const [bookListNameInputError,setBookListNameInputError] = useState("");
    const [bookListDescriptionInputError,setBookListDescriptionInputError] = useState("");

    const dispatch = useDispatch();
    const userDataState = useSelector((state) => state.user.user);
    // console.log(userDataState);
    const submitCreateBookList = () => {
        if(bookListName === ""){
            setBookListNameInputError("Book List Name cannot be empty");
        }

        const bookList = {
            userId: userDataState.id,
            creatorName: userDataState.firstName + " " + userDataState.lastName,
            bookListName:bookListName,
            bookListDescription: bookListDescription,
            sharingOption:sharingOption
        }
        console.log(bookList);
        dispatch(createBookList(bookList)).then((res)=>{
            if(res.type==="bookLists/createBookList/rejected"){
                console.log(res)

                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "danger",
                    notificationMessage: res.payload.response.data.error
                }))
            } else {
                setShowCreateBookList(false);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: "Book List Created!"
                }));
            }
            console.log(res);
            console.log("Book List Created");
            // setShowCreateBookList(false);

        });
        dispatch(getBookLists(userDataState.id));
    }

    return (
        <Modal open={showCreateBookList} onClose={()=>setShowCreateBookList(false)}>
            <ModalDialog variant={"soft"} color={"primary"} invertedColors>
                <ModalClose/>
                <Box sx={{
                    width: "400px",
                    height: "300px",
                    pt: 2,
                }}>
                    <Stack direction="column"
                           justifyContent="center"
                           alignItems="stretch" spacing={2}>
                        <CustomInputField
                            label={"Book List Name"}
                            placeholder={"Enter Book List Name"}
                            value={bookListName}
                            onChange={(e) => {
                                setBookListName(e.target.value);
                                setBookListNameInputError('');
                            }}

                            error={bookListNameInputError}
                        />
                        <CustomInputFieldTextArea
                            label={"Book List Description (Optional)"}
                            placeholder={"Enter Book List Description"}
                            value={bookListDescription}
                            onChange={(e) => {
                                setBookListDescription(e.target.value);
                                setBookListDescriptionInputError('');
                            }}
                            error={bookListDescriptionInputError}
                        />
                        <FormControl>
                            <FormLabel><Typography color="primary">Sharing Option</Typography></FormLabel>
                            <RadioGroup defaultValue="private" name="radio-buttons-group" onChange={(event)=>{
                                setSharingOption(event.target.value);
                            }}>
                                <Stack direction="row"
                                       justifyContent="center"
                                       alignItems="center"
                                       spacing={2}>
                                <Radio value="private" label="Private" variant="outlined" />
                                <Radio value="public" label="Public" variant="soft" />
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <Stack direction="row"
                               justifyContent="center"
                               alignItems="center"
                               sx={{
                                   m:2
                               }}>
                            <Button variant={"soft"} color={"primary"} onClick={()=>submitCreateBookList()}>Create</Button>
                        </Stack>
                    </Stack>

                </Box>
            </ModalDialog>
        </Modal>
    )
}

export default CreateBookList;