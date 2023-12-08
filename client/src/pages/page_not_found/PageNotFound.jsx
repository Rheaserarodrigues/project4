import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/joy";

function NotFoundPage() {
    return <>


        <Box>
            <Stack  direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}>
                <Typography level="h1" color={"primary"} sx={{}}>
                    404
                </Typography>
                <Typography level="h3" color={"primary"} sx={{}}>
                    Page Not Found
                </Typography>
            </Stack>

        </Box>


    </>;
}

export default NotFoundPage;