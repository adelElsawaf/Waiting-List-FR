import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Error = ({ IsOpen = false, message = "Operation successful!" }) => {
    return (
        <Snackbar
            autoHideDuration={6000}
            open={IsOpen}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <MuiAlert
                severity="error"
                iconMapping={{
                    error: <CheckCircleIcon fontSize="inherit" />,
                }}
                sx={{
                    width: '100%',
                    borderRadius: '4px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Error;
