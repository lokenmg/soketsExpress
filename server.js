const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  const datos = {
    mensaje: '¡Conexión exitosa entre el backend y Angular!',
    fecha: new Date()
  };

  res.json(datos);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


// Crear una conexión MQTT
const client = mqtt.connect('ws://localhost:8083/mqtt', {
    clientId: 'emqx_test',
    username: 'servidor',
    password: 'emqx_test',
  }); // Reemplaza "localhost" con la dirección de tu broker MQTT

// Evento de conexión exitosa
client.on('connect', () => {
  // Suscribirse a un tema
  client.subscribe('hotel/#');
});

// Evento de mensaje recibido
client.on('message', (topic, message) => {
  console.log('Mensaje recibido:', message.toString());
});

// Evento de error
client.on('error', (error) => {
  console.error('Error de MQTT:', error);
});

app.post('/enviar', (req, res) => {
  const datos = req.body;
  console.log("datos",datos);
  const habitacion = datos.dispositivo.dispositivo;
  const nhabitacion = datos.numero;
  const ndatos= {  
    id: habitacion.ip, 
    status:0,
    dispositivo: habitacion.tipo,
    habitacion:{
      numero: nhabitacion.habitacionNumero
    }
   };
   //console.log("mis",ndatos  ${}  );
  client.publish(`hotel/habitación${ndatos.habitacion.numero}/${ndatos.dispositivo}${ndatos.id}`, JSON.stringify(ndatos));
  res.json({ mensaje: 'Datos recibidos en el servidor' });
});


