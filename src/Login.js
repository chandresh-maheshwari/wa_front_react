import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


function Login() {
    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (localStorage.getItem('User-Agent')) {
            navigate("./Dashboard");
        }
    }, []);

    async function submitform(e) {
        e.preventDefault();

        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        let item = { email, password };
        let result = await fetch('http://wafront.localhost.com/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(item)
        });

        result = await result.json();

        if (result.status == true) {
            localStorage.setItem("user-info", JSON.stringify(result));
            // await Swal.fire({
            //     icon: 'success',
            //     title: 'Success',
            //     text: 'Login successfully!',
            // });
            navigate("/Dashboard");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email and password do not match!',
            });
        }
    }

    return (
        <main className="py-4">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <div className="text-center">
                            <h4 className="mt-5">Login Form</h4>
                        </div>
                        <div className="row justify-content-center mt-5">
                            <div className="col-md-12 col-lg-10">
                                <div className="row wrap d-md-flex">
                                    <div className="col-6 img bg-dark hardik"></div>

                                    <div className="col-6 login-wrap p-4 p-md-5">
                                        <div className="d-flex">
                                            <div className="w-100">
                                                <h3 className="mb-4">Sign In</h3>
                                            </div>
                                        </div>
                                        <form className="signin-form" onSubmit={submitform}>
                                            <div className="form-group mb-3">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Username"
                                                    className="form-control"
                                                    name="email"
                                                    onChange={e => setemail(e.target.value)}
                                                />
                                                {errors.email && (
                                                    <p style={{ color: "red" }}>{errors.email}</p>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    className="form-control"
                                                    name="password"
                                                    onChange={e => setpassword(e.target.value)}
                                                />
                                                {errors.password && (
                                                    <p style={{ color: "red" }}>{errors.password}</p>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <button
                                                    type="submit"
                                                    onClick={submitform}
                                                    className="form-control btn btn-primary rounded submit px-3"
                                                >
                                                    Sign In
                                                </button>
                                            </div>

                                            <div className="form-group d-md-flex">
                                                <div className="w-50 text-left">
                                                    <label
                                                        className="checkbox-wrap checkbox-primary mb-0"
                                                    >
                                                        Remember Me
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="remember"
                                                            id="remember"
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                                <div className="w-50 text-md-right">
                                                    <a href="http://wafront.localhost.com/password/reset">
                                                        Forgot Password
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                        <p className="text-center">
                                            Not a member?{' '}
                                            <a data-toggle="tab" href="#signup">
                                                Sign Up
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
        </main>
    );
}

export default Login;
