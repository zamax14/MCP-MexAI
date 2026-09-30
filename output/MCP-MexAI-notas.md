# Notas del presentador

## 01 · Apertura

Abrir con la pregunta: ¿quién sabe qué es MCP? Pedir manos, aceptar “me suena” y “creo que ya lo uso”. Pausa. Soy Alejandro Zárate Macías, AI Engineer del Instituto de Información Estadística y Geográfica. Trabajo con recuperación de herramientas en español y visión por computadora. Hoy vamos a sacar a alguien muy inteligente de una habitación y descubrir por qué conectar cosas termina siendo un trabajo de tiempo completo.

## 02 · Cierre

Pausa antes de comenzar la historia. Leer el remate y señalar que nuestro personaje tiene conocimientos, pero no acceso automático al mundo exterior.

## 03 · ACTO I   /   UN CEREBRO ENCERRADO

Vamos a hacer un experimento bastante cuestionable: encerramos a alguien en un cuarto y le damos todo lo que pueda leer. Libros, artículos, conversaciones, tutoriales, respuestas de foros… Que aprenda todo lo que pueda. Nuestro personaje estudia, relaciona cosas y memoriza. Pausa: ya sabe muchísimo, pero sigue encerrado. Esta es la analogía humana del entrenamiento; técnicamente un LLM aprende patrones en sus parámetros y genera respuestas condicionadas al contexto, no consulta una memoria literal de todo internet. Transición: ahora le hacemos preguntas por la puerta.

## 04 · TOC, TOC… UNA PREGUNTA

Ahora alguien toca la puerta y pregunta algo que nuestro personaje estudió. Él piensa: “Eso lo leí… a ver, me acuerdo”. Recupera lo que cree recordar, relaciona ideas y responde. Y muchas veces la respuesta sirve: por eso estos modelos son tan útiles. Dejar que el público reconozca la situación de contestar un examen sin apuntes. La memoria es una analogía divulgativa, no el mecanismo literal del modelo: éste genera texto a partir de patrones aprendidos y del contexto, y puede razonar además de reproducir información. Transición con una pausa: el problema es cuando se le cruzan los cables y la seguridad se queda intacta.

## 05 · PERO A VECES… SALE EL ALUCÍN

Puede mezclar términos, atribuir una idea a quien no era o inventarse una explicación; y decirlo con una seguridad espectacular. Aquí entra el alucín: en la analogía, se cree muy cabrón, pero anda inventando. No es que el modelo tenga ego o quiera mentir; llamamos alucinación a una respuesta falsa o sin fundamento presentada como plausible. Preguntar: “¿Cuánto vendimos ayer?”. Imitar una voz muy solemne: “Basándome en patrones históricos… ochenta y cinco mil, sin duda”. Pausa. “Mi hermano, ni acceso al sistema tienes”. La cifra es deliberadamente ficticia y sin fuente. Remate: “Se le olvidó el dato, pero no la confianza”. No todos los errores son por información ausente: también puede fallar con contexto disponible. Transición: no queremos una predicción ni un cuento convincente; queremos el dato. Vamos a pasarle el reporte por debajo de la puerta.

## 06 · RAG   /   CONTEXTO POR DEBAJO DE LA PUERTA

Después del alucín, abrir con: “A ver, aquí está el reporte. Léelo antes de contestar”. El reporte dice 42 mil, no los 85 mil inventados de la escena anterior. Ahora la respuesta tiene una fuente que podemos contrastar. RAG recupera fragmentos relevantes de fuentes y los incorpora al contexto del modelo. Puede ayudar con información reciente o privada si el índice y los permisos están bien mantenidos. No es reentrenar el modelo. En la escena, los papeles son el contexto recuperado. El personaje ahora responde usando el reporte de ayer. Ejemplo ficticio: 42 mil pesos. No prometer que RAG elimina errores. Transición: ya tiene el reporte; ahora pidámosle que haga algo.

## 07 · SABER EXPLICAR ≠ EJECUTAR

Pedir “Ahora genera la factura”. El personaje explica impecablemente los pasos, pero en esta configuración sólo responde texto. RAG por sí solo no ejecuta la operación. Puede coexistir con tools y agentes, así que esto es una elección de arquitectura del ejemplo, no una prohibición universal. Remate: excelente tutorial, cero facturas. Transición al acto II: vamos a darle un cuerpo y herramientas.

## 08 · Cierre

Retomar la factura que nunca se generó. Vamos a darle herramientas y un sistema que coordine su ejecución.

## 09 · ACTO II   /   LE DAMOS UN CUERPO

El LLM aporta el razonamiento y propone pasos o llamadas. El sistema agente coordina el ciclo, ejecuta herramientas con validación y permisos, observa resultados y decide si continuar. Las tools son funciones o capacidades concretas, no necesariamente objetos físicos. Tool calling y agentes existían antes de MCP. No todos los agentes requieren autonomía ilimitada. Transición: veamos una vuelta del ciclo sin magia.

## 10 · UNA VUELTA DEL CICLO

Ejemplo ficticio de tool calling anterior e independiente de MCP. El usuario pregunta por las ventas. El modelo propone consultar_ventas con una fecha; el runtime valida y ejecuta, no el texto del modelo por sí mismo. La función devuelve un resultado estructurado, que vuelve al contexto del modelo. Este redacta una respuesta. Puede haber varios ciclos, fallos, reintentos o confirmación humana. La fecha se resuelve desde “ayer” usando el calendario y la zona horaria del usuario.

## 11 · Cierre

Mostrar la frase y dejar tres segundos de silencio. Preguntar con la mirada quién ha escuchado eso. Avanzar para revelar OAuth, permisos, tokens y el coste escondido.

## 12 · ACTO III   /   EL INFIERNO DE LAS INTEGRACIONES

Revelación. Enumerar apenas dos o tres problemas, sin leer todas las palabras: OAuth, scopes, refresh tokens, diferencias de SDK y versiones. La API no es el problema; el trabajo repetido y las diferencias entre sistemas sí. Remate: “Normalmente pronunciado por alguien que no va a conectarlo”. Pausa para la risa. MCP no borrará la autenticación ni arreglará una API defectuosa.

## 13 · EL PROBLEMA CRECE CON CADA CLIENTE

Recorrer los paneles de izquierda a derecha. Un cliente y un sistema: una conexión. Tres clientes con dos sistemas: seis combinaciones posibles. Tres por cuatro: doce. Son combinaciones potenciales, no una obligación de implementar doce SDK completos; pueden existir adaptadores compartidos. El propósito del diagrama es mostrar la multiplicación de contratos particulares. Transición: el agente funciona; lo que no escala bien es rehacer el cableado.

## 14 · Cierre

Después del caos, pausa. Introducir la necesidad de compartir un contrato de integración. MCP reduce trabajo repetido, sin eliminar adaptadores ni permisos.

## 15 · ACTO IV   /   DEJEMOS DE REINVENTAR LA RUEDA

Revelar MCP como resolución del problema, no como un nuevo cerebro. Model Context Protocol estandariza cómo las aplicaciones compatibles descubren y consumen capacidades externas. Analogía del enchufe común: el conector facilita compatibilidad, pero cada aparato sigue haciendo su trabajo. Una función expuesta en HTTP sigue siendo sólo una API si no implementa el contrato MCP. Los servidores adaptan sistemas existentes; no desaparece todo el trabajo de integración.

## 16 · LA MISMA TAREA   /   A MANO

Primera mitad de la comparación visual. Dejar que el público vea al personaje atrapado entre cables. Decir: “Cada sistema tiene su manera. Y aquí estoy yo, haciendo que todas se entiendan”. Pausa. El presentador marca el ritmo y avanza a la siguiente diapositiva para revelar el cambio; no se requiere animación automática. La imagen es una metáfora del trabajo de integración, no un diagrama del protocolo.

## 17 · LA MISMA TAREA   /   CON MCP

Segunda mitad de la comparación visual. Mantener la pausa y señalar el diagrama del asset 10: aplicaciones de IA a un lado, capacidades externas al otro, una interfaz común entre ambas. Decir: “Los sistemas siguen siendo distintos. Lo que compartimos es la forma de descubrir y pedir sus capacidades”. La ilustración resume la idea; no representa un servidor central obligatorio ni implica que el modelo sea el cliente MCP. El cliente es un componente del host, como se precisa en la siguiente diapositiva. Los servidores MCP adaptan sus sistemas y conservan sus permisos y reglas. Exponer una función no equivale por sí solo a implementar MCP. El presentador controla la transición entre ambas imágenes.

## 18 · POR DENTRO   /   HOST ≠ CLIENTE

Host: la aplicación que coordina modelo, interfaz, permisos y conexiones. Cliente MCP: componente de protocolo dentro del host, conectado a un servidor. El host puede tener varios clientes. Servidor: ofrece capacidades y adapta el sistema externo. MCP usa mensajes JSON-RPC; los transportes habituales son stdio para procesos locales y Streamable HTTP para acceso remoto. El modelo no habla necesariamente MCP: el host hace esa mediación. Fuente: https://modelcontextprotocol.io/specification/2025-11-25/architecture

## 19 · EL SERVIDOR OFRECE UN CATÁLOGO

Tools: funciones invocables, por ejemplo crear_ticket. Resources: contenido identificable por URI que el cliente puede leer. Prompts: plantillas reutilizables que el usuario o cliente puede seleccionar. El soporte de cada primitiva depende del cliente. Un flujo típico negocia capacidades y versión, lista herramientas, y hace tools/call con nombre y argumentos. La herramienta se describe con nombre, descripción y JSON Schema; el resultado puede ser contenido o datos estructurados. resources/list y resources/read, prompts/list y prompts/get son operaciones diferentes. La selección de una tool la decide el sistema agente; MCP transporta la solicitud, no razona por él. Fuente: https://modelcontextprotocol.io/specification/2025-11-25/server/index

## 20 · Cierre

Remate sobre sistemas heredados. Pasar al ejemplo de Mesa de ayuda: ya funciona, ya tiene una API y podemos reutilizarlo.

## 21 · ACTO V   /   VOLVAMOS A LA OFICINA

Sistema ficticio de Mesa de ayuda, funcionando desde 2017. Ya gestiona tickets, expedientes y reportes mediante una API. No necesita reinventarse para ofrecer capacidades a una aplicación de IA. Un servidor MCP puede exponer sólo operaciones seleccionadas, delegando reglas del negocio y permisos al sistema real. No recomendar exponer indiscriminadamente cada endpoint. El ejemplo empresarial es conceptual y no asegura que la demo local tenga todas esas operaciones.

## 22 · LA TENTACIÓN

Segundo gran chiste. Decir con entusiasmo falso: “¡Otro chatbot corporativo, marca registrada!”. Enumerar: otra aplicación, otra contraseña, otra interfaz, otra capacitación. Pausa. La alternativa es reutilizar el sistema y ofrecer capacidades a clientes compatibles ya adoptados. A veces sí se necesita una interfaz especializada; MCP no la prohíbe ni garantiza que cualquier cliente cubra todos los flujos.

## 23 · FASTMCP   /   EL PROTOCOLO YA TIENE IMPLEMENTACIÓN

Ejemplo pequeño y sintácticamente válido, no servicio listo para producción. Requiere fastmcp y httpx y una API ficticia local en el puerto 8000 con GET /tickets. FastMCP deriva el esquema de tipos y la descripción del docstring, registra la tool y atiende el transporte HTTP. No es necesario escribir a mano todos los mensajes JSON-RPC. Faltan, de manera deliberada, propagación de identidad y autorización: deben conectarse a las reglas reales. No confundir tipado con autorización. No ejecutar este ejemplo esperando que el endpoint exista en la app actual. Fuente: https://gofastmcp.com/servers/tools y https://gofastmcp.com/deployment/http

## 24 · Cierre

Pausa. Introducir cómo clientes que la gente ya usa acercan estas capacidades sin exigir un chatbot por cada sistema.

## 25 · ACTO VI   /   DE LA TERMINAL AL CHAT HABITUAL

Herramientas de desarrollo como Claude Code, Codex y OpenCode permiten configurar servidores MCP. Sus transportes, permisos, autenticación y soporte de primitivas varían. ChatGPT ofrece apps MCP con modo desarrollador según plan, plataforma y políticas del espacio; verificar acceso antes de la charla. Claude ofrece conectores remotos y opciones locales según producto. No dar por hecho que todos usan el mismo archivo de configuración ni que todos exponen tools, resources y prompts igual. Lo común es poder reutilizar capacidades sin crear un chatbot para cada sistema. Fuentes: https://code.claude.com/docs/en/mcp ; https://developers.openai.com/codex/mcp ; https://opencode.ai/docs/mcp-servers/ ; https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt ; https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp

## 26 · Cierre

Pausa y sonrisa. Presentar la demo y recordar que existe un recorrido de respaldo mediante capturas o video.

## 27 · ACTO VII   /   DEMO

Introducir el montaje de la demo: FastAPI sirve la API y aplicación, FastMCP expone capacidades, Funnel ofrece una URL HTTPS pública, ChatGPT conecta cuando el plan y el espacio lo permiten. La solicitud viaja de derecha a izquierda y el resultado vuelve. Tailscale Funnel aporta conectividad, NO sustituye autenticación ni autorización. En el repositorio actual hay una demo de consultas y datos sintéticos; no hay evidencia de una tool de escritura. El recorrido de video pedido por Alejandro usa apps del catálogo, la plataforma como web/API REST, conexión a ChatGPT y consultas contrastadas en la web. Las escrituras quedan como ejemplo conceptual anterior. Chiste opcional: “Como todo sistema profesional de producción, está corriendo desde mi laptop”. Fuente: https://tailscale.com/docs/features/tailscale-funnel La ilustración 12 muestra a Alejandro preparando la demo. Sus rutas son ilustrativas; las operaciones reales se muestran en el video. Los personajes representan aplicaciones compatibles, cuyo soporte concreto varía.

## 28 · DEMO   /   PRIMERO LO CONOCIDO

Recorrido confirmado por Alejandro. Primer fragmento: usar una app disponible en el catálogo de ChatGPT y mostrar qué capacidad aporta; no afirmar que todas las apps del catálogo son servidores MCP intercambiables ni que tienen idénticos permisos. Segundo fragmento: abrir nuestra plataforma como web y como API REST, ejecutar una consulta y mostrar los mismos datos. La plataforma ya sirve antes de conectar un chat. Espacios editables para capturas del video, solicitados por el presentador; no son evidencia de ejecución. Elegir una consulta real del catálogo y ocultar cualquier credencial en la grabación.

## 29 · DEMO   /   CONECTAR Y CONTRASTAR

Tercer fragmento: conectar la plataforma a ChatGPT mediante la URL MCP remota y las opciones habilitadas para la cuenta. Mostrar que se descubren las herramientas; ocultar credenciales y no hacer depender la explicación de nombres de botones que puedan cambiar. Cuarto fragmento: hacer una consulta desde ChatGPT y volver a la web, ejecutando la misma consulta y verificando filtros, periodo y resultados. Recorrido de consultas solicitado por Alejandro, sin afirmar una escritura que la aplicación no ofrece. Espacios editables para capturas del video.

## 30 · PLAN B   /   SI EL WIFI DECIDE PARTICIPAR

Insertar aquí el video local de los cuatro pasos, o usar las cuatro capturas de las diapositivas anteriores. Orden: apps del catálogo de ChatGPT, plataforma web y API REST, conexión MCP a ChatGPT, consulta y verificación en la web. Probar la reproducción local sin internet antes del evento. Alejandro indicó que aún no existen las capturas ni el video y solicitó dejar los espacios. No afirmar que este archivo contiene una grabación. Si no se incorpora a tiempo, usar el diagrama y narrar la secuencia, marcándola como explicación y no ejecución en vivo.

## 31 · Cierre

Recuperar el personaje del primer acto. Conectar el chiste con identidad, permisos, confirmación y auditoría.

## 32 · ACTO VIII   /   MÁS CAPACIDAD, MÁS RESPONSABILIDAD

Leer el remate y hacer una pausa. “Si tu agente toma malas decisiones, MCP ahora puede permitirle tomar malas decisiones en más sistemas”. Después aterrizar cuatro controles: autenticación verifica identidad; autorización verifica la operación y el recurso permitidos; confirmación explícita antes de efectos importantes; auditoría registra quién pidió qué, qué tool se ejecutó y el resultado. Aplicar mínimo privilegio y validación en el servidor, no confiar sólo en el prompt. Contenido externo puede contener prompt injection; tratarlo como datos no confiables. HTTPS/Funnel no reemplazan estos controles. Los errores y duplicados también requieren gestión, especialmente al reintentar escrituras.

## 33 · SIGAMOS LA CONVERSACIÓN

Espacios solicitados por Alejandro para incorporar QR reales. Reemplazar los cuadros con los códigos de sus redes y del repositorio, y editar las etiquetas. No se generaron códigos ficticios ni se inventaron enlaces. Probar cada QR desde el tamaño de proyección antes de presentar. Dejar unos segundos para escanear y pasar al cierre.

## 34 · Cierre

Recuperar oralmente la progresión: LLM responde, RAG aporta contexto, agentes coordinan acciones y MCP estandariza conexiones. Son capacidades combinables, no etapas excluyentes ni una cronología universal. Cierre oral: “MCP no apareció porque antes fuera imposible conectar agentes con herramientas; apareció porque estábamos cansados de construir el mismo puente una y otra vez”. Pausa. Volver a pedir manos: “¿Y ahora quién sabe qué es MCP?”. Dejar la ilustración en pantalla durante preguntas.
