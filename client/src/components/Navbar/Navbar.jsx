import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

export default function Navbar() {
    return (
        <Sheet color="primary" variant="soft" style={{

            height: "20px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection:"row",
            alignItems: "center",
            padding: "20px"
        }}>


                <Button>Book Haven</Button>


            <div style={{display:"flex",gap:20}}>
                <Button>Sign Up!</Button>
                <Button variant="outlined">Login</Button>
            </div>



        </Sheet>
    );
}
