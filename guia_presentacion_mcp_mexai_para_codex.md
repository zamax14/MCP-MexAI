# Brief creativo y guion para Codex — MexAI: MCP sin reinventar la rueda

> **Tu tarea (Codex):** utiliza este documento como guion editorial para **crear una presentación editable** sobre Model Context Protocol (MCP). La prioridad es contar una historia entretenida y técnicamente correcta, no llenar diapositivas de definiciones. El ponente improvisará sobre las ideas: coloca los detalles, analogías y chistes propuestos en **notas del presentador** (o en un archivo `speaker_notes.md` si el formato elegido no admite notas). En las diapositivas, deja solo titulares, ejemplos breves y visuales claros.

## Objetivo y audiencia

La charla es para **MexAI Community**. Asistirán personas que nunca han oído hablar de MCP, desarrolladores que ya usan agentes y asistentes que han utilizado conectores sin saber que se relacionan con este ecosistema.

**Objetivo:** que todos entiendan *qué problema resuelve MCP*, cómo encaja junto a LLM, RAG y agentes, qué puede exponer un servidor MCP y cómo aprovecharlo sobre **sistemas que ya existen**. Los participantes técnicos deben llevarse una arquitectura realista y una pequeña demostración con Python/FastMCP.

**Idea fuerza:** «MCP no apareció porque fuera imposible conectar agentes a herramientas, sino porque estábamos cansados de construir el mismo puente una y otra vez».

**Arco narrativo:** LLM encerrado → RAG le pasa documentos → el agente recibe herramientas → caos de integraciones → MCP ofrece una interfaz común → exponemos un sistema interno → lo conectamos al chat habitual → demo.

**Duración orientativa:** 30–40 minutos de charla, más preguntas; ajustar a la duración real de la sesión. La demo merece más tiempo que el catálogo de proveedores. Si se necesita reducir, combinar diapositivas adyacentes; **no sacrificar el problema de integraciones ni la distinción entre herramientas y MCP**.

## Dirección visual y tono

- **Formato:** 16:9, editable, limpio y de lectura inmediata a distancia. Una idea por diapositiva. Titulares con personalidad; no copiar los párrafos de este documento a la pantalla.
- **Estilo:** caricaturesco, cálido y con referencias a la vida de oficina. Humor sobrio, sarcástico por momentos, reconocible para quien haya desarrollado software o sufrido un sistema institucional. No convertir cada diapositiva en un meme.
- **Paleta sugerida:** morado de la sudadera del avatar, azul de MexAI, crema/blanco, grises oscuros; acentos amarillos para descubrimientos o remates. Evitar estética cyberpunk, brillos neón y saturación visual.
- **Avatar recurrente:** si se incluyen los recursos originales, usa **el mismo personaje** en toda la presentación: chibi chaparrito y *ligeramente chubby* (no exagerar), sudadera morada, cabello oscuro corto/despeinado, lentes negros, pantalón cargo negro y tenis oscuros. Ilustración 2D de trazos definidos, colores planos y sombreado mínimo. PNG con **fondo transparente real**, sin halos ni borde blanco. Reutiliza las imágenes existentes siempre que estén disponibles; no inventes nuevos rasgos ni generes manos adicionales.
- **Portada:** el avatar del ponente abrazado **de lado, como amigos**, al personaje azul con sombrero de MexAI; **no** abrazando el logo circular ni con lenguaje corporal romántico. Si existe la ilustración ya aprobada, reutilizarla.
- **Analogías recurrentes:** cuarto cerrado, papeles bajo la puerta, escritorio con herramientas, espagueti de integraciones, enchufe común. Hacer que el público reconozca la misma historia a lo largo de la charla.
- **Humor:** deja cada broma como una posibilidad en notas; el presentador elige cuáles decir. Da espacio para pausar después de los remates.
- **Material:** si hay un directorio de assets, inspecciónalo y utiliza los avatares/logo originales. Si faltan, coloca un marcador descriptivo en lugar de sustituirlos por imágenes ajenas. No utilizar fotos de personas reales como sustitutos.

---

# Secuencia propuesta, diapositiva por diapositiva

Cada ficha contiene **EN PANTALLA** (lo que ve el público), **VISUAL** y **NOTAS** (lo que el ponente podría decir, no texto para proyectar). Los chistes son opcionales y no deben competir con la idea técnica.

## ACTO I — Ya tenemos inteligencia; ¿qué le falta?

### 01. Portada — «MCP: deja de reinventar la rueda»

**EN PANTALLA:** `Model Context Protocol` · subtítulo: `De los LLM a conectar nuestros propios sistemas` · nombre del ponente · MexAI Community.

**VISUAL:** avatar morado con el personaje azul de MexAI, abrazados de lado como colegas. Composición espaciosa.

**NOTAS:** presentación breve: quién soy, qué construyo y por qué MCP me interesa como desarrollador. Abrir con la promesa de una demo real.

**REMATE OPCIONAL:** «Tranquilos: MCP no es otro modelo, y de momento tampoco es una criptomoneda».

### 02. Encuesta — «¿Quién sabe qué es MCP?»

**EN PANTALLA:** cuatro opciones grandes: `Lo uso` · `Me suena` · `¿El qué?` · `Creo que lo uso y no sabía`.

**VISUAL:** avatar con micrófono, mirando a la audiencia; mucho espacio vacío.

**NOTAS:** pedir que levanten la mano. El objetivo es que los principiantes no se sientan perdidos y los expertos entiendan que llegarás también a arquitectura y código.

**REMATE:** «La idea es que al final los de “¿el qué?” puedan conversar con los de “lo uso”… y que los de “lo uso” no se duerman».

### 03. El LLM — «Una enciclopedia encerrada en un cuarto»

**EN PANTALLA:** `Sabe muchísimo ≠ tiene acceso a todo`.

**VISUAL:** el avatar sentado dentro de un cuarto simple, rodeado de libros, sin ventanas ni computadora. No mostrar un robot futurista.

**NOTAS:** «Imaginen a alguien que leyó una cantidad absurda de información y luego fue encerrado. Puede responder y razonar a partir de lo aprendido, pero no puede ver el estado de nuestros sistemas ni consultar automáticamente lo que ocurrió hoy». Es una analogía: los modelos y aplicaciones reales pueden tener capacidades adicionales, pero un LLM *por sí solo* no tiene esos accesos.

### 04. Su primer problema — «¿Cuánto vendimos ayer?»

**EN PANTALLA:**

> **Usuario:** «¿Cuánto vendimos ayer?»  
> **LLM:** «Basándome en patrones históricos de empresas similares…»

**VISUAL:** el avatar de los libros respondiendo muy seguro, mientras aparece un gran signo de interrogación sobre una hoja de ventas.

**NOTAS:** distinguir conocimiento aprendido de información actual y privada. No prometer que todo error se soluciona con búsqueda.

**REMATE:** «No, campeón. Te pregunté cuánto vendimos *ayer*, no cuánto crees que vende una empresa de mi signo zodiacal».

### 05. RAG — «Pásale los papeles por debajo de la puerta»

**EN PANTALLA:** `Pregunta → recuperación → contexto relevante → respuesta`.

**VISUAL:** puerta cerrada; alguien le pasa hojas/reportes **por debajo**; el avatar dentro las recibe. Retomar la estética de la slide 03.

**NOTAS:** explicar *Retrieval-Augmented Generation*: recuperamos fragmentos relevantes de una fuente externa y se los aportamos al modelo como contexto. Eso permite respuestas basadas en documentos privados o actualizables **sin volver a entrenar** el modelo. La precisión depende de la recuperación y del contenido.

**REMATE:** «Descubrimos que pasarle los papeles correctos era bastante más razonable que reentrenarlo cada martes».

### 06. Ya sabe qué hacer… — «Pero ¿puede hacerlo?»

**EN PANTALLA:** `“Perfecto. Ahora crea el ticket y manda el reporte.”` → `…`

**VISUAL:** el avatar detrás de la puerta, con los reportes ya leídos, mirando sus manos vacías.

**NOTAS:** RAG aporta información; por sí solo no equivale a un sistema que ejecuta acciones. Hacer una pausa para que el público note el siguiente problema.

**REMATE:** «Hasta aquí tenemos al compañero que sabe exactamente cómo hacer tu trabajo… y te manda un tutorial».

### 07. Agentes — «Le dimos cuerpo al cerebro»

**EN PANTALLA:** `LLM: decide` · `Sistema agente: coordina` · `Tools: ejecutan`.

**VISUAL:** avatar en un escritorio de oficina usando calculadora, impresora, teléfono, computadora, libreta: **objetos concretos**, no tentáculos luminosos ni interfaces holográficas.

**NOTAS:** «Me gusta pensar que el LLM es el cerebro y el agente es el sistema que le permite coordinar acciones. Las tools son los objetos del escritorio. Según el problema, decide cuáles utilizar; el software hace las llamadas y le devuelve resultados». No afirmar que el modelo controla mágicamente el sistema operativo.

**REMATE:** «La IA pasó de opinar en la junta a empezar a mover tickets».

### 08. Un agente en acción — «No es magia: es un flujo»

**EN PANTALLA:** diagrama limpio: `Petición → modelo elige tool → ejecución → resultado → respuesta`.

**VISUAL:** petición «¿Qué tickets siguen abiertos?»; llamada `list_tickets()`; resultado con 3 tickets; respuesta del agente.

**NOTAS:** el modelo recibe descripciones de herramientas y propone llamadas; la aplicación controla la ejecución, permisos, resultados y posibles iteraciones. Esta diapositiva crea una base común para los técnicos sin exigirles conocer frameworks específicos.

---

## ACTO II — El infierno de las integraciones

### 09. Fuera de la demo — «Ahora conéctalo a los sistemas reales»

**EN PANTALLA:** `Agente + Drive + GitHub + CRM + sistema interno + ...`

**VISUAL:** escritorio antes ordenado; ahora llegan nuevos equipos, pantallas, montones de documentación y notas adhesivas.

**NOTAS:** normalmente las herramientas no aparecen solas: alguien debe integrar cada servicio y mantener esa integración. Algunas se conectan vía API, otras mediante automatización de interfaces y otras mediante SDKs específicos. Son alternativas existentes **antes** de MCP.

### 10. «Solo hay que conectarlo a la API»

**EN PANTALLA:** título enorme; abajo, como si fueran notas en post-its: `OAuth`, `scopes`, `tokens`, `SDK`, `paginación`, `permisos`, `API v3`, `documentación`.

**VISUAL:** avatar desarrollador sepultado en documentación, cables y post-its; estética de meme de oficina.

**NOTAS:** cada una de esas piezas es razonable por separado; la dificultad crece cuando hay varios proveedores y varios clientes de IA.

**REMATE:** «“Solo hay que conectarlo a la API”. Frase pronunciada, normalmente, por alguien que no lo va a conectar».

### 11. El espagueti — «Ahora multiplícalo»

**EN PANTALLA:** a la izquierda `Cliente A · Cliente B · Agente interno`; derecha `Drive · CRM · tickets · GitHub`; en medio una maraña de conexiones **personalizadas**.

**VISUAL:** diagrama antes/después reservado para comparación posterior: aquí mostrar solo el **antes** caótico. Evita implicar que cada cliente *siempre* requiere una implementación distinta; habla del escenario que intentamos evitar.

**NOTAS:** si cada equipo implementa adaptadores propios para las mismas capacidades, repetimos esfuerzo y mantenimiento. Lo que necesitamos no es otra herramienta, sino una forma compartida de exponerlas.

**REMATE:** «Felicidades: inventamos el espagueti distribuido».

---

## ACTO III — MCP como respuesta

### 12. Aparición de MCP — «Un contrato común»

**EN PANTALLA:** `Model Context Protocol` y una sola frase: `Una forma estándar de exponer capacidades a aplicaciones de IA`.

**VISUAL:** el avatar retira cables enredados y coloca una pieza de conexión simple entre dos lados.

**NOTAS:** presentar MCP **después** de que el público ya identificó el problema. No llamarlo «el sistema nervioso»: esa analogía sugiere erróneamente que MCP piensa o controla al agente.

### 13. La analogía clave — «De hacerlo a mano a darle la herramienta»

**EN PANTALLA:**

`Sin integración directa: navegar → buscar → clic → copiar`  
`Con una herramienta: buscar_archivo(nombre)`

**VISUAL:** díptico. Izquierda: el avatar navegando manualmente un sistema para hallar un documento. Derecha: ese sistema ofrece un botón/función clara. **Aclarar en notas que las tools ya existían sin MCP.**

**NOTAS:** «El agente puede hacer tareas mediante una interfaz o mediante integraciones hechas a mano. Darle una tool directa evita pasos innecesarios. **Pero esto, por sí solo, todavía no es MCP.** MCP estandariza cómo diferentes clientes descubren y llaman esas tools y otros tipos de capacidades». Este matiz es central: evitar atribuir a MCP la invención del tool calling.

### 14. El enchufe común — «No más adaptadores para cada combinación»

**EN PANTALLA:** comparación visual:

`ANTES: clientes ↔ adaptadores específicos ↔ sistemas`  
`CON MCP: clientes compatibles ↔ servidores MCP ↔ sistemas`

**VISUAL:** enchufe común tipo USB-C como metáfora, con diagrama simple al lado. El mismo servidor puede servir a varios clientes **compatibles**.

**NOTAS:** «Antes podíamos conectar todo; ahora tenemos un contrato compartido para no explicarle desde cero a cada aplicación cómo usar cada sistema». MCP no borra las APIs subyacentes ni reemplaza toda la lógica de autenticación.

**REMATE:** «USB-C para agentes… con la esperanza de que esta vez sí sepamos qué cable sirve para qué».

### 15. Anatomía mínima — «Host, cliente y servidor»

**EN PANTALLA:** `Chat / IDE / agente (host) → cliente MCP → servidor MCP → API / BD / sistema`.

**VISUAL:** arquitectura horizontal de cuatro bloques y flechas, sin más de dos colores principales. Resaltar que el servidor es **un adaptador** que habla con el sistema real.

**NOTAS:** distinguir los roles con precisión: el **host** es la aplicación (por ejemplo, un chat o IDE) que incorpora uno o más **clientes MCP**; cada cliente establece comunicación con un **servidor MCP**. Ese servidor publica capacidades y, cuando corresponde, llama al servicio real. No equiparar el modelo directamente con el cliente MCP.

### 16. ¿Qué hay dentro? — «No todo son tools»

**EN PANTALLA:** tres tarjetas: `Tools → acciones`, `Resources → datos`, `Prompts → plantillas`.

**VISUAL:** martillo/botón; archivador; tarjeta de instrucciones. Nada de iconos microscópicos.

**NOTAS:** **Tools:** acciones que el modelo puede solicitar cuando la aplicación lo permita. **Resources:** información que la aplicación puede incorporar al contexto. **Prompts:** plantillas reutilizables ofrecidas por el servidor. La forma de presentación y uso depende del cliente; no todo cliente soporta toda capacidad.

### 17. El agente descubre una tool — «Dile qué hace, no solo cómo se llama»

**EN PANTALLA:** tarjeta con ejemplo muy legible:

```text
create_ticket
Descripción: crea un ticket de soporte
Parámetros: title, priority, description
```

**VISUAL:** avatar presentando la ficha de herramienta como si entregara una tarjeta de oficina.

**NOTAS:** enseñar en pocos segundos la importancia de las descripciones y esquemas. El cliente obtiene capacidades publicadas por el servidor y puede ponerlas a disposición del modelo. La calidad de una descripción puede afectar qué herramienta selecciona el modelo. MCP no garantiza que siempre elija correctamente.

**REMATE:** «Si a tu función le pusiste `tool1_final_v2_ahora_si`, tal vez no estás ayudando».

### 18. ¿Dónde aparece? — «Los sospechosos habituales»

**EN PANTALLA:** cuatro grupos, **no** un muro de logos: `Documentos`, `Desarrollo`, `Comunicación`, `Datos / negocio`.

**VISUAL:** pequeños iconos representativos: documentos/Drive, GitHub/issues, mensajes, bases de datos/tickets. Si utilizas nombres o logotipos de servidores específicos, verifica antes su disponibilidad oficial y si el conector concreto usa MCP o un mecanismo propietario; no afirmar que todos ofrecen un servidor MCP oficial.

**NOTAS:** ejemplos de capacidades **que podrían exponerse**: buscar/leer archivos, consultar issues, buscar mensajes, generar reportes. Evitar una lista de treinta proveedores: aterrizar la idea y pasar al caso propio.

---

## ACTO IV — Lo verdaderamente útil: nuestros propios sistemas

### 19. El héroe olvidado — «Ese sistema interno de 2017»

**EN PANTALLA:** `Tu sistema ya resuelve problemas. Tu agente ni siquiera sabe que existe.`

**VISUAL:** pantalla institucional caricaturesca y algo anticuada con secciones «Tickets», «Reportes», «Inventario». Avatar desarrollador mirándola con cariño/resignación.

**NOTAS:** pensar en un CRM, plataforma de atención, inventario, reportes, un ETL o cualquier herramienta hecha por el equipo. Muchas veces su lógica útil existe, pero nadie quiere construir un nuevo chat para cada función.

**REMATE:** «El sistema que nadie quiere tocar… porque sostiene media oficina».

### 20. No construyamos «otro chatbot corporativo™»

**EN PANTALLA:** `Una tarea → ¿otro portal + otro login + otro chat?`

**VISUAL:** un empleado abriendo su ventana de chat n.º 17 al lado de los otros 16; oficina sencilla, caricatura reconocible.

**NOTAS:** en lugar de obligar a todos a adoptar otra interfaz para cada caso de uso, podemos exponer un conjunto acotado de capacidades del sistema y consumirlo desde clientes que ya usan, cuando sean compatibles y cumplan políticas institucionales.

**REMATE:** «Porque claramente lo que nos hacía falta era nuestro chatbot corporativo número 17».

### 21. Ponle MCP encima — «No tires lo que ya funciona»

**EN PANTALLA:** `Chat compatible → MCP → API existente → base / lógica de negocio`.

**VISUAL:** animación de un bloque nuevo (servidor MCP) colocándose **encima de** una API que ya existía, no reemplazándola. Solo exponer `list_tickets`, `create_ticket`, `get_ticket_status`.

**NOTAS:** mantener el backend original. Construir una capa MCP que llame a endpoints ya desarrollados y solo exponga lo necesario. Recordar límites: las autorizaciones que exige el sistema real siguen siendo responsabilidad de la implementación.

### 22. FastMCP — «Dos pájaros de un tiro»

**EN PANTALLA:** fragmento conceptual y **legible** de código Python, máximo 10 líneas:

```python
from fastmcp import FastMCP

mcp = FastMCP("Tickets")

@mcp.tool
def list_tickets() -> list[dict]:
    """Lista los tickets visibles para el usuario."""
    return api.list_tickets()
```

**VISUAL:** avatar con una laptop y, al lado, el flujo `API existente → decorador → tool MCP`. No mostrar archivos de configuración completos ni código diminuto.

**NOTAS:** FastMCP simplifica la publicación de capacidades en Python; la lógica de negocio real permanece en la API. El código es **ilustrativo**: Codex deberá adaptarlo a la versión real de FastMCP y al cliente de API de la demo. No prometer que el decorador resuelve por sí solo sesiones, autenticación y autorización.

**REMATE:** «Python ocultando suficiente complejidad para que podamos prototipar irresponsablemente rápido».

### 23. ¿Y quién lo usa? — «Del terminal al chat de siempre»

**EN PANTALLA:** `Antes: terminal + config + cliente técnico` → `Ahora: integraciones desde chats compatibles`.

**VISUAL:** izquierda: avatar enfrentándose a JSON, terminal y rutas; derecha: empleado utilizando su chat web habitual para consultar un sistema autorizado. No sugerir que el primer mundo desapareció.

**NOTAS:** herramientas de desarrollo y agentes programáticos fueron un entorno natural para muchas integraciones MCP. La disponibilidad de integraciones en productos de chat puede reducir fricción para personas no técnicas. **Antes de crear esta diapositiva y la demo, comprobar requisitos y opciones vigentes de ChatGPT/Claude**; capacidades, planes, controles empresariales y soporte de MCP pueden cambiar.

**REMATE:** «Instala Node, Docker, abre la terminal… Ah, ¿solo querías consultar tus vacaciones?».

---

## ACTO V — Demo, límites y cierre

### 24. Demo: la arquitectura — «De mi API a tu chat»

**EN PANTALLA:** `FastAPI → FastMCP → HTTPS (Tailscale Funnel) → ChatGPT`.

**VISUAL:** cuatro bloques grandes y numerados; el avatar junto a una laptop. Etiquetar **solo** estos componentes, más el sistema de tickets detrás de FastAPI.

**NOTAS:** partir de un sistema **ficticio y simple**, con datos de prueba. API de tickets → funciones MCP → endpoint HTTP del servidor → URL HTTPS expuesta temporalmente mediante Funnel → cliente compatible. En la arquitectura, especificar el endpoint que realmente use la versión de FastMCP (`/mcp` si aplica); verificar antes de generar instrucciones técnicas. La exposición pública de Funnel **no aporta autenticación de aplicación por sí misma**: usar entorno de demostración y controles necesarios; no publicar credenciales ni datos institucionales.

**REMATE:** «Como todo sistema absolutamente serio de producción: corre en mi laptop. No hagan eso mañana en producción».

### 25. Demo en vivo — «Ahora hazlo tú»

**EN PANTALLA:** tres grandes pasos, sin textos adicionales: `Consulta → Acción → Verificación`.

**VISUAL:** capturas o marcadores para: 1) chat pregunta «¿Qué tickets hay abiertos?»; 2) chat solicita «Crea un ticket para revisar el servidor»; 3) aplicación original mostrando el nuevo ticket. Reservar área para demo en directo.

**NOTAS / PLAN DE EJECUCIÓN:**
1. Mostrar brevemente el sistema original y su API.
2. Enseñar el servidor FastMCP en ejecución y que las tools se descubren.
3. Conectar el endpoint remoto al cliente disponible.
4. Pedir una **lectura** (`list_tickets`) y luego una **escritura controlada** (`create_ticket`).
5. Verificar en el sistema original que los datos cambiaron.

**PLAN B:** preparar capturas o un video corto de **este mismo flujo** por si falla la red, la autenticación o el cliente. No falsificar una ejecución en vivo; anunciar con naturalidad si se reproduce una grabación.

### 26. Seguridad — «Que pueda no significa que deba»

**EN PANTALLA:** `Identidad · permisos · confirmaciones · auditoría`.

**VISUAL:** avatar a punto de pulsar un botón «Eliminar todo» bajo la mirada de un guardia de seguridad caricaturesco; contrastar una tool de lectura y una acción destructiva. Mantener la comicidad ligera.

**NOTAS:** autenticación del usuario y del servidor, mínimos permisos, validación de argumentos, límites de lectura/escritura, aprobación para cambios sensibles y registros. Las instrucciones y resultados de herramientas externas pueden contener contenido malicioso; hay que contemplar riesgos de *prompt injection*. MCP **no** garantiza seguridad ni control de decisiones por sí mismo.

**REMATE:** «Si tu agente toma malas decisiones, ahora tiene una forma estándar de tomar malas decisiones en más sistemas».

### 27. Lo que MCP NO es — «Desinflando el hype»

**EN PANTALLA:** cuatro tarjetas tachadas: `No es un modelo` · `No es un agente` · `No inventó las tools` · `No reemplaza permisos`.

**VISUAL:** el avatar despejando un escritorio lleno de etiquetas de moda.

**NOTAS:** recordar que MCP establece una interfaz para integración y descubrimiento de capacidades; no mejora la inteligencia del LLM, ni resuelve automáticamente una API mal diseñada, ni reemplaza un sistema de autorización. RAG, agentes y MCP **pueden coexistir**: los cuatro bloques de la narrativa son una **progresión pedagógica**, no fases históricas estrictas ni alternativas excluyentes.

### 28. Cierre — «De saber a hacer, sin repetir integraciones»

**EN PANTALLA:** una línea final de cuatro estaciones: `LLM: responde` → `RAG: aporta contexto` → `Agente: coordina acciones` → `MCP: estandariza conexiones`.

**VISUAL:** miniaturas consistentes del mismo avatar en sus poses anteriores, conectadas de forma sobria. Evitar atribuir capacidades absolutas a cada componente.

**NOTAS:** volver a la idea fuerza y ligar el cierre con la demo. «No estamos reemplazando los sistemas: estamos buscando que los que ya tenemos puedan colaborar con las herramientas de IA que la gente realmente usa».

**FRASE FINAL:** «MCP no apareció porque fuera imposible conectar agentes con herramientas. Apareció porque estábamos cansados de construir el mismo puente una y otra vez».

### 29. Preguntas — «¿Y ahora quién sabe qué es MCP?»

**EN PANTALLA:** repetir la encuesta inicial con la misma tipografía y opciones. Un QR o URL del repositorio de la demo **solo si existe realmente**.

**VISUAL:** avatar como presentador, quizá el personaje de MexAI saludando a su lado.

**NOTAS / CALLBACK:** pedir manos de nuevo si el ambiente se presta.

**REMATE:** «¿Quién sigue sin saber, pero ahora sabe exactamente qué es lo que no sabe?».

---

## Material opcional para quienes ya conocen MCP (apéndice, NO interrumpir la narrativa)

Preparar **2–3 diapositivas de respaldo** para preguntas técnicas, sin presentarlas obligatoriamente:

- **Transporte y protocolo:** JSON-RPC; conexión local mediante `stdio` y remota mediante **Streamable HTTP** cuando cliente/servidor lo soporten. No confundir el nombre del endpoint `/mcp` con el protocolo completo: es una ruta utilizada habitualmente, no una definición de MCP.
- **MCP no es un permiso universal:** distinguir identidad/autenticación del servidor, autorización de acceso a datos del sistema subyacente, aprobaciones del cliente y restricciones del entorno corporativo.
- **Tool discovery y escala:** las herramientas se describen al cliente, pero eso no garantiza selección correcta. Muchas tools, descripciones ambiguas o parámetros enormes pueden añadir contexto, latencia y errores; existen estrategias de filtrado y evaluación de herramientas. Solo tocarlo si hay tiempo para preguntas.

## Instrucciones de ejecución para Codex

1. **Leer los assets disponibles primero**. Aprovechar el avatar morado y la mascota original de MexAI. Si faltan imágenes, insertar placeholders con nombres inequívocos (`avatar_rag_puerta.png`, `avatar_agentes_escritorio.png`, etc.) e indicar qué recursos faltaron en el resultado.
2. Generar una **presentación editable** con esta progresión y notas del presentador; si no puedes poner notas dentro del archivo, entregar `speaker_notes.md` con el número/título exacto de cada slide.
3. **No copiar los bloques NOTAS ni los chistes a las diapositivas** salvo las dos o tres citas muy breves señaladas en pantalla. El humor debe vivir principalmente en la narración y las imágenes.
4. Mantener consistencia de personaje, paleta, trazos y márgenes. Usar máximo un meme visual fuerte por sección; no recurrir a la estética futurista de redes/neón.
5. En todos los diagramas técnicos diferenciar **host**, **cliente MCP**, **servidor MCP** y **sistema subyacente**. MCP **no** equivale a navegar una web más rápido y **no** inventó el tool calling.
6. La demo es el momento central: reservar slides 24–25 para arquitectura y ejecución; prepararlas de modo que admitan una demo real y un respaldo grabado. No incluir secretos ni publicar accesos a sistemas reales.
7. Verificar contra **documentación oficial vigente** cualquier detalle que pueda haber cambiado: API de FastMCP, transporte HTTP, configuración de servidores remotos y soporte de conexión en el cliente de chat elegido. Si hay incertidumbre, evitar mostrar un paso de configuración como hecho y dejar una nota de verificación.
8. Entregar archivo fuente editable y, si es sencillo, una vista previa/exportación. Incluir al final un listado de assets empleados y placeholders pendientes. No detener la creación por ausencia de un meme: usar un diagrama o ilustración sencilla.

### Prioridad narrativa ante recortes de tiempo

**Imprescindible:** puerta/LLM → RAG → escritorio/agente → «solo hay que conectar la API» → espagueti → MCP es interfaz, no tool calling → arquitectura → sistema interno → demo → cierre.  
**Recortable:** catálogo de proveedores, explicación ampliada de Resources/Prompts, chistes adicionales y apéndice técnico.

**Sensación final buscada:** el público se ríe de problemas que reconoce, entiende qué gana con MCP y sale pensando: *«Ese sistema que ya tenemos en la oficina podría exponer sus funciones sin que construyamos otro chatbot desde cero»*.
