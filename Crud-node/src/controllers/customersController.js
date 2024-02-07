const Pool = require("mysql/lib/Pool");
const bcrypt = require('bcrypt');
const axios = require('axios');
const { response } = require("express");
//const validate= require('validate');
const saltRounds = 10;
const controller = {};

controller.render = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }
        res.render('join', {
        });
    });
};

controller.renderD = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }
        res.render('Dasboard', {
        });
    });
};

controller.devices = (req, res) => {
    const axios = require('axios');
};

controller.join = (req, res) => {
    const usuarioV = req.body.usuario;
    const contraseña = req.body.contraseña;
    req.getConnection((err, conn) => {
        debugger;
        conn.query('SELECT Nombre_usuario, contraseña FROM usuario WHERE Nombre_usuario = BINARY ? ;', [usuarioV], (err, usuario) => {
            if (err) {
                res.json(err);
            }
            if (usuario.length == 0) {
                res.redirect('/?alert=Usuario no encontrado')
            } else {

                storedPassword = usuario[0].contraseña;
                console.log(storedPassword);
                const valid = bcrypt.compare(contraseña, storedPassword);
                bcrypt.compare(contraseña, storedPassword, function (err, passwordMatch) {

                    if (err || passwordMatch == false) {
                        console.log(contraseña)
                        console.log(passwordMatch)
                        return res.redirect('/?alert=Contraseña incorrecta');

                    } else {
                        console.log(contraseña)
                        console.log(passwordMatch)
                        res.redirect('/dashboard')

                    }
                });


            }


        });


    });

};
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuario) => {
            if (err) {
                res.json(err);

            }
            console.log(usuario);
            res.render('customers', {
                data: usuario
            });
        });

    });
};

controller.save = (req, res) => {
    const data = req.body;
    //  validate.validarNombreoApellidos()
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generando la sal.');
        }

        // Hashea la contraseña con la "sal"
        bcrypt.hash(data.contraseña, salt, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error hasheando la contraseña.');
            }

            // Sustituye la contraseña original con la contraseña hasheada
            data.contraseña = hashedPassword;
            req.getConnection((err, conn) => {
                conn.query('INSERT INTO usuario set ?', [data], (err, usuario) => {
                    console.log(usuario);
                    console.log(err)
                    res.redirect('/list');

                });

            });
        });
    });
};
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {

        conn.query('SELECT * FROM usuario WHERE id=?', [id], (err, usuario) => {
            res.render('customer_edit', {
                data: usuario[0]
            });


        });

    });
};


controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {

        conn.query('DELETE FROM usuario WHERE id=?', [id], (err, usuario) => {
            console.log(usuario);
            console.log(err);
            res.redirect('/list');

        });

    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const data = req.body;
            // Sustituye la contraseña original con la contraseña hasheada
            req.getConnection((err, conn) => {
                conn.query('UPDATE usuario set ? WHERE id =?', [data, id], (err, usuario) => {
                    console.log(usuario);
                    console.log(err);
                    res.redirect('/list');

                });
            });
};




module.exports = controller;