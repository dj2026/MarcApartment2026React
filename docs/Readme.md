## 🏠 PintApart 2026 - Apartment Predictor & Locator
PintApart és una plataforma interactiva dissenyada per a la cerca, gestió i geolocalització de propietats immobiliàries a Barcelona. El sistema destaca per la seva capacitat de sincronització en temps real amb un backend Java i la seva visualització avançada de dades educatives.

## 1.📂 Arquitectura del Projecte (src/)
L'estructura segueix un patró modular per separar les vistes, la lògica de dades i els serveis d'API:

## 2. 🚀 Gestió de Dades i Mutations
`hooks/useApartmentMutations.js`: Aquest és el motor d'escriptura de l'app. Utilitza TanStack Query per gestionar les "mutacions" (POST per crear, PUT per editar i DELETE per esborrar), assegurant que la llista de pisos s'actualitzi automàticament sense haver de refrescar la pàgina.

`middleware/ApartmentApiService.jsx`: Actua com a pont Axios cap al backend (localhost:8080). Inclou la normalització de dades per garantir que els preus i superfícies arribin al servidor com a números i no com a text.

`context/ApartmentContext.jsx`: Centralitza l'estat global, com quin pis està seleccionat actualment o la llista completa descarregada.

## 3. 🖼️ Vistes i Interfície (view/)
`ApartmentList.jsx`: Llistat dinàmic que fusiona dades del backend amb coordenades GPS de data.js. Calcula distàncies reals mitjançant la fórmula de Haversine.

`MapView.jsx`: Implementació de Leaflet amb xinxetes personalitzades que mostren el logo de cada escola segons el color corporatiu.

`ApartmentForm.jsx`: Formulari intel·ligent per afegir noves propietats a la base de dades.

## 4. 🛠️ Estructura de Suport
`layout/Menu.jsx`: Controla la navegació lateral (Drawer) de Material UI.

`data/data.js`: Fitxer mestre amb la informació geogràfica de les escoles (Gravi, Palcam, etc.).

`styles/`: Fulls d'estil CSS modulars per a cada secció (Map, List, Nav).

## 5. ⚡ Funcionalitats Clau
`Cicle Complet CRUD`: Gràcies al hook de mutations, l'usuari pot afegir, modificar o eliminar pisos amb feedback visual immediat.

`Health Check de Connexió`: App.jsx verifica si el servidor Spring Boot està Online abans de carregar el contingut.

`Simulador de Càrrega`: Inclou un motor recursiu que escaneja l'arbre de fitxers visualment per a una experiència d'usuari tecnològica.

`Intel·ligència de Seus`: El mapa és capaç de desplegar múltiples seus per a una mateixa escola (com el cas de l'escola Gravi) de forma automàtica.

## 6. 🛠️ Stack Tecnològic
`Frontend`: React 18 + Vite.

`Estat i Mutations`: TanStack Query (React Query).

`Mapes`: Leaflet & React-Leaflet.

`UI`: Material UI (MUI) & Lucide Icons.

`Backend`: Java Spring Boot (Port 8080).

---
## 👥 Autor
PINTAPART | Desenvolupat per **Marc Monfort** 