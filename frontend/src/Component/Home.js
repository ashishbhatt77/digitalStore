import React from "react";
import Slider from "./Slider";
import { DealsOffers, TrendingGadgets } from "./DealsOffers";  
import Testimonials from "./Testimonials";
import DigitalProducts from "./DigitalProducts";



function Home() {
    return ( 
        <>
            
            <Slider />
            <DigitalProducts/>   
            <DealsOffers />
            <TrendingGadgets /> 
            <Testimonials/> 
      
           
        </>
     );
}

export default Home;
