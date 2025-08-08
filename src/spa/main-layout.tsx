import { Outlet } from "react-router-dom";

import Box from '@mui/material/Box';

export default function MainLayout() {

    return (
        <Box component="main">
            <Outlet />
        </Box>
    );
}