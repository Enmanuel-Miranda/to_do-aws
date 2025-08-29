# Mini-API de Tareas Serverless

API REST para la gestión de tareas (CRUD) construida con una arquitectura serverless en AWS.

---

### Descripción

Este proyecto implementa una solución de backend serverless usando **AWS CDK** para aprovisionar los siguientes recursos:
* **API Gateway:** Para exponer los endpoints de la API.
* **AWS Lambda:** Para la lógica de negocio de las operaciones CRUD.
* **DynamoDB:** Como base de datos NoSQL para almacenar las tareas.
* **CloudWatch:** Para la observabilidad a través de logs estructurados y métricas personalizadas.

El objetivo principal es demostrar habilidades en la creación de infraestructura como código, así como en el desarrollo y la implementación de buenas prácticas de monitoreo.

---

### Requisitos

Asegúrate de tener instalado lo siguiente antes de proceder con el despliegue:
* Node.js (versión 18 o superior)
* AWS CLI configurado con tus credenciales
* AWS CDK (`npm install -g aws-cdk`)

---

### Instalación y Despliegue

1.  Clona el repositorio.
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Despliega la infraestructura en tu cuenta de AWS:
    ```bash
    cdk deploy
    ```
Al finalizar el despliegue, la URL de tu API se mostrará en la terminal.

---

### Uso de la API

La API ofrece los siguientes endpoints para la gestión de tareas. Puedes utilizar una herramienta como `curl` para interactuar con ellos.

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **POST** | `/todos` | Crea una nueva tarea. |
| **GET** | `/todos` | Lista todas las tareas. |
| **GET** | `/todos/{id}` | Obtiene una tarea específica. |
| **PUT** | `/todos/{id}` | Actualiza una tarea existente. |
| **DELETE**| `/todos/{id}` | Elimina una tarea. |

---

### Pruebas

El proyecto incluye pruebas unitarias para validar la lógica de las funciones Lambda. Para ejecutarlas, usa el siguiente comando:
```bash
npm test
