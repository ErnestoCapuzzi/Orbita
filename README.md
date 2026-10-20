[README.md](https://github.com/user-attachments/files/33743947/README.md)
<div align="center">

# ÓRBITA

### Un jardín de energía

**Soltá el ruido. Encontrá tu órbita.**

Un juego audiovisual que transforma pequeñas conexiones en luz, movimiento y música.

[Jugar ÓRBITA](https://orbita-jardin-erni.capuzzi.chatgpt.site) · [Inicio rápido](#inicio-rápido) · [Publicar en GitHub Pages](#publicar-en-github-pages)

**Three.js · JavaScript · Web Audio · Diseño adaptable**

Creado por **Ernesto Capuzzi — e.capuzzi**

</div>

---

## La experiencia

ÓRBITA es un espacio para jugar a otro ritmo. Esferas de cristal flotan en un jardín de luz: al acercar tres del mismo color y nivel, se fusionan y dan lugar a una nueva frecuencia.

La propuesta combina una mecánica sencilla con una estética oscura, reflejos iridiscentes, partículas y música que responde a las conexiones. Podés explorar libremente o recorrer una serie de desafíos breves.

### Dos formas de entrar en órbita

| Modo | Experiencia |
| :--- | :--- |
| **Fluir** | Un jardín abierto, sin reloj ni derrota. Fusioná esferas, sembrá energía y experimentá a tu ritmo. |
| **Resonancia** | Ocho capítulos con objetivos y movimientos limitados. Conseguí estrellas, desbloqueá el recorrido y continuá con desafíos infinitos. |

## Características

- **Cinco frecuencias:** Bruma, Pulso, Aurora, Prisma y Cosmos.
- **Fusiones en cadena** con ondas de luz y partículas.
- **Cristal e iridiscencia:** reflejos, velos de aurora y estelas suaves.
- **Audio reactivo:** notas sintetizadas y un ambiente musical en bucle.
- **Progresión local:** capítulos, mejores estrellas y descubrimientos guardados en el navegador.
- **Controles para mouse y pantallas táctiles**, con distribución vertical y horizontal.
- **Pausa y respiración visual**, para acompañar el ritmo del juego.
- **Renderizado alternativo con Canvas 2D** cuando WebGL no está disponible.

## Cómo jugar

1. Elegí **Fluir** o **Resonancia**.
2. Arrastrá una esfera junto a **otras dos del mismo color y nivel**.
3. Soltala para fusionar las tres y crear una esfera nueva.
4. Prepará conexiones cercanas para provocar fusiones en cadena.
5. Tocá **Activar sonido** si querés acompañar la partida con música.

En Resonancia, los objetivos cuentan **las esferas creadas durante el capítulo**. Al completarlos, podés pasar al siguiente desafío o repetir para mejorar tus estrellas.

### Controles

| Acción | Mouse o pantalla táctil | Teclado |
| :--- | :--- | :--- |
| Mover una esfera | Arrastrar y soltar | — |
| Agregar esferas en Fluir | **Sembrar energía** | — |
| Activar o desactivar el audio | Botón de sonido | — |
| Acompañar el pulso de respiración | Mantener **Respirar** | Mantener `Espacio`, con el foco en la página |
| Pausar o reanudar | Botón de pausa | `P` |
| Reiniciar el jardín o capítulo | Botón de reinicio | — |
| Elegir un capítulo desbloqueado | **Recorrido**, en Resonancia | — |

## Inicio rápido

El proyecto es una aplicación estática. **No necesita npm, compilación, claves de API ni un servidor de aplicaciones.** Solo requiere servir sus archivos por HTTP.

### Windows · PowerShell

Descomprimí el proyecto, abrí PowerShell dentro de la carpeta que contiene `index.html` y ejecutá:

```powershell
py -m http.server 8000
```

Abrí **[http://localhost:8000](http://localhost:8000)** en el navegador.

También podés ejecutar `INICIAR_WINDOWS.bat`, incluido en el paquete. Para detener el servidor, presioná `Ctrl+C` en su ventana.

### macOS o Linux

Desde la misma carpeta, con Python 3 instalado:

```bash
python3 -m http.server 8000
```

Abrí **[http://localhost:8000](http://localhost:8000)**.

> Usá un servidor local. Abrir `index.html` directamente mediante `file://` puede impedir la carga de los módulos JavaScript.

## Publicar en GitHub Pages

El paquete ya utiliza rutas relativas para funcionar dentro de un repositorio de GitHub Pages.

1. Creá un repositorio público para el proyecto.
2. Subí **el contenido de la carpeta `orbita`**, conservando sus subcarpetas. Subí los archivos descomprimidos, no el ZIP.
3. Comprobá que `index.html` esté en la **raíz del repositorio**, al mismo nivel que `game.js`, `style.css` y `vendor`.
4. Guardá los archivos con **Commit changes**.
5. Abrí **Settings → Pages**.
6. En **Build and deployment → Source**, seleccioná **Deploy from a branch**.
7. Elegí la rama **main**, la carpeta **/(root)** y presioná **Save**.
8. Cuando termine la publicación, GitHub mostrará el enlace en esa sección.

**No hace falta una carpeta `docs` con esta configuración.**

Referencia: [Configurar la fuente de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Estructura del proyecto

| Archivo o carpeta | Responsabilidad |
| :--- | :--- |
| `index.html` | Interfaz, textos, controles y paneles. |
| `style.css` | Identidad visual, animaciones y diseño adaptable. |
| `game.js` | Escena, esferas, efectos, interacciones, audio y estado de la partida. |
| `resonance.js` | Capítulos, objetivos, movimientos, estrellas y desafíos infinitos. |
| `layout.js` | Conversión del área disponible y cálculo del tamaño de las esferas. |
| `ambient.wav` | Ambiente musical de 16 segundos reproducido en bucle. |
| `vendor/three.module.js` | Three.js r170, incluido localmente. |
| `vendor/LICENSE-threejs.txt` | Licencia de la dependencia Three.js. |
| `tests/` | Comprobaciones de los desafíos y del cálculo de distribución. |
| `INICIAR_WINDOWS.bat` | Inicio del servidor local en Windows mediante Python. |
| `.nojekyll` | Archivo para servir el proyecto sin procesamiento de Jekyll. |

### Personalización

- **Colores, materiales y efectos:** `TYPES`, los materiales y las funciones de renderizado en `game.js`.
- **Diseño y adaptación móvil:** reglas y variables de `style.css`.
- **Niveles y dificultad:** `CHAPTERS` y `getChapter()` en `resonance.js`.
- **Textos y firma:** `index.html`.
- **Música ambiental:** `ambient.wav`; conservá el nombre o actualizá su referencia en el HTML.

Después de editar, recargá el navegador. Para actualizaciones publicadas, podés incrementar las referencias `?v=3` de CSS y JavaScript en `index.html` si necesitás invalidar su caché.

## Sonido y dispositivos móviles

El audio se activa mediante un toque o clic. La implementación combina **Web Audio** para las notas y un **elemento de audio independiente** para el ambiente musical. Cuando está disponible, declara una sesión de reproducción.

Si el sonido se interrumpe al cambiar de aplicación o recibir una llamada, volvé al juego y tocá **Reactivar**. Si no se escucha, revisá el volumen multimedia y probá abrir el enlace directamente en Safari.

El área jugable reserva espacio para los controles y objetivos. La selección táctil está ampliada y los pequeños movimientos involuntarios no consumen un turno.

**Compatibilidad verificada:** distribución visual en formatos de 390 × 844, 375 × 667 y 844 × 390; además, pruebas de cálculo para otros tamaños. La reproducción se comprobó en el navegador de prueba. Estas verificaciones no equivalen a una certificación de todos los dispositivos ni a una prueba de audio en un iPhone físico.

## Guardado y privacidad

El juego conserva en `localStorage`:

- Los elementos descubiertos.
- Los capítulos desbloqueados.
- Las mejores estrellas obtenidas.
- El capítulo seleccionado para continuar el recorrido.

El guardado pertenece a **ese navegador y ese dominio**. No requiere una cuenta y no se sincroniza entre dispositivos. Publicar una copia en GitHub Pages crea un espacio de guardado independiente del sitio original.

La posición de las esferas y la partida en curso se reinician al recargar. Borrar los datos del sitio también elimina el progreso local.

## Verificaciones del proyecto

Con Node.js instalado, ejecutá desde la raíz:

```bash
node tests/resonance.mjs
node tests/layout.mjs
```

| Comprobación | Alcance |
| :--- | :--- |
| Resonancia | Resolución de los ocho capítulos y las primeras 24 etapas infinitas con los recursos disponibles; validación de estrellas y datos de progreso. |
| Distribución | Conversión de coordenadas y límites de las esferas en cinco tamaños de pantalla. |

Los ocho capítulos y una etapa infinita también se completaron mediante interacción en el navegador durante el desarrollo. Las pruebas automatizadas complementan la revisión visual y de audio; no la sustituyen.

## Solución de problemas

| Situación | Qué revisar |
| :--- | :--- |
| La página no carga al abrir el HTML | Iniciá un servidor local y accedé mediante `http://localhost:8000`. |
| GitHub Pages muestra un error o una página distinta | Confirmá **main → /(root)** y la presencia de `index.html` en la raíz. |
| Faltan esferas, estilos o sonido | Comprobá que se hayan subido `vendor`, los módulos JavaScript, el CSS y `ambient.wav`. |
| No aparece una modificación reciente | Probá una recarga completa y revisá las versiones de los recursos en `index.html`. |
| El progreso parece haberse perdido | Verificá que estés usando el mismo navegador y dominio, y que no se hayan borrado los datos locales. |
| No está disponible WebGL | El juego utiliza el renderizado alternativo con Canvas 2D. |

## Tecnologías y dependencias

**HTML5 · CSS3 · JavaScript con módulos ES · Three.js r170 · Web Audio API · Canvas 2D · localStorage**

Three.js y el archivo de audio se incluyen en el proyecto. Las fuentes **DM Sans** y **Manrope** se solicitan a Google Fonts; si no están disponibles, se utilizan las fuentes alternativas del sistema.

## Autoría y licencias

**Ernesto Capuzzi**  
**e.capuzzi · creative playground**

El proyecto explora la relación entre juego, arte generativo y sonido, con una identidad visual centrada en el movimiento suave, el cristal y la luz.

El código propio no incluye una licencia de distribución abierta. Three.js conserva su aviso de autoría y su licencia MIT en `vendor/LICENSE-threejs.txt`. Las tipografías mantienen sus respectivas licencias.

---

<div align="center">

**ÓRBITA · Hecho para desconectar.**

</div>
