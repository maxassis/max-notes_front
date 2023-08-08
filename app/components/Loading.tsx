import Lottie from "lottie-react";
import loading from "../images/loading.json";




export default function Loading() {

    return (
        <div style={{inlineSize: "70px"}}>
            <Lottie animationData={loading} />
        </div>
    )
} 


