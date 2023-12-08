import { useSelector } from "react-redux";
// import { url } from "../slices/api";

const PaymentPage = ({ }) => {
    const user = useSelector((state) => state.user.user);

    const handleCheckout = () => {

    };

    return (
        <>
            <button onClick={() => handleCheckout()}>Check out</button>
        </>
    );
};

export default PaymentPage;