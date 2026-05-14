import React from 'react';
import { Drawer } from '@mui/material';
import { Home, List, LayoutGrid, PlusCircle, MapPin } from 'lucide-react';

const MenuDrawer = ({ isOpen, onClose, setVeure }) => {
  const menuItems = [
    {label:"Home",icon:<Home size={24}/>,val:"home"},
    {label:"Apartment List",icon:<List size={24}/>,val: "list"},
    {label:"Apartment View",icon:<LayoutGrid size={24}/>,val:"view"},
    {label:"Apartment Form",icon:<PlusCircle size={24}/>,val:"form"},
    {label:"Mapa",icon:<MapPin size={24}/>,val:"map"}
  ];

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} PaperProps={{sx: {backgroundColor: "#0f0f0fdb", color: "#fff", width: 300, borderLeft: "2px solid #00ff00"}}}>
      <div style={{padding: "50px 30px"}}>
        <h2 style={{fontWeight: "900", letterSpacing: "4px", borderBottom: "2px solid #00ff00",paddingBottom: "15px", marginBottom: "40px", color: "#00ff00"}}>Menú</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {menuItems.map(item => (
              <li key={item.val} onClick={() => {onClose(); setVeure(item.val);}}
                style={{display: "flex",alignItems: "center", gap: "20px", padding: "18px", marginBottom: "20px",cursor: "pointer", borderRadius: "10px", transition: "0.3s ease", border: "1px solid transparent"}}
                onMouseEnter={e => {e.currentTarget.style.background = "rgba(0, 255, 0, 0.1)"; e.currentTarget.style.border = "1px solid #00ff00";}}
                onMouseLeave={e => {e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent";}}>{item.icon}
                <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Drawer>
  );
};

export default MenuDrawer;