"use client";

import React from "react";
import Image from "next/image";

export const AuthLayout = ({ children, imageSrc }: { children: React.ReactNode, imageSrc: string }) => {
    return (
        <section className="_social_login_wrapper _layout_main_wrapper">
            <div className="_shape_one">
                <Image src="/assets/images/shape1.svg" alt="" className="_shape_img" width={300} height={300} />
                <Image src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" width={300} height={300} />
            </div>
            <div className="_shape_two">
                <Image src="/assets/images/shape2.svg" alt="" className="_shape_img" width={300} height={300} />
                <Image src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" width={300} height={300} />
            </div>
            <div className="_shape_three">
                <Image src="/assets/images/shape3.svg" alt="" className="_shape_img" width={300} height={300} />
                <Image src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" width={300} height={300} />
            </div>
            <div className="_social_login_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_login_left">
                                <div className="_social_login_left_image" style={{ position: "relative", width: "100%", minHeight: "400px" }}>
                                    <Image src={imageSrc} alt="Image" className="_left_img" fill style={{ objectFit: "contain" }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_login_content">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
