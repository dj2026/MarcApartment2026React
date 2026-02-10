# 🏠 PintApart - Gestor d'Apartaments (PRA01)

Aquesta és una aplicació de gestió d'apartaments desenvolupada amb **Springboot** + **H2** + **React**  + **axios**
 <br><br>**El projecte veurem:**<br>
- Home
- ApartmentList<br>
- ApartmentListView<br>
- Apartment Form + CRUD conectada amb h2<br>
- Data.js<br>
- (FALTA LA PART DE SPRINGBOOT) proximament....
**Llibreries**: <br>
- Sweetalert2<br>
- React-query<br>
- Axios<br>
- CSS
- Lucide React / Emoji Icons

## 🚀 Característiques
- ApartmentList: LListat dels apartments en format Cards en format Grid
- ApartmentListView: Visualització de tots els apartaments en unes Cards + Modal en format grid
- ApartmentForm: Formulari conectat a la base de dades H2 per veure les operacions CRUD + actualitzacions a totes les vistes <br>
  - **Create**: Afegir nous apartaments amb ID automatic.
  - **Revertir**: Desfer els Apartments nous i tornar a mostrar els apartment dins del data.js
  - **Update**: Modificar dades de l' apartament seleccionat
  - **Delete**: Esborrar registres amb confirmació de seguretat.

- **Interfície d'Usuari (UI)**: 
  - Disseny CSS personalitzat.
  - Alertes personalitzades elegants mitjançant llibreria **(SweetAlert2)**.
  - Cards que mostren els nostres apartments + Modal
  - Formulari per fer CRUD

## 🛠️ Tecnologies Utilitzades

- **React 19.2.0**: Biblioteca de la UI.
- **React-query 5.90.20**: Gestió de peticions API i memòria cau (Cache)
- **Vite**: Eina de construcció i servidor de desenvolupament ultra ràpid.
- **SweetAlert2**: Per a les alerts , notificacions, diàlegs de confirmació.
- **Lucide React / Emoji Icons**: Iconografia intuïtiva.
- **CSS Plain** :  Per donal estil propi a l'App

## 📂 Estructura del Projecte
<pre>
│   App.jsx   / home
│   index.css / estil per defecte vite
│   main.jsx  / createRoot
│
├───assets
│       react.svg /logo react
│
├───data
│       data.js /fitxer dels apartments
│          
│
├───styles
│       App.css  /estil ApartmentView
│       Form.css /estil ApartmentForm
│       List.css /estil ApartmentList
│       Nav.css  /estil Sidebar
│
└───view
        ApartmentForm.jsx
        ApartmentList.jsx
        ApartmentView.jsx
</pre>

## 📝 Informe de Decisions i Lògica Condicional
## 💰 1. Lògica de Preus
El sistema avalua l'estat inicial de l'objecte per decidir si ha d'intervenir en el preu.<br>
- Condició: if (this.price == null || this.price == 0L)<br>
- Decisió: Si el preu no s'ha definit manualment, el sistema "pren el control" i crida al mètode automàtic. Això garanteix que cap apartament quedi amb un valor de zero a la base de dades.<br><br>
| Atribut | Condició Lògica | Impacte Econòmic (Decisió) |
| :---: | :---: | :---: |
| **Superfície** | Valor base del càlcul | Àrea x 2.000 |
| **Habitacions** | Per cada unitat (`bedrooms`) | + 1.500 |
| **Banys** | Per cada unitat (`bathrooms`) | + 1.000 |
| **Aire Condicionat** | Si és igual a "yes" | + 5.000 |
| **Pàrquing** | Per cada plaça (`parking > 0`) | + 5.000 per unitat |
| **Mobiliari (Complet)** | Si és "furnished" | + 2.000 |
| **Mobiliari (Parcial)** | Si és "semi-furnished" | + 1.000 |
| **Mobiliari (Buit)** | Si és "unfurnished" | + 0 (Preu base) |
<br>

## 🏛️ 2. L'Estratègia d'Herència (@Inheritance) JPA

S'utilitza `@Inheritance(strategy=InheritanceType.SINGLE_TABLE)` per optimitzar la persistència:
- **Decisió:** Totes les classes fill comparteixen una única taula SQL.
- **Discriminador:** La columna `apartment_type` identifica cada tipus d'objecte.<br><br>

## 🖼️ 3. Render
La interfície es renderitza de manera condicional segons l'estat de l'objecte:<br>
- UI (React): La visualització a la pantalla canvia dinàmicament (ex: mostrar icones segons si el pis té pàrquing o no)<br>
- Nullable Check: El backend fa una comprovació if (this.price == null) per forçar el càlcul automàtic abans que arribi a la vista.<br>

## 🔌 4. API Endpoints (Backend)
És important documentar com es comuniquen el Front i el Back. Això ajuda a entendre la connexió amb Spring Boot.

| Mètode | Endpoint | Acció |
| :---: | :---: | :---: |
| **GET** | /api/apartments | Retorna la llista completa d'apartaments. |
| **POST** | /api/apartments | Crea un nou apartament (activa el càlcul de preu si és 0). |
| **PUT** | /api/apartments/{id} | Actualitza les dades d'un apartament existent. |
| **DELETE** | /api/apartments/{id} | Elimina un registre de la base de dades H2. |


## 📡 5. Flux de Dades (React Query)

- Caching: Les dades es mantenen en memòria per evitar peticions innecessàries al backend.
- Sincronització: Després d'un POST o DELETE, s'utilitza queryClient.invalidateQueries per refrescar la llista automàticament sense recarregar la pàgina.

## ⚙️ 6. Requisits i Instal·lació

- Java 17 o superior.<br> 
  - sudo apt install openjdk-17-jdk (Linux)
  - pàgina oficial d'Oracle (Windows)<br>

- Node.js (v18+) i npm.<br>
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` (Linux)
  - `https://github.com/coreybutler/nvm-windows/releases` (Windows)
  <br>
- Visual Studio Code / IntellijIdea<br>
  - sudo apt install code (Linux) / Si no el troba, baixa el paquet .deb de la web oficial i executa sudo dpkg -i fitxer.deb.
  - `https://code.visualstudio.com/` (Windows)<br>
 - Maven (opcional)<br>
    - sudo apt install maven (Linux)
    - `https://maven.apache.org/download.cgi` (Windows)
- npm
    - sudo apt install nodejs npm  (Linux)
    - winget install OpenJS.NodeJS (WIndows)
<br>
2. Configuración del Backend (Spring Boot)
El servidor utiliza una base de datos **H2** en memoria que no requiere instalación externa.<br><br>

1-Anar a `https://start.spring.io/`<br>
2-Project = Maven<br>
3-Language = Java 4.0.2 (actualment) en el nostre projecte hem utilitzat la 4.0.0<br>
4-Project Metadata = Modificar (Artifact) <br>
5-Packaging = Jar<br>
6-Configuration = Properties<br>
7-Java = 21<br>

- Dependencies:<br>
    - Spring Web<br>
    - Spring Data JPA<br>
    - Spring Boot DevTools<br>
    - Lombok<br>
    - Thyemleaf<br>
    - H2 Database<br>

## ✅ 7. Roadmap i Millores Futures
Per a futures versions, s'han planificat les següents millores basades en la lògica actual:
- Seguretat: Implementació de Spring Security per a la gestió d'apartments / users.<br>
- GoogleMaps: Integració amb serveis de gestió d'imatges al núvol.<br>

#### 📝 Configuració del Backend (`application.properties`)
Perquè la base de dades H2 funcioni correctament amb la consola web, s'ha utilitzat la següent configuració:
```properties
spring.application.name=MarcApartment
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:file:C:/Users/marcm/Desktop/MarcApartment/db/MarcApartment
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=dj
spring.datasource.password=dj

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=create-drop
server.port=8080
```

## 🧪8. Verificació ràpida
Un cop el backend està executant-se, pots verificar que l'API respon correctament anant a:
- **Llista JSON:** `http://localhost:8080/api/apartments/getAll`
- **Consola H2:** `http://localhost:8080/h2-console` <br>

---
## 👥 Autor

PINTAPART | Desenvolupat per **Marc Monfort** - PRA01 d'Arquitectura de Software / Desenvolupament Web. 04/02/2026
