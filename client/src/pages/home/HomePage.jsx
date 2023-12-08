import {useEffect} from "react";
import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/joy";
import BooksLandingPage1 from "../../assets/BookLandingPage-1.svg";
import {ReactSVG} from 'react-svg'
import Box from "@mui/joy/Box";
import "./HomePage.css";

export default function HomePage() {


    // Function to fetch books on initial page load
    // const fetchInitialBooks = () => {
    //     const booksParameters = {
    //         searchQuery: "Dogs",
    //         filterOptions: "ebooks",
    //         startIndex: 0,
    //     };
    //     dispatch(getBooksItems(booksParameters));
    // };

    useEffect(() => {

    }, []);


    return (
        <>
            <Box sx={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflowY: "scroll",
            }}>
                <Stack direction={{xs: 'column', sm: 'row'}}
                       spacing={{xs: 10, sm: 2, md: 4}}
                       justifyContent="center"
                       alignItems="center"
                       sx={{
                           p: {xs: 10, sm: 12, md: 15},

                       }}>
                    <div>

                        <Typography color="primary" level={"h2"}
                                    sx={{fontSize: {xs: 20, sm: 25, md: 30}, fontWeight: "bold"}}>
                            Welcome to BookHaven
                        </Typography>
                        <Typography level="title-md" color={""} sx={{
                            width: {xs: "100%", sm: "80%", md: "60%"},
                        }}>
                            Your Literary Sanctuary
                        </Typography>
                    </div>
                    <div>


                        <ReactSVG beforeInjection={(svg) => {
                            svg.classList.add('svg-class-name')


                        }} src={BooksLandingPage1}/>


                    </div>
                </Stack>
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center"
                       spacing={2} sx={{
                    mt: 10
                }}>
                    <Typography level="h3" color={"primary"} sx={{}}>
                        Discover a World of Stories
                    </Typography>
                    <Typography level="body-lg" color={"primary"} sx={{
                        width: {xs: "100%", sm: "80%", md: "60%"},
                    }}>
                        Dive into a curated collection of literary wonders at BookHaven, your premier online bookstore.
                        Uncover captivating tales, explore diverse genres, and embark on literary adventures that will
                        transport you to new realms.
                    </Typography>
                </Stack>
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center"
                       spacing={2} sx={{
                    mt: 10
                }}>
                    <Typography level="h3" color={"primary"} sx={{}}>
                        What Sets Us Apart?
                    </Typography>
                    <Typography level="body-lg" color={"primary"} sx={{
                        width: {xs: "100%", sm: "80%", md: "60%"},
                    }}>
                        <b>Genre Diversity:</b> From classic literature to contemporary bestsellers, we boast an
                        extensive
                        range of genres to satisfy every reading palate.
                    </Typography>
                    <Typography level="body-lg" color={"primary"} sx={{
                        width: {xs: "100%", sm: "80%", md: "60%"},
                    }}> <b>Exclusive Deals:</b> Enjoy special promotions, discounts, and exclusive offers that make
                        building
                        your personal library more affordable and delightful.
                    </Typography>
                    <Typography level="body-lg" color={"primary"} sx={{
                        width: {xs: "100%", sm: "80%", md: "60%"},
                    }}> <b>Reader Reviews:</b> Make informed choices with honest reviews from fellow book lovers. Share
                        your
                        thoughts and recommendations to create a vibrant community of passionate readers.
                    </Typography>
                </Stack>
                <Stack direction="column"
                       justifyContent="center"
                       alignItems="center"
                       spacing={2} sx={{
                    mt: 10
                }}>
                    <Typography level="h3" color={"primary"} sx={{}}>
                        Join the BookHaven Community
                    </Typography>
                    <Typography level="body-lg" color={"primary"} sx={{
                        width: {xs: "100%", sm: "80%", md: "60%"},
                    }}>
                        Connect with fellow readers, participate in discussions, and stay updated on the latest literary
                        news. BookHaven isn't just a store; it's a community of book enthusiasts coming together to
                        celebrate the magic of storytelling.
                    </Typography>
                </Stack>
            </Box>


        </>
    );
}
