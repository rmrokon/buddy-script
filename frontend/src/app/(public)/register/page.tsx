"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/shared/auth-layout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const registerMutation = useRegister();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        const { confirmPassword, ...data } = values;
        registerMutation.mutate(data, {
            onSuccess: () => {
                router.push("/login");
            },
        });
    };

    return (
        <AuthLayout imageSrc="/assets/images/registration.png">
            <div className="_social_login_left_logo _mar_b28 text-center">
                <Image src="/assets/images/logo.svg" alt="BuddyScript" className="_left_logo" width={140} height={40} />
            </div>
            <p className="_social_login_content_para _mar_b8">Get Started Now</p>
            <h4 className="_social_login_content_title _titl4 _mar_b50">Registration</h4>
            <button type="button" className="_social_login_content_btn _mar_b40">
                <Image src="/assets/images/google.svg" alt="Google" className="_google_img" width={20} height={20} /> <span>Register with google</span>
            </button>
            <div className="_social_login_content_bottom_txt _mar_b40"> <span>Or</span>
            </div>
            <form className="_social_login_form" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">First Name</label>
                            <input 
                                type="text" 
                                className={`form-control _social_login_input ${errors.firstName ? 'is-invalid' : ''}`}
                                {...register("firstName")}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Last Name</label>
                            <input 
                                type="text" 
                                className={`form-control _social_login_input ${errors.lastName ? 'is-invalid' : ''}`}
                                {...register("lastName")}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Email</label>
                            <input 
                                type="email" 
                                className={`form-control _social_login_input ${errors.email ? 'is-invalid' : ''}`}
                                {...register("email")}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Password</label>
                            <input 
                                type="password" 
                                className={`form-control _social_login_input ${errors.password ? 'is-invalid' : ''}`}
                                {...register("password")}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Repeat Password</label>
                            <input 
                                type="password" 
                                className={`form-control _social_login_input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                        <div className="form-check _social_login_form_check">
                            <input className="form-check-input _social_login_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                            <label className="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">I agree to terms & conditions</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                            <button type="submit" className="_social_login_form_btn_link _btn1" disabled={registerMutation.isPending}>
                                {registerMutation.isPending ? "Registering..." : "Register now"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">Already have an account? <Link href="/login">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
