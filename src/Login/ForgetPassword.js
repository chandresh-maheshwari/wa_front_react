import { useState } from "react";
import { TextField, Button, Grid, Container } from "@mui/material";
import Authapi from "../Authapi";
import { useNavigate } from 'react-router-dom';


const ForgetPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setNewPassword] = useState("");
    const [password_confirmation, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();
    // const [formData,setFormData] = useState({
    //     email:'',
    //     otp:'',
    //     password:'',
    //     email:'',


    // })

    const handleSend = async () => {
        if (!email) {
            setEmailError("Email is required.");
            return;
        }
        setEmailError("");

        try {
            const response = await Authapi.forgetSendotp({ email });
            // console.log(response.status);          
            if (response.status) {
                setStep(2);
            }

        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const handleVerify = async () => {
        if (!otp) {
            setOtpError("OTP is required.");
            return;
        }
        setOtpError("");

        try {
            const response = await Authapi.forgetverifyotp({ otp, email });
            if (response.status) {
                setStep(3);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    const handleReset = async () => {
        if (!password) {
            setPasswordError("New password is required.");

            return;

        }
        if (password !== password_confirmation) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        setPasswordError("");
        setConfirmPasswordError("");

        try {
            const response = await Authapi.forgeresetpass({ email, otp, password, password_confirmation });
            if (response.status) {
                navigate('/');
            }
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    };

    return (
        <main className="py-4">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-10">
                        <div className="text-center">
                            <h4 className="mt-5">Forget Password</h4>
                        </div>

                        <div className="row justify-content-center mt-5">
                            <div className="col-md-12 col-lg-10">
                                <div className="row wrap d-md-flex">
                                    <div className="col-6 img bg-dark hardik"></div>

                                    <div className="col-6 login-wrap p-4 p-md-5">
                                        <form className="signin-form">
                                            <Container>
                                                <Grid container spacing={3}>

                                                    {step === 1 && (
                                                        <>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Email"
                                                                    type="email"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                    fullWidth
                                                                    margin="normal"
                                                                    error={!!emailError}
                                                                    helperText={emailError}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Button
                                                                    type="button"
                                                                    className="btn bg-primary text-white w-100"
                                                                    onClick={handleSend}
                                                                >
                                                                    Send OTP
                                                                </Button>
                                                            </Grid>
                                                        </>
                                                    )}
                                                    {console.log(step)}
                                                    {step === 2 && (
                                                        <>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="OTP"
                                                                    type="text"
                                                                    value={otp}
                                                                    onChange={(e) => setOtp(e.target.value)}
                                                                    required
                                                                    fullWidth
                                                                    margin="normal"
                                                                    error={!!otpError}
                                                                    helperText={otpError}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Button
                                                                    type="button"
                                                                    className="btn bg-primary mt-5 text-white w-100"
                                                                    onClick={handleVerify}
                                                                >
                                                                    Verify OTP
                                                                </Button>
                                                            </Grid>
                                                        </>
                                                    )}

                                                    {step === 3 && (
                                                        <>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="New Password"
                                                                    type="password"
                                                                    value={password}
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                    required
                                                                    fullWidth
                                                                    margin="normal"
                                                                    error={!!passwordError}
                                                                    helperText={passwordError}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Confirm Password"
                                                                    type="password"
                                                                    value={password_confirmation}
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                    required
                                                                    fullWidth
                                                                    
                                                                    error={!!confirmPasswordError}
                                                                    helperText={confirmPasswordError}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Button
                                                                    type="button"
                                                                    className="btn bg-primary mt-5 text-white w-100"
                                                                    onClick={handleReset}
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </Grid>
                                                        </>
                                                    )}
                                                    <Grid item xs={12}>
                                                        <Button
                                                            type="button"
                                                            className="btn w-100"
                                                            onClick={() => navigate('/')}>
                                                            Login
                                                        </Button>
                                                    </Grid>

                                                </Grid>
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
};

export default ForgetPasswordForm;
