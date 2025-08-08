import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CoffeeIcon from '@mui/icons-material/Coffee';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchDialog({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Dialog
      open
      slotProps={{
        paper: {
          sx: { minWidth: 300, textAlign: 'center', padding: "0 24px 24px 24px" },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "42px", fontFamily: 'Lobster, cursive', textAlign: 'center' }}>
          Boston Coffee
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Search Address"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 350 }}
          />
          <Button type="submit" variant="contained" title="Search" sx={{ height: '54px' }}>
            <CoffeeIcon sx={{ fontSize: 28 }} />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
