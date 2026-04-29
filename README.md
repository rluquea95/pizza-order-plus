# 🍕 PizzaOrder+

Proyecto completo (Full Stack) para la gestión de pedidos de una pizzería, desarrollado con el stack MERN (MongoDB, Express, React, Node.js). 

## 🚀 Características Principales
- **Frontend**: SPA construida con React 19 y Vite 8. Gestión inteligente de estado para el carrito, personalización de productos y temporizadores de edición de pedidos.
- **Backend**: API RESTful con Node.js y Express 5.
- **Base de Datos**: MongoDB Atlas para almacenar productos, ingredientes, alérgenos, pedidos y usuarios.
- **Seguridad y Roles**: Autenticación mediante JWT con roles de acceso protegidos (Cliente y Administrador) y hashing con Argon2.


## 🛠️ Stack Tecnológico
- **Frontend**: React 19, Vite 8, React Router v7, Tailwind CSS v4, Axios. Generación de facturas con React-to-print.
- **Backend**: Node.js, Express 5, MongoDB Atlas con Mongoose v9.
- **Seguridad**: JSON Web Tokens (JWT) y hashing avanzado con Argon2.


## ⚙️ Requisitos Previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cuenta configurada y cluster creado)


## 📦 Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

### :one: Clonar el repositorio
```bash
git clone https://github.com/rluquea95/pizza-order-plus.git
cd pizza-order-plus
```

### :two: Configurar el Backend
Primero, entra en la carpeta del backend e instala sus dependencias:

```bash
cd backend
npm install
```

- Crea un archivo `.env` en la raíz de la carpeta backend `(backend/.env)`
- Regístrate en **MongoDB Atlas**, crea un clúster gratuito y configura el nombre de la base de datos y el usuario administrador.
- Asegúrate de incluir tu **MONGO_URI** (modificando la URL que te da MongoDB Atlas incluyendo el usuario y la contraseña), el **PORT** y tu **JWT_SECRET**:

```bash
PORT=pon el puerto aquí
MONGO_URI=mongodb+srv://{...}
JWT_SECRET=pon tu clave aquí
```

### :three: Poblado de la Base de Datos
Una vez configurada la conexión a MongoDB en el `.env`, ejecuta el script del fichero `seed.js` para resetear la base de datos y cargar la carta de productos y los usuarios por defecto:
```bash
node seed.js
```
> [!NOTE]
>💡El script de poblado crea automáticamente dos usuarios para que puedas probar la plataforma inmediatamente:
> - Administrador: admin@pizzaorder.com 
> - Password: Password123*
> - Cliente: cliente@pizzaorder.com 
> - Password: Password123*


### :four: Configurar el Frontend
Ahora debemos instalar las dependencias de la aplicación frontend:
```bash
cd ../frontend
npm install
```


## :computer: Ejecución en Desarrollo
Para probar el proyecto, abre dos terminales y lanza ambos servicios:

#### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

#### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```