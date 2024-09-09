const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

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
app.post('/crear-cita', upload.single('autorizacion'), (req, res) =>{
    const {id, date} = req.body;
    const autorization = req.file.filename;
    const appointmentCode = uuid.v4();

    const newAppointment = {
        codigo: appointmentCode,
        id,
        date,
        autorizacion: autorization,
        estado: 'activa'
    };

    appointments.push(newAppointment);
    res.json({code:appointmentCode, message: 'Cita creada exitosamente.'});
});

// Ruta del GET para consultar las citas que tengamos
app.get('/consultar-citas', (req, res) => {
    const {startDate, endDate} = req.query;

    const appointmentsInRate = appointments.filter(appointment => {
        const appointmentDate = new Date (appointment.Date);
        return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
    });

    res.json(appointmentsInRate);
});

// Ruta del DELETE para cancelar o eliminar alguna de las citas almacenadas

app.delete('/cancelar-cita/:code', (req, res) => {
    const {code} = req.params;

    const appointment = appointments.find(appointment => appointment.code === code);

    if(!appointment){
        return res.status(404).json({message: 'Cita no encontrada.'});
    }

    appointment.status = 'canceled';
    res.json({message: `Cita co codigo ${code} ha sido cancelada.`})
});

// Indicamos los archivos que deben ser empleados para la subida al servidor
app.use('/uploads', express.static('uploads'));

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Localhost: ${PORT}`);
});