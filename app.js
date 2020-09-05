const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    Estado: 'Bienvenido a mi API!',
  });
});

app.get('/gatitos', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    const dataJSON = JSON.parse(data);
    res.json({
      status: 'success',
      data: dataJSON,
    });
  });
});

app.get('/gatitos/:id', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Ocurrio un error',
      });
    }

    const gatos = JSON.parse(data);
    const id = Number(req.params.id);
    const gatosFiltrados = gatos.filter(gato => gato.id === id);

    if (!gatosFiltrados.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gato no encontrado',
      });
    }

    res.send({
      status: 'success',
      data: gatosFiltrados,
    });
  });
});

app.post('/gatitos', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    const dataJSON = JSON.parse(data);
    const nuevoGato = req.body;
    nuevoGato.id = dataJSON.length;
    dataJSON.push(nuevoGato);

    fs.writeFile(
      `${__dirname}/assets/cats.json`,
      JSON.stringify(dataJSON),
      err => {
        res.status(201).json({
          status: 'success',
          data: {
            nuevoGato,
            createdAt: new Date(),
          },
        });
      },
    );
  });
});

// implementar PUT y DELETE /gatitos/:id
// borrar el gato (en delete)
// modificar el dato (el usuario tiene que enviar el gato modificado en el body)

const port = 8080;

app.listen(port, () => {
  console.log(`App corriendo en puerto ${port}`);
});
