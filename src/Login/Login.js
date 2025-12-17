import { Container, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Authapi from '../Authapi';
import WasteAccountantLogo from '../img/WasteAccountant_LOGO.png';  

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
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

        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const savedRemember = localStorage.getItem('remember') === 'true';

        if (savedRemember) {
            setEmail(savedEmail || '');
            setPassword(savedPassword || '');
            setRemember(savedRemember);
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

            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
            });

            return;
        }
        setErrors({});

        const item = { email, password, remember };
        try {
            const response = await Authapi.loginData(item);

            if (response.status === true) {
                const { token, user } = response;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('Token', token);

                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', password);
                    localStorage.setItem('remember', remember);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                    localStorage.removeItem('remember');
                }

                navigate("/Dashboard");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed...',
                    text: 'Email and password do not match!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to login. Please try again later.',
            });
            console.error('Failed to login:', error);
        }
    }

    return (
        <main className="py-4">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <div className="text-center">
                            <img src={WasteAccountantLogo} alt="My Image" height="100" width="300" />
                        </div>
                        <div className="row justify-content-center mt-5">
                            <div className="col-md-12 col-lg-10">
                                <div className="row wrap d-md-flex">
                                    <div className="col-6 img bg-dark hardik"></div>
                                    {/* <div className="col-6 login-wrap p-4 p-md-5"> */}
                                    <div className="col-6 login-wrap px-5">
                                        <div className="d-flex">
                                            <div className="w-100">
                                                <h3 className="mb-4">Sign In</h3>
                                            </div>
                                        </div>

                                        <form className="signin-form" onSubmit={submitform} autoComplete="on">
                                            <Container>
                                                <div className="form-group mb-3">
                                                    <TextField
                                                        label="Email"
                                                        type="email"
                                                        placeholder="Email"
                                                        name="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        autoComplete="email"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                    {errors.email && (
                                                        <p className='error-text'>{errors.email}</p>
                                                        // <p style={{ color: 'red' }}>{errors.email}</p>
                                                    )}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <TextField
                                                        label="Password"
                                                        type="password" 
                                                        placeholder="Password"
                                                        name="password"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        autoComplete="current-password"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                    {errors.password && (
                                                        <p className='error-text'>{errors.password}</p>
                                                        // <p style={{ color: 'red' }}>{errors.password}</p>
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
                                                    <input
                                                        className="form-check-input mx-2"
                                                        type="checkbox"
                                                        name="remember"
                                                        id="remember"
                                                        checked={remember}
                                                        onChange={e => setRemember(e.target.checked)}
                                                        // style={{ marginLeft: '2%' }}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <label className="checkbox-wrap checkbox-primary mb-0">
                                                        Remember Me
                                                    </label>
                                                </div>
                                                <div className="form-group d-md-flex">
                                                    <Link to="/ForgetPassword" className='text-center mx-2'>Forgot Password</Link>
                                                </div>
                                            </Container>
                                        </form>
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