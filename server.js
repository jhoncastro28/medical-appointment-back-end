const express = require('express');
const cors = require('cors');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
const PORT = 3000;
app.use('/uploads', express.static('uploads'));

// Acá se configura Multer para la subida de fotos
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb){
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

// Como no tenemos capa de persistencia, todo se almacenará en memoria mientras corre el servidor
let appointments = [];

// Ruta del POST para crear una cita
app.post('/crear-cita', upload.single('authorization'), (req, res) =>{
    const {cc, date} = req.body;
    const authorization = req.file.filename;
    const appointmentCode = uuid.v4();

    const newAppointment = {
        codigo: appointmentCode,
        cc,
        date,
        autorizacion: authorization,
        estado: 'activa'
    };

    appointments.push(newAppointment);
    res.json({codigo:appointmentCode, message: 'Cita creada exitosamente.'});
});

// Ruta del GET para consultar las citas que tengamos
app.get('/consultar-citas', (req, res) => {
    const { startDate, endDate } = req.query;

    // Filtrar citas dentro del rango de fechas
    const appointmentsInRange = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
    }).map(appointment => ({
        ...appointment,
        autorizacion: `http://localhost:3000/uploads/${appointment.authorizacion}`
    }));

    res.json(appointmentsInRange);
});

// Ruta del DELETE para cancelar o eliminar alguna de las citas almacenadas

app.delete('/cancelar-cita/:code', (req, res) => {
    const {code} = req.params;

    const appointment = appointments.find(appointment => appointment.codigo === code);

    if(!appointment){
        return res.status(404).json({message: 'Cita no encontrada.'});
    }

    appointment.estado = 'canceled';
    res.json({message: `Cita co codigo ${code} ha sido cancelada.`})
});

// Indicamos los archivos que deben ser empleados para la subida al servidor
app.use('/uploads', express.static('uploads'));

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Localhost: ${PORT}`);
});