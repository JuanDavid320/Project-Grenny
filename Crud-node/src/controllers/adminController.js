const Pool = require("mysql/lib/Pool");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const controller = {};

controller.render = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }
        res.render('join-admin', {
        });
    });
};
controller.join = (req, res) => {
    const usuarioV = req.body.usuario;
    const contraseña = req.body.contraseña;
    req.getConnection((err, conn) => {
        conn.query('SELECT Nombre_usuario, contraseña FROM admin WHERE Nombre_usuario = BINARY ? ;', [usuarioV], (err, usuario) => {
            if (err) {
                res.json(err);
            }
            if (usuario.length == 0) {
                res.redirect('/admin?alert=Usuario no encontrado')
            } else {
                storedPassword= usuario[0].contraseña;
                console.log(storedPassword);
           const valid= bcrypt.compare(contraseña, storedPassword);
            bcrypt.compare( contraseña,storedPassword, function (err, passwordMatch) {
               
                if (err || passwordMatch== false) {
                    console.log(contraseña)
                    console.log(passwordMatch)
                    return res.redirect('/admin?alert=Contraseña incorrecta');
                  
                }else {
                    console.log(contraseña)
                    console.log(passwordMatch)
                    res.redirect('/dashboardA')
                
            }
            });


            }


        });


    });

};
controller.renderD = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }
        res.render('DasboardA', {
        });
    });
};
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM admin', (err, usuario) => {
            if (err) {
                res.json(err);

            }
            console.log(usuario);
            res.render('admin', {
                data: usuario
            });
        });

    });
};

controller.save = (req, res) => {
    const data = req.body;
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
                conn.query('INSERT INTO admin set ?', [data], (err, usuario) => {
                    console.log(usuario);
                    console.log(err)
                    res.redirect('/listA');

                });
            });
        });
    });
};
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {

        conn.query('SELECT * FROM admin WHERE id=?', [id], (err, usuario) => {
            res.render('admin_edit', {
                data: usuario[0]
            });


        });

    });
};


controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {

        conn.query('DELETE FROM admin WHERE id=?', [id], (err, usuario) => {
            console.log(usuario);
            console.log(err);
            res.redirect('/listA');

        });

    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const data = req.body;
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
                conn.query('UPDATE admin set ? WHERE id =?', [data, id], (err, usuario) => {
                    console.log(usuario);
                    console.log(err);
                    res.redirect('/listA');

                });
            });
        });
    });
};




module.exports = controller;