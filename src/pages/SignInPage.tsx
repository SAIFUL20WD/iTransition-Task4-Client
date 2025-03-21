import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { userLogin } from "../api/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setToken } from "../utility/tokenHelper";
import { useState } from "react";

const SignInPage = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().email("Invalid email address").required("Email is Required"),
			password: Yup.string()
				.min(1, "Minimum 1 character required")
				.max(20, "Must be 20 characters or less")
				.required("Password is Required"),
		}),
		onSubmit: async (values) => {
			try {
				toast.loading("Signing In", { id: "signin" });
				const res = await userLogin(values);
				if (res.status === 200) {
					toast.dismiss("signin");
					setToken(res?.data?.token);
					toast.success(res?.data?.message, { id: "signin" });
					navigate("/");
				}
			} catch (error) {
				toast.dismiss("signin");
				toast.error(error?.response?.data?.message);
			}
		},
	});
	return (
		<section className="vh-100">
			<Toaster />
			<div className="container-fluid">
				<div className="row align-items-center">
					<div className="col-sm-6 text-black">
						<div className="px-5 ms-xl-4">
							<span className="h1 fw-bold mb-0 text-primary text-uppercase">The App</span>
						</div>

						<div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
							<form style={{ width: "30rem" }} onSubmit={formik.handleSubmit}>
								<small className="text-secondary fs-5">Start your journey</small>
								<h3
									className="fs-3 fw-semibod mb-3 pb-3 text-capitalize"
									// style={{ letterSpacing: "1px" }}
								>
									Sign in to the app
								</h3>

								<div className="mb-4">
									<div data-mdb-input-init className="form-floating input-group">
										<input
											type="email"
											id="email"
											className="form-control form-control-lg"
											aria-label="email"
											aria-describedby="mail-icon"
											// placeholder="name@exmaple.com"
											onChange={formik.handleChange}
											value={formik.values.email}
										/>
										<span className="input-group-text" id="mail-icon">
											<MdEmail size={20} />
										</span>

										<label className="form-label" htmlFor="email">
											E-mail
										</label>
									</div>
									{formik.touched.email && formik.errors.email ? (
										<small className="text-danger">{formik.errors.email}</small>
									) : null}
								</div>

								<div className="mb-4">
									<div data-mdb-input-init className="form-floating input-group">
										<input
											type={`${isPasswordVisible ? "text" : "password"}`}
											id="password"
											className="form-control form-control-lg"
											aria-label="password"
											aria-describedby="eye-icon"
											// placeholder="password"
											onChange={formik.handleChange}
											value={formik.values.password}
										/>
										<span
											className="input-group-text"
											id="eye-icon"
											onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										>
											{isPasswordVisible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
										</span>
										<label className="form-label" htmlFor="password">
											Password
										</label>
									</div>
									{formik.touched.password && formik.errors.password ? (
										<small className="text-danger">{formik.errors.password}</small>
									) : null}
								</div>

								<div className="my-3">
									<input
										className="form-check-input"
										type="checkbox"
										value=""
										id="flexCheckDefault"
									/>
									<label className="form-check-label ms-2" htmlFor="flexCheckDefault">
										Remember me
									</label>
								</div>

								<div className="pt-1 mb-4">
									<button
										data-mdb-button-init
										data-mdb-ripple-init
										className="btn btn-primary btn-lg form-control"
										type="submit"
									>
										Sign In
									</button>
								</div>

								<div className="d-flex justify-content-between mt-5">
									<p>
										Don't have an account? <Link to={"/signup"}>Sign Up</Link>
									</p>
									<p className="small mb-5 pb-lg-2 ms-1">
										<a href="#">Forgot password?</a>
									</p>
								</div>
							</form>
						</div>
					</div>
					<div className="col-sm-6 px-0 d-none d-sm-block">
						<img
							src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
							alt="Login image"
							className="w-100 vh-100"
							style={{ objectFit: "cover", objectPosition: "left", opacity: 0.5 }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignInPage;
