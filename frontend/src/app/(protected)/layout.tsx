"use client";

import React from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { RightSidebar } from "@/components/shared/right-sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, isHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && !accessToken) {
            router.replace("/login");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated || !accessToken) {
        return null;
    }

    return (
        <div className="_layout _layout_main_wrapper">
            <Navbar />
            <div className="_main_layout">
                <div className="container _custom_container">
                    <div className="_layout_inner_wrap">
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <LeftSidebar />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="_layout_middle_wrap">
                                    <div className="_layout_middle_inner">
                                        {children}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <RightSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
