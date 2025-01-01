import { Container, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Authapi from '../Authapi';

function Login() {
    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const expiredMessage = localStorage.getItem('tokenExpired');
        if (expiredMessage) {
            Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Your session has expired. Please login again.',
            });
            localStorage.removeItem('tokenExpired');
        }

        if (localStorage.getItem('Token')) {
            if (window.location.pathname !== "/") {
                navigate("/Dashboard");
            }
        }
    }, [navigate]);

    async function submitform(e) {
        e.preventDefault();

        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const item = { email, password };
        const response = await Authapi.loginData(item);

        if (response.status === true) {
            const { token, user } = response;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('Token', token);
            navigate("/Dashboard");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login failed...',
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
                                            <Container>
                                                <div className="form-group mb-3">
                                                    <TextField
                                                        label="Email"
                                                        type="email"
                                                        placeholder="Email"
                                                        name="email"
                                                        onChange={e => setemail(e.target.value)}
                                                        fullWidth
                                                    />
                                                    {errors.email && (
                                                        <p style={{ color: 'red' }}>{errors.email}</p>
                                                    )}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <TextField
                                                        label="Password"
                                                        type="password"
                                                        placeholder="Password"
                                                        name="password"
                                                        onChange={e => setpassword(e.target.value)}
                                                        fullWidth
                                                    />
                                                    {errors.password && (
                                                        <p style={{ color: 'red' }}>{errors.password}</p>
                                                    )}
                                                </div>

                                                <div className="form-group">
                                                    <Button
                                                        type="submit"
                                                        className="btn bg-primary rounded submit w-100"
                                                    >
                                                        Sign In
                                                    </Button>
                                                </div>

                                                <div className="form-group d-md-flex">
                                                    <div className="w-50 text-left">
                                                        <label className="checkbox-wrap checkbox-primary mb-0">
                                                            Remember Me
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="remember"
                                                                id="remember"
                                                                style={{ marginLeft: '2%' }}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                    <div className="w-50 text-md-right">
                                                        <Link to="/ForgetPassword">Forgot Password</Link>
                                                    </div>
                                                </div>
                                            </Container>
                                        </form>

                                        <p className="text-center">
                                            Not a member?{' '}
                                            <a data-toggle="tab" href="#signup">Sign Up</a>
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
