import React from "react";
import Slider from "./Slider";
import { DealsOffers, TrendingGadgets } from "./DealsOffers";  


function Home() {
    return ( 
        <>
            <Slider />
            <DealsOffers />
            <TrendingGadgets />  
           
        </>
     );
}

export default Home;
