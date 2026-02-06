# 🏠 PintApart - Gestor d'Apartaments (PRA01)

Aquesta és una aplicació de gestió d'apartaments desenvolupada amb **Springboot** + **H2** + **React**  + **axios**
 <br><br>**El projecte veurem:**<br>
- Home
- ApartmentList<br>
- ApartmentListView<br>
- Apartment Form + CRUD conectada amb h2<br>
- Data.js<br>

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
├───images
│       1.webp /apartment1
│       2.webp /apartment2
│       3.webp /apartment3
│       etc...
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
- Multimèdia: Integració amb serveis de gestió d'imatges al núvol.<br>

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

## 🔄 9. El diagrama del flux de dades (Visual)
React Query i un Backend amb lògica condicional, un diagrama ajuda molt a entendre què passa quan l'usuari prem "Guardar".

## 🔀 10. Diagrama de Flux: Lògica de Decisions

Aquest esquema representa com el sistema "pensa" i quines decisions pren segons l'estat de les dades que rep:

```text
                                                              Frontend
                                                                  │
                                                                  ▼
                                                    ┌──── ¿Té ID l'apartament? ───┐
                                                    │             │               │
                                                  [SÍ]           [NO]             │
                                                    │             │               │
                                                    ▼             ▼               ▼
                                              Mode UPDATE    Mode CREACIÓ     FORMULARI
                                              (Botó Update)  (Botó Create)    ( CRUD )
                                                    │             │               │
                                                    └─────────────┴┬──────────────┘
                                                                   │
                                                                   ▼
                                                        ¿El preu és 0 o NULL?
                                                    ┌──────────────┴──────────────┐
                                                   [SÍ]                          [NO]
                                                    │                             │
                                                    ▼                             ▼
                                              CÀLCUL AUTOMÀTIC               MANTENIR PREU
                                              (Backend Logic)               (Dada d'usuari)
                                          ┌─────────┴─────────┐                   │
                                          │ 1. Àrea * 2000    │                   │
                                          │ 2. + Extres       │                   │
                                          │ 3. Bonus Mobles   │                   │
                                          └─────────┬─────────┘                   │
                                                    │                             │
                                                    ▼                             │
                                            VERIFICACIÓ FINAL <───────────────────┘
                                                    │
                                                    ▼
                                                  (JPA) ─► SINGLE_TABLE (H2)
                                                    │
                                                    ▼
                                    ┌───────¿Èxit en la Query? ─────┐
                                    │               │               │
                                  [SÍ]             [NO]             │
                                    │               │               │
                                    ▼               ▼               ▼
                                Invalid. Cache  Alerta Error   SweetAlert2
                                (React Query)   (Red Pop-up)   (Feedback UI)
```
## 🌐 11. Configuració de CORS
Per permetre que el frontend (Vite) es comuniqui amb el backend (Spring Boot), s'ha configurat una política de CORS al controlador o en una configuració global:

- **Origen permès:** `http://localhost:5173`
- **Mètodes:** `GET, POST, PUT, DELETE`

## 📂 12. Dades de Prova (data.js)

L'aplicació utilitza un fitxer de dades inicials anomenat `data.js`. Aquest fitxer conté un array d'**Objectes Literals** de JavaScript que serveixen per alimentar la interfície abans de fer la connexió definitiva amb el Backend.

### Estructura de l'Objecte
A diferència del model estricte del Backend, aquests objectes inclouen camps per a la interacció social (reviews):

```javascript
export const Apartments = [
  {id: 1, name: "Apartment", price: 2217000, review:"Increïble apartament al centre de la ciutat ⭐⭐⭐⭐⭐" ,reviewer: "Marc"},
  {id: 2, name: "Duplex", price: 4024000 ,review:"Dúplex amb vistes al mar i molta llum ⭐⭐⭐⭐⭐", reviewer: "Marc"},
  {id: 3, name: "House", price: 2015000, review:"Casa rústica ideal per a famílies ⭐⭐⭐⭐", reviewer: "Marc"},
  ];
```

## ⚠️ 13. Possibles Problemes (Troubleshooting)
- **Port 8080 ocupat:** Si ja tens un altre servei funcionant, canvia el port a `application.properties` amb `server.port=8081`.<br> 
- **Dades no s'actualitzen:** Si el CRUD no refresca la vista, verifica que la `queryKey` de React Query coincideix entre la petició i la inactivació (`invalidateQueries`).
- **H2 Console Buida:** Recorda que H2 en memòria s'esborra cada cop que reinicies el servidor backend.<br> 
- **CRUD NO FUNCIONA!** <br> Recargar home i anar a ApartentList, ApartmentListView i tornar a ApartmentForm i ja podras fer les operacions CRUD.<br>
## 🏗️ 14. Modelització del Tipus d'Apartament

S'ha dissenyat per ser coherent en totes les capes de l'aplicació, assegurant que la identitat de l'immoble es mantingui des de la base de dades fins a la interfície d'usuari.

### A. Capa de Persistència (JPA / Hibernate)
S'ha optat per una estratègia de **Taula Única** (`SINGLE_TABLE`), que és la més eficient per a aquest volum de dades:

* **Estructura:** Totes les variants d'apartaments (Apartment, Duplex, House) resideixen en la mateixa taula física a **H2**.
* **Columna Discriminadora:** S'utilitza l'atribut `property_type` com a principal. Aquesta columna decideix quina classe o identitat s'assigna a cada fila quan Spring Boot recupera la informació.
* **Benefici:** S'eviten els `JOINs` complexos entre taules, permetent consultes de lectura ultra ràpides.



### B. Capa de Lògica de Negoci (Spring Boot)
En el backend, el tipus d'apartament actua com a eix central per a la **Lògica Condicional**:

  - Atribut : `propertyType` (String/Enum).<br>
  - Funció de Negoci :** Aquest camp és el que permetrà especialitzar el mètode `calcularPreuAutomatic()`. 
  - *Exemple de decisió:* Si el tipus és "Penthouse", el sistema podria aplicar un multiplicador de luxe sobre el preu base per m².

### C. Capa de Presentació (React)
  - Seguretat de Tipus:** En lloc d'un `string` obert, s'utilitza:
    `type PropertyType = 'Apartment' | 'Duplex' | 'House'.`<br>
  - Rendició de la UI:** La interfície "es rendeix" al tipus d'apartament:
  - Si es selecciona "Apartment/Duplex o House ", la UI Obre el Modal per tindre mes informació.
  - Cada tipus pot tenir una icona visual específica a les Cards del llistat.<br>

### D. L'estratègia SINGLE_TABLE (JPA)
Per a aquest projecte s'ha triat l'estratègia d'herència `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`. Aquesta decisió es basa en els següents motius:

- Taula Única a SQL: Tots els apartaments, independentment de si són d'un tipus o d'un altre (per exemple: Estudi, Àtic o Casa), s'emmagatzemen en una única taula anomenada `apartments` a la base de dades H2.
- Columna Discriminadora: S'utilitza una columna especial (per defecte `DTYPE` o personalitzada com `apartment_type`) que indica a quin tipus d'objecte correspon cada fila.
- Eficiència: Aquesta estratègia és la més ràpida en l'execució de consultes (lectures i cerques), ja que no requereix fer unions (`JOINs`) entre múltiples taules.

### 🧩 Disseny de l'Objecte
L'entitat ha estat dissenyada seguint el patró **POJO (Plain Old Java Object)** i utilitzant **Lombok** per mantenir un codi net:

- **Atributs Comuns**: Tots els apartaments comparteixen les propietats base (àrea, habitacions, banys, aire condicionat, pàrquing).
- **Flexibilitat**: Aquest disseny permet que, si en un futur es volen afegir característiques específiques per a un tipus d'apartament concret, la base de dades sigui fàcil d'estendre sense canvis estructurals complexos.<br>

## 📊 15. Resum de la Modelització
  | Component | Tècnica Aplicada | Objectiu Principal |
  | :---: | :---: | :---: |
  | **Base de Dades** | `@Inheritance(SINGLE_TABLE)` | Simplicitat i velocitat SQL.          |
  | **Backend**       | Discriminador de Classe      | Centralització de regles de negoci.   |
  | **Frontend**      | TypeScript Literal Types     | Validació robusta en el formulari.    |


### 💡 Justificació del Model
- **Taula Única** perquè permet una escalabilitat horitzontal senzilla. Si en el futur volem afegir un nou tipus de propietat (ex: 'Loft'), només cal afegir el valor al discriminador sense haver de modificar l'esquema de la base de dades, mantenint la integritat del sistema de càlcul automàtic."

## 🧩 16. Principals Reptes i Solucions
- Durant el desenvolupament de **PintApart**, m'he trobat diversos desafiaments tècnics que han requerit decisions arquitectòniques específiques:

#### 1. Sincronització de la UI amb la Base de Dades
* **Repte:** Després de fer CRUD, la llista d'apartaments no es mostrava automàticament al frontend sense recarregar la pàgina.
* **Solució:** S'ha implementat **React Query** amb el mètode `invalidateQueries`. Això permet que el sistema decideixi automàticament quan la informació de la memòria cau ha quedat obsoleta i forci un refresc invisible per a l'usuari.

#### 2. Gestió de Preus Buits o Nuls
* **Repte:** Evitar que es guardessin apartaments amb preu 0 a la base de dades quan l'usuari oblidava omplir el camp.
* **Solució:** Es va crear un mètode de **càlcul condicional** al backend. El sistema avalua si el preu és nul o zero i, en cas afirmatiu, activa l'algorisme de predicció basat en les característiques (m², habitacions, extres).

#### 3. Comunicació entre Ports (CORS)
* **Repte:** El navegador bloquejava les peticions d'Axios perquè el Frontend (5173) i el Backend (8080) estaven en ports diferents.
* **Solució:** Es va configurar una política de **Cross-Origin Resource Sharing (CORS)** a Spring Boot mitjançant l'anotació `@CrossOrigin`, permetent exclusivament les peticions des de l'URL de desenvolupament de Vite.

#### 4. Persistència de Tipus d'Apartament
* **Repte:** Com guardar diferents tipus de propietats en una base de dades relacional sense complicar l'estructura de taules.
* **Solució:** S'ha aplicat l'estratègia `@Inheritance(strategy=InheritanceType.SINGLE_TABLE)`, utilitzant una columna **Discriminadora** que optimitza la velocitat de lectura a H2.<br>

## 🎭 17. Experiència d'Usuari i Feedback Visual
Aquest apartat descriu els efectes i les sensacions que l'aplicació transmet a l'usuari gràcies a la integració de les llibreries de frontend i la lògica del backend.

### 🛠️ Funcionalitat dels Botons amb SweetAlert2
L'objectiu és que cada acció de l'usuari tingui una resposta visual clara que confirmi l'estat de l'operació.

 -  CREATE <br> 
    - Acció de l'usuari: Prem "Create".<br>
    - Procés: S'envia la petició POST al backend. Si el servidor respon amb un codi 201 o 200, es dispara el nou apartment/duplex/house.

    - Resultat visual: Un Swal amb icon: "Creat"

 -  UPDATE = Acció de l'usuari: Prem "Actualitzar".<br>
    - Procés: Petició PUT cap a l'API.

    - Resultat visual: Una petita notificació tipus Toast  indicant "Tria un pis de la llista" per modificar el contingut

-  DELETE ⚠️ Acció de l'usuari: Prem la icona de la paperera.<br>
    - Resultat visual: S'obre un Swal amb title: "Registre esborrat del sistema".



### B. Fluïdesa de Dades (React Query)
- L'efecte principal és la sensació d'una Single Page Application (SPA) realment ràpida:

- Actualització Invisible: Gràcies a invalidateQueries, la llista d'apartaments es refresca automàticament en segon pla després de cada operació CRUD. 
- L'usuari veu els canvis a l'instant sense que la pantalla parpellegi o es recarregui.

- Estats de Càrrega: S'evita la incertesa; mentre el backend processa la petició, la UI pot mostrar indicadors de càrrega per mantenir l'usuari informat.

#### C. Visualització Dinàmica a les Cards
- Les targetes de la ApartmentListView canvien segons les dades:

- Iconografia Condicional: Mitjançant Lucide React, si un apartament té parking > 0, apareix la icona del vehicle. Si l'aire condicionat és "no", la icona pot desaparèixer o mostrar-se ratllada.

- Impacte del Preu: Els apartaments on el preu ha estat calculat automàticament (perquè l'usuari va deixar el camp a 0) es poden identificar visualment, ressaltant el valor afegit de la lògica de negoci del backend.

---
## 👥 Autor
PINTAPART | Desenvolupat per **Marc Monfort** - PRA01 d'Arquitectura de Software / Desenvolupament Web. 04/02/2026