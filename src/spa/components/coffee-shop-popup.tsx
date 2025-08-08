import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


interface CoffeeShopPopupProps {
  popupInfo: {
    coordinate: number[];
    properties: any;
  };
  onClose: () => void;
}

const CoffeeShopPopup: React.FC<CoffeeShopPopupProps> = ({ popupInfo, onClose }) => {
  return (
    <Paper elevation={4} sx={{ transform: 'translateY(-8px)' }}>
      <Box sx={{ p: 2, minWidth: 220 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {popupInfo.properties.name || 'Coffee Shop'}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {popupInfo.properties.address && (
          <Typography variant="body2" sx={{ mb: 1 }}>{popupInfo.properties.address}</Typography>
        )}
        {popupInfo.properties.phone && (
          <Typography variant="body2" sx={{ mb: 1 }}>Phone: {popupInfo.properties.phone}</Typography>
        )}
        {popupInfo.properties.categories && (
          <Typography variant="body2" sx={{ mb: 1 }}>Categories: {popupInfo.properties.categories.join(', ')}</Typography>
        )}
        {popupInfo.properties.rank !== undefined && (
          <Typography variant="body2" sx={{ mb: 1 }}>Rank: {popupInfo.properties.rank + 1}</Typography>
        )}
        {popupInfo.properties.url && (
          <Typography variant="body2"><a href={popupInfo.properties.url} target="_blank" rel="noopener noreferrer">Website</a></Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CoffeeShopPopup;
