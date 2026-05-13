const express = require('express');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const url = "mongodb+srv://gabriel:senhamongodb@cluster0.upue8sn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(url);

let usuarios;

const app = express();

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

client.connect()
.then(() => {
    console.log("Conectado ao MongoDB");

    const dbo = client.db("ExemploDB");
    usuarios = dbo.collection("Usuarios");
})
.catch(err => console.log(err));

app.listen(10, () => {
    console.log("Servidor rodando em http://localhost:10");
});


 app.post("/logar_usuario", function(req, resp) {
    var data = {db_login: req.body.login, db_senha: req.body.senha };

    usuarios.find(data).toArray(function(err, items) {
      console.log(items);
      if (items.length == 0) {
        resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
      }else if (err) {
        resp.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
      }else {
        resp.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"})        
      };
    });

  });


  app.post("/logar_usuario", function (req, res) {
        const data = {
            db_login: req.body.login,
            db_senha: req.body.senha
        };

        usuarios.find(data).toArray(function (err, items) {
            console.log(items);
            if (items.length == 0) {
                res.render('resposta_usuario', {
                    resposta: "Usuário/senha não encontrado!"
                });
            } else if (err) {
                res.render('resposta_usuario', {
                    resposta: "Erro ao logar usuário!"
                });
            } else {
                res.render('resposta_usuario', {
                    resposta: "Usuário logado com sucesso!"
                });
            }
        });
    });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Aula07/aula.html');
});

app.get('/inicio', (req, res) => {
    const { text, num, date, color, password } = req.query;

    console.log("GET:", text, num, date, color, password);

    res.send("Dados recebidos via GET");
});

app.post('/inicio', (req, res) => {
    const { text, num, date, color, password } = req.body;

    console.log("POST:", text, num, date, color, password);

    res.send("Dados recebidos via POST");
});

app.post('/cadastro', (req, res) => {
    const { nome, login, senha } = req.body;

    console.log("CADASTRO:", nome, login, senha);

    res.render('resposta', {
        resposta: "Cadastrado com sucesso"
    });
});

app.post("/cadastrar_usuario", async (req, res) => {
    try {
        const data = {
            db_nome: req.body.nome,
            db_login: req.body.login,
            db_senha: req.body.senha
        };

        await usuarios.insertOne(data);

        res.render('resposta_usuario', {
            resposta: "Usuário cadastrado com sucesso!"
        });

    } catch (err) {
        console.log(err);

        res.render('resposta_usuario', {
            resposta: "Erro ao cadastrar usuário!"
        });
    }
});

app.post ("/logar_usuario", function (req, res) {
    const data = {
        db_login: req.body.login,
        db_senha: req.body.senha
    };

    usuarios.findOne(data, function (err, items) {
        if (err) {
            res.render('resposta_usuario', {
                resposta: "Erro ao logar usuário!"
            });
        } else if (items.length === 0) {
            res.render('resposta_usuario', {
                resposta: "Usuário/senha não encontrado!"
            });
        } else {
            res.render('resposta_usuario', {
                resposta: "Usuário logado com sucesso!"
            });
        }
    });
});

app.post("/atualizar_usuario", function (req, res) {
    const filter = { db_login: req.body.login };
    const update = { $set: { db_senha: req.body.senha } };

    usuarios.updateOne(filter, update, function (err, result) {
        if (err) {
            res.render('resposta_usuario', {
                resposta: "Erro ao atualizar usuário!"
            });
        } else if (result.matchedCount === 0) {
            res.render('resposta_usuario', {
                resposta: "Usuário não encontrado!"
            });
        } else {
            res.render('resposta_usuario', {
                resposta: "Usuário atualizado com sucesso!"
            });
        }
    });
});

app.post("/deletar_usuario", function (req, res) {
    const filter = { db_login: req.body.login };
    const senha = req.body.senha;

    usuarios.deleteOne(filter, function (err, result) {
        if (err) {
            res.render('resposta_usuario', {
                resposta: "Erro ao deletar usuário!"
            });
        } else if (result.deletedCount === 0) {
            res.render('resposta_usuario', {
                resposta: "Usuário não encontrado!"
            });
        } else {
            res.render('resposta_usuario', {
                resposta: "Usuário deletado com sucesso!"
            });
        }
    });
});

