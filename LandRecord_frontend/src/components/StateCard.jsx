import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";

export default function BasicCard(props) {
  return (
    <Card 
      component={Link} 
      to={props.link} 
      sx={{ 
        minWidth: "13rem",
        height:"7rem", 
        color: '#142423',
        textDecoration: "none",
        cursor: "pointer"
      }}
    >
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 20 }}>
          {props.name}
        </Typography>
        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Typography variant="h5" sx={{ fontSize: 30 }}>
            {props.stats}
          </Typography>
          <props.icon sx={{ color: props.iconColor, fontSize: 35 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
