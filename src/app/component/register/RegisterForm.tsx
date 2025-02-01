import { Divider, TextField, Typography, Button, Stack } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useState, ChangeEvent, FormEvent } from 'react';
import Success from '../shared/Success';
import Error from '../shared/Error';

interface IRegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const RegisterForm = () => {
    const [registerationData, setRegisterationData] = useState<IRegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoogleRegister = () => {
        window.location.href = backendUrl+'auth/google';
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(backendUrl+'auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(registerationData),
            });

            const data = await response.json();
            if (response.ok) {
                setIsSuccess(true);
                setMessage('Registration Successful!');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);

            } else {
                setIsSuccess(false);
                setMessage(data.message || 'Registration Failed! Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setIsSuccess(false);
            setMessage('Network error! Please try again.');
        }
    };

    return (
        <Stack bgcolor="#fff" padding={2}>
            {/* Rest of your JSX remains the same */}
            <Typography variant="h5" fontWeight="bold" color="secondary">
                Get Started With Waitly
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" marginBottom={1}>
                Please provide your details to join the Waitly community and stay informed.
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack direction="column" spacing={1}>
                    <TextField
                        label="First Name"
                        size="small"
                        color="secondary"
                        name="firstName"
                        value={registerationData.firstName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Last Name"
                        size="small"
                        color="secondary"
                        name="lastName"
                        value={registerationData.lastName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Email"
                        size="small"
                        type="email"
                        color="secondary"
                        name="email"
                        value={registerationData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        size="small"
                        color="secondary"
                        name="password"
                        value={registerationData.password}
                        onChange={handleInputChange}
                    />

                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        type="submit"
                    >
                        Register Now
                    </Button>

                    <Divider>
                        <Typography variant="subtitle2">OR</Typography>
                    </Divider>

                    <Button
                        size="large"
                        variant="outlined"
                        color="error"
                        startIcon={<Google />}
                        fullWidth
                        onClick={handleGoogleRegister}
                    >
                        Continue With Google
                    </Button>
                </Stack>
            </form>

            {isSuccess !== null && (
                isSuccess ?
                    <Success IsOpen={true} message={message} /> :
                    <Error IsOpen={true} message={message} />
            )}
        </Stack>
    );
};

export default RegisterForm;