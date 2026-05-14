### 1. `useMemo` (Optimització de Càlculs)

L'utilitzes principalment al fitxer del mapa (`MapView.jsx` o `App.jsx` segons el teu codi) per generar els **markers**.

-   **Per què?**: Generar la llista de marcadors (especialment si has de fer un `flatMap` per les seus de l'escola Gravi) és un procés que no vols repetir cada vegada que el component es torni a renderitzar per un motiu aliè (com obrir el menú).
    
-   **Funció**: Només recalcula la llista de marcadors quan canvia la `selectedProperty`. Si no canvia el pis, React "recorda" els marcadors anteriors i estalvia feina al processador.
    

### 2. `useRef` (Referència Persistent i Cancel·lació)

El fas servir a `App.jsx` per gestionar el cicle de vida de les peticions de xarxa i l'estat del muntatge.

-   **`isMounted`**: L'utilitzes per saber si el component encara està a la pantalla. Això evita l'error típic de "canviar l'estat d'un component desmuntat" si una petició de xarxa triga massa.
    
-   **`abortRef`**: Guarda una referència al `AbortController`. Si l'usuari tanca l'aplicació mentre s'està comprovant el backend, el `useRef` permet cancel·lar la petició immediatament per no deixar processos penjats.
    

### 3. `useContext` (Estat Global)

Ho utilitzes a través de `ApartmentProvider` per envoltar tota l'aplicació.

-   **Per què?**: Tens dades (com la llista de pisos o el pis seleccionat) que necessiten tant la llista (`ApartmentList`) com el mapa (`MapView`).
    
-   **Funció**: Evita el "Prop Drilling" (passar dades de pare a fill durant molts nivells). Amb el context, qualsevol component "s'hi connecta" i agafa el que necessita directament del magatzem central.
    

----------

### 4. `useCallback` (Estabilitat de Funcions)

L'utilitzes per a les funcions `motorRecursiu` i `iniciarApp`.

-   **Per què?**: Aquestes funcions es passen com a dependències en diversos `useEffect`. Sense `useCallback`, React creuria que la funció és "nova" cada vegada que el component es renderitza, provocant un bucle infinit de càrrega.
    
-   **Funció**: Memoritza la definició de la funció perquè sigui estable entre renderitzats.
    

### 5. `useState` (Gestió d'Estats Reactius)

És el Hook més visible a la teva app per controlar el que veu l'usuari en cada moment:

-   **Navegació**: `veure` (per saber si estem a la llista, al formulari o al mapa).
    
-   **Interfície**: `menu` (per obrir/tancar el Drawer) i `pas` (comprovant, loading, app, error).
    
-   **Progrés**: `percentatge`, `fitxerActual` i `carpetaActual` per a l'animació de càrrega.
    

### 6. `useEffect` (Efectes Secundaris)

És l'encarregat de disparar accions basades en canvis al sistema:

-   **Al carregar**: Dispara `iniciarApp()` per comprovar la connexió amb el backend de Java només un cop en obrir la web.
    
-   **Al Mapa**: El component `MapController` utilitza un `useEffect` per detectar quan canvien les coordenades (`center`) i moure la càmera del mapa automàticament.


### 7. `useApartmentMutations` (Custom Hook)

Aquest no ve "de sèrie" amb React, sinó que l'has creat tu (o està definit al teu projecte) per agrupar la lògica de modificació de dades.

-   **Per què?**: Per no haver d'escriure la lògica de "crear pis" o "esborrar pis" en cada component.
    
-   **Funció**: Encapsula les crides `POST`, `PUT` i `DELETE` cap al backend. Permet que, quan afegeixes un pis nou al formulari, l'estat global s'actualitzi automàticament.
    

### 8. `useMap` (de la llibreria `react-leaflet`)

L'utilitzes dins del component `MapController`.

-   **Per què?**: Leaflet és una llibreria externa que no "parla" React de forma nativa.
    
-   **Funció**: Aquest hook permet que el teu component tingui accés directe a la instància real del mapa de Leaflet. Sense ell, no podries utilitzar ordres com `map.setView()` per moure la càmera quan l'usuari clica en un pis de la llista.
    

### 9. `useQuery` i `useMutation` (de `@tanstack/react-query`)

Tot i que no els veus directament als fitxers de vistes, són els que fan funcionar `ApartmentApiService` i `useApartmentMutations`.

-   **`useQuery`**: S'encarrega de demanar la llista de pisos al Java (`GET`). Gestiona automàticament el "Loading" i el "Cache" (si ja has demanat els pisos un cop, no els torna a demanar si no cal).
    
-   **`useMutation`**: És el que realment executa els canvis. Té una funció molt potent anomenada `onSuccess`: quan el Java et diu "pis guardat correctament", aquest hook avisa a tota l'app perquè refresqui la llista.
    

### 10. `useCallback` (Memoització de funcions)

Encara que ja n'hem parlat, a `App.jsx` és vital per al `motorRecursiu`.

-   **Per què?**: En ser una funció que s'executa dins d'un `useEffect`, si no la "congelessis" amb `useCallback`, cada vegada que el percentatge de càrrega pugés un **1%**, la funció es tornaria a definir, creant un bucle i