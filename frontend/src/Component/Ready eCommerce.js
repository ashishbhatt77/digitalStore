function ReadyeCommerce() {
    return ( 
        <>
            {/* First Section with Background Image */}
            <section 
                id="ReadyeCommerce"  
                className="bg-cover mt-2 bg-center bg-no-repeat text-center p-10" 
                style={{ backgroundImage: "url('bagriund e ready commerce.png')", width: "100%", height: "auto" }}
            >
                <img src="e-commrec.png" alt="Featured Image" className="px-lg-5 my-5 w-100"/>
                <h2 className="display-5 mb-4 text-white">
                    Boost Your Business With <span className="d-block text-primary fw-bold">Ready eCommerce</span>
                    The Key to Your Online Success
                </h2>
                <p className="mb-4 col-10 mx-auto">
                    Are you managing online stores and finding it challenging to keep everything efficient? Look no further.
                </p>
            </section>

            {/* Second Section without Background Image */}
            <section id="demo" className="container py-5 bg-white">
                <div className="text-center mb-5">
                    <h4 className="h1">A Total Package for You</h4>
                    <h1 className="mb-3">On <span className="text-primary fw-bold">Ready eCommerce</span></h1>
                    <p className="text-muted col-lg-7 mx-auto">
                        Ready eCommerce offers an all-in-one solution to handle all your online businesses from a single, user-friendly platform.
                    </p>
                </div>
                <div className="card product-card shadow-sm border-0 mb-3 animate__animated animate__fadeInUp wow">
                    <div className="row g-0">
                        <div className="col-lg-6">
                            <img src="/src/home/image/product/super_admin.png" className="img-fluid rounded w-100 h-100 cover-fit"/>
                        </div>
                        <div className="col-lg-6 d-flex px-4">
                            <div className="card-body p-4 my-auto">
                                <h3 className="card-title text-primary fw-bold mb-4">Super Admin Panel</h3>
                                <p className="card-text fs-5 free-text">
                                    Ready eCommerce is built using Vue.js, a progressive JavaScript framework known for its flexibility and performance. This ensures a responsive and dynamic user experience.
                                </p>
                                <a target="_blank" href="https://demo.readyecommerce.app/admin/login">
                                    <button className="custom-btn btn1 w-100">Explore Demo <i className="ri-arrow-right-line ms-2"></i></button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ReadyeCommerce;
