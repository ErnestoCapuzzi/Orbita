# ÓRBITA · Un jardín de energía

Juego audiovisual de Ernesto Capuzzi. Fusioná tres esferas del mismo nivel,
descubrí nuevas frecuencias y creá tu propio jardín de luz.

Esta carpeta contiene el código completo de la versión móvil publicada:
HTML, CSS, JavaScript, Three.js incluido localmente y audio ambiental original.
No necesita compilación, npm, claves de API ni los servicios del sitio original.
Los tipos de letra se descargan de Google Fonts; si no hay conexión se usa la
fuente alternativa del sistema. El juego y el audio no dependen de un CDN.

## Probarlo en tu computadora (Windows / PowerShell)

1. Descomprimí el ZIP.
2. Abrí la carpeta `orbita` en tu editor.
3. Abrí PowerShell **dentro de esa carpeta** y ejecutá:

```powershell
py -m http.server 8000
```

4. Abrí http://localhost:8000 en el navegador.
5. Para detener el servidor, presioná Ctrl+C en PowerShell.

También podés hacer doble clic en `INICIAR_WINDOWS.bat`: mantiene el servidor
abierto en una ventana. Si no tenés Python, podés usar la extensión Live Server
de VS Code sobre `index.html`.

No abras el HTML con doble clic: los módulos JavaScript necesitan un servidor
HTTP. Para probar desde un iPhone en la misma red Wi-Fi, usá la dirección IP
local de tu computadora y el puerto 8000, si el firewall permite el acceso;
para compartirlo por Internet, usá GitHub Pages.

## Subirlo a GitHub y activar GitHub Pages

1. Creá un repositorio público, por ejemplo `orbita`.
2. Subí **todo el contenido de esta carpeta**, conservando `vendor` y `tests`.
   `index.html` debe quedar directamente en la raíz del repositorio.
3. En la interfaz web podés usar **Add file → Upload files** y arrastrar los
   archivos y las carpetas desde el Explorador de Windows. Subí los archivos
   descomprimidos, no el ZIP.
4. Guardá los cambios con **Commit changes**.
5. Abrí **Settings → Pages**.
6. En **Build and deployment → Source**, elegí **Deploy from a branch**.
7. Seleccioná la rama **main**, la carpeta **/(root)** y hacé clic en **Save**.
8. Esperá a que GitHub termine la publicación. El enlace se muestra en Pages.

Importante: `index.html`, `game.js`, `style.css` y la carpeta `vendor` deben
mantener la misma relación de carpetas. Ya usan rutas relativas compatibles
con un sitio alojado dentro de un repositorio de GitHub Pages.

Guía oficial:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Qué editar

| Archivo | Contenido |
| --- | --- |
| `index.html` | Interfaz, paneles, botones, mensajes y firma. |
| `style.css` | Diseño, colores y adaptación al celular. |
| `game.js` | Three.js, esferas, partículas, controles y audio. |
| `resonance.js` | Ocho capítulos, objetivos, movimientos y modo infinito. |
| `layout.js` | Cálculo del espacio de juego y tamaño de las esferas. |
| `ambient.wav` | Ambiente musical generado para este juego. |
| `vendor/three.module.js` | Three.js r170, incluido para no depender de un CDN. |
| `tests` | Verificaciones de objetivos y distribución. |

Después de editar, recargá el navegador. Si una actualización publicada no se
ve, probá una recarga completa; las referencias `?v=3` de `index.html` se pueden
incrementar para forzar la descarga de nuevas versiones del CSS y JavaScript.

## Controles

- Arrastrar: acercar una esfera a otras dos del mismo color y nivel.
- Fluir: crear libremente y sembrar más energía.
- Resonancia: completar capítulos, ganar estrellas y seguir en el infinito.
- Activar sonido: inicia la música desde un toque o clic.
- Respirar: mantener presionado para acompañar el pulso visual.
- Pausa: detener o reanudar el jardín. En computadora, también con la tecla P.
- Espacio, con el foco en la página: mantener para respirar.

## Audio y celulares

El sonido arranca al tocar el botón, nunca automáticamente al cargar. Incluye
un ambiente reproducido por un elemento de audio y notas sintetizadas por
Web Audio. Declara una sesión de reproducción cuando el navegador lo admite.
Si una llamada u otra app interrumpe el audio, volvé a tocar Reactivar.

El tablero se adapta a vertical y horizontal y reserva espacio para la
interfaz. Hay selección táctil ampliada y protección contra movimientos
accidentales. Si WebGL no está disponible, se usa un renderizador Canvas 2D.

## Guardado

Los descubrimientos, capítulos desbloqueados y estrellas se guardan en
`localStorage`, en ese navegador y en ese dominio. No se guardan en una cuenta
ni se sincronizan entre dispositivos. Al cambiar del sitio original a GitHub
Pages se empieza con un guardado independiente. El tablero en curso se
reinicia al recargar.

## Verificaciones (opcional)

Si tenés Node.js instalado, desde esta carpeta podés ejecutar:

```bash
node tests/resonance.mjs
node tests/layout.mjs
```

Comprueban que los objetivos puedan resolverse con las esferas disponibles y
que el cálculo del área de juego mantenga las esferas dentro de sus límites.
No reemplazan las pruebas visuales y de audio en dispositivos reales.

## Autoría y dependencias

Diseño del juego y firma: **e.capuzzi · Ernesto Capuzzi**.
No se ha aplicado una licencia abierta al código propio del proyecto.
La licencia de Three.js está en `vendor/LICENSE-threejs.txt` y se conserva su
aviso de autoría en el módulo. Las fuentes DM Sans y Manrope se solicitan a
Google Fonts mediante CSS y tienen sus propias licencias.
