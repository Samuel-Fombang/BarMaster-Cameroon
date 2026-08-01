import { Box, Typography } from "@mui/material";

function Drinks() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Drinks Management
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        This module will be built next.
      </Typography>
    </Box>
  );
}

export default Drinks;