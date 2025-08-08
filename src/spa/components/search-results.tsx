import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { HomeAddressResource, NeighborhoodResource } from '../resources';

interface Props {
  address: HomeAddressResource;
  neighborhood: NeighborhoodResource;  
  onReset: () => void;
}

export default function SearchResults({ address, neighborhood, onReset }: Props) {
  return (
    <Paper elevation={3} sx={{ position: 'absolute', top: 20, right: 20, p: 2, width: 400, zIndex: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ lineHeight: 1.5 }}>Search Results</Typography>
        <IconButton size="small" onClick={onReset}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 1 }}>Your Location:</Typography>
      <Chip
        icon={<LocationOnIcon />}
        label={address.formattedAddress || 'Unknown address'}
        variant="outlined"
        sx={{ mt: 0.5, mb: 1 }}
      />

      <Typography variant="subtitle2" sx={{ mt: 1 }}>Your Neighborhood:</Typography>
      <Typography variant="body2">{neighborhood.name || 'Unknown neighborhood'}</Typography>
      {neighborhood.description && <Typography variant="caption">{neighborhood.description}</Typography>}
    </Paper>
  );
}