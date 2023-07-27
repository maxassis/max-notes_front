import Lottie from "lottie-react";
import loading from "../images/loading.json";


export default function CardLoading() {
    return (
     <div className="cardLoading">   
        <Lottie animationData={loading} />
    </div>       
    )
}