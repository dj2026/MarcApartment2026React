export const Apartments = [
  {id: 1,name: "Apartment", propertyType: "Apartment",
    schools: [{id: "1", name: "Escola Gravi", lat: 41.4185, lng: 2.1420,schoolType: "Concertada", educationLevel: "Tots els nivells", logo: "/src/images/gravi.png", web: "https://www.gravi.com/",
        seus: [
          {id: 1, nom: "Infantil", lat: 41.418395, lng: 2.140711, adreça: "Av. de Vallcarca, 217"},
          {id: 2, nom: "Primària", lat: 41.420219, lng: 2.140792, adreça: "Av. de Vallcarca, 258"},
          {id: 3, nom: "Secundària", lat: 41.420769, lng: 2.138893, adreça: "Carrer de Jericó, 5"}
        ]
      }
    ]
  },
  
  {id: 2, name: "Duplex", propertyType: "Duplex",
    schools: [{id: "2",name: "Escola Palcam",lat: 41.410943,lng: 2.172281,address: "Carrer de Castillejos , 361",schoolType: "Concertada", educationLevel: "Tots els nivells",logo: "/src/images/palcam.jpg",web: "https://www.palcam.cat/"}]
  },

  {id: 3,name: "House", propertyType: "House",
    schools: [{id: "3",name: "Escola Paideia", lat: 41.387781,lng: 2.139475, address: "Carrer de Montnegre, 20",schoolType: "Privada", educationLevel: "Educació Especial",logo: "/src/images/paideia.jpg",web: "https://www.paideia.cat/"}]
  }
];