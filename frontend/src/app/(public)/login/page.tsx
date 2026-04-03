"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/shared/auth-layout";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const loginMutation = useLogin();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <AuthLayout imageSrc="/assets/images/login.png">
        <div className="_social_login_left_logo _mar_b28">
            <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
        </div>
        <p className="_social_login_content_para _mar_b8">Welcome back</p>
        <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
        <button type="button" className="_social_login_content_btn _mar_b40">
            <img src="/assets/images/google.svg" alt="Image" className="_google_img" /> <span>Or sign-in with google</span>
        </button>
        <div className="_social_login_content_bottom_txt _mar_b40"> <span>Or</span>
        </div>
        <form className="_social_login_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
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
            </div>
            <div className="row">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                    <div className="form-check _social_login_form_check">
                        <input className="form-check-input _social_login_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                        <label className="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">Remember me</label>
                    </div>
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                    <div className="_social_login_form_left">
                        <p className="_social_login_form_left_para">Forgot password?</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                    <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className="_social_login_form_btn_link _btn1" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? "Logging in..." : "Login now"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="_social_login_bottom_txt">
                    <p className="_social_login_bottom_txt_para">Dont have an account? <Link href="/register">Create New Account</Link>
                    </p>
                </div>
            </div>
        </div>
    </AuthLayout>
  );
}