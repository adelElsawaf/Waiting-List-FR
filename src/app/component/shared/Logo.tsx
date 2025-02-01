import { Typography, Stack } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/system';

const Logo = () => {
    return (
        <Box component={Link} href="/" sx={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <AlarmIcon color="secondary" fontSize="large" />
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fontStyle="italic"
                    color="textPrimary"
                >
                    WAITLY
                </Typography>
            </Stack>
        </Box>

    );
};

export default Logo;
