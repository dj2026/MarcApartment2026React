import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Grid, Typography, Box, CircularProgress, Card, CardContent, CardMedia, Divider, Fade, Button } from '@mui/material';
import { BedDouble, Ruler, SquareParking, Home } from "lucide-react";

const ApartmentMuiPagination = () => {
  const [llistaPisos, setLlistaPisos] = useState([]);
  const [totsElsPisos, setTotsElsPisos] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [page, setPage] = useState(1);

  const categories = {1: {type: "APARTMENT", label: "Apartment"}, 2: {type: "DUPLEX", label: "Duplex"}, 3: {type: "HOUSE", label: "House"}};

  const carregarDades = useCallback(async (numPagina, silent = false) => {
    if (!silent) setCarregant(true);
    try {
      const filtreTipus = categories[numPagina].type;
      
      const [resPaginada, resTotal] = await Promise.all([axios.get(`http://localhost:8080/api/apartment/paginated`, {params: { page: 0, size: 12, type: filtreTipus}}),axios.get(`http://localhost:8080/api/apartment/list`)]);

      setLlistaPisos(resPaginada.data.content || []);
      setTotsElsPisos(resTotal.data || []);
      
    } catch (error) {console.error("Error carregant dades:", error); } finally {if (!silent) setCarregant(false);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { 
    carregarDades(page); 
    const interval = setInterval(() => carregarDades(page, true), 5000);
    return () => clearInterval(interval);
  }, [page, carregarDades]);

  const getStats = (catType) => {if (!totsElsPisos.length) return {properties: 0, schools: 0};
    
    const filtrats = totsElsPisos.filter(p => {
      const pType = (p.propertyType || p.type || "").toUpperCase();
      return pType === catType.toUpperCase();
    });

    return {properties: filtrats.length, schools: filtrats.reduce((acc, pis) => acc + (pis.schools?.length || 0), 0)};
  };
  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      
      <Box sx={{ width: '350px', bgcolor: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <Box sx={{ pt: 5, pb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#ff4081',letterSpacing: 1, marginTop:"250px"}}>PROPIETATS</Typography>
          <Box sx={{ width: '40px', height: '4px', bgcolor: '#ff4081', borderRadius: 2, mt: 1 }} />
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, display: 'flex', flexDirection: 'column', gap: 5,marginBottom:'150px'}}>
          {Object.keys(categories).map((key) => {
            const cat = categories[key];
            const isActive = page === parseInt(key);
            const stats = getStats(cat.type);

            return (
              <Button key={key} onClick={() => setPage(parseInt(key))} 
                sx={{width: '100%', justifyContent: 'center', flexDirection: 'column', py: 2, borderRadius: '15px', textTransform: 'none', transition: '0.3s all ease', 
                  bgcolor: isActive ? 'rgba(255, 64, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',border: isActive ? '2px solid #ff4081' : '1px solid rgba(255,255,255,0.1)', 
                  color: isActive ? '#ff4081' : '#e2e8f0','&:hover': { bgcolor: 'rgba(255, 64, 129, 0.15)', borderColor: '#ff4081'}}}>
                <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.5 }}>{cat.label}</Typography>
                
                <Box sx={{ display: 'flex', gap: 1.5, opacity: 0.8 }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Home size={12} /> {stats.properties} Prop.</Typography>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>🎓 {stats.schools} School(s)</Typography>
                </Box>
              </Button>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 5 }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, pb: 2, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 1, textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {categories[page].label}
          </Typography>
          <Box sx={{ width: '60px', height: '4px', bgcolor: '#ff4081', borderRadius: 2, mx: 'auto' }} />
        </Box>

        {carregant ? (<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{ color: '#ff4081' }} /></Box>
        ) : (
          <Fade in={!carregant}>
            <Grid container spacing={4} columns={12}>
              {llistaPisos.map((pis) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pis.id}>
                  <Card sx={{ bgcolor: 'rgba(37, 37, 37, 0.7)', backdropFilter: 'blur(5px)', color: 'white', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
                    <CardMedia component="img" image={`/src/images/${pis.id}.webp`} onError={(e) => {if (!e.target.src.includes("unsplash")) {e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80";}}} 
                      sx={{ 
                        height: '220px', 
                        width: '100%',  
                        objectFit: 'cover', 
                        objectPosition: 'center', 
                        borderRadius: '24px 24px 0 0'
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="900">{pis.propertyType}</Typography>
                      <Box display="flex" gap={10} my={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#cbd5e1' }}><BedDouble size={18}/> {pis.bedrooms}</Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#cbd5e1' }}><Ruler size={18}/> {pis.area}m²</Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#cbd5e1' }}><SquareParking size={18}/> {pis.parking}</Box>
                      </Box>
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                      <Typography variant="h6" sx={{ color: '#ff4081', fontWeight: 900 }}>{pis.price?.toLocaleString()} €</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default ApartmentMuiPagination;