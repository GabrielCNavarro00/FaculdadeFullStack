const express = require('express');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

// 🔴 COLOCA SUA SENHA AQUI
const url = "mongodb+srv://gabriel:senhamongodb@cluster0.upue8sn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(url);

let usuarios;

const app = express();

// CONFIGURAÇÕES
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

// 🔥 CONECTA NO MONGODB
client.connect()
.then(() => {
    console.log("Conectado ao MongoDB");

    const dbo = client.db("ExemploDB");
    usuarios = dbo.collection("Usuarios");
})
.catch(err => console.log(err));

// SERVIDOR
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
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

// 🔵 ROTA INICIAL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Aula07/aula.html');
});

// 🟢 FORM GET
app.get('/inicio', (req, res) => {
    const { text, num, date, color, password } = req.query;

    console.log("GET:", text, num, date, color, password);

    res.send("Dados recebidos via GET");
});

// 🟣 FORM POST
app.post('/inicio', (req, res) => {
    const { text, num, date, color, password } = req.body;

    console.log("POST:", text, num, date, color, password);

    res.send("Dados recebidos via POST");
});

// 🔴 CADASTRO SIMPLES
app.post('/cadastro', (req, res) => {
    const { nome, login, senha } = req.body;

    console.log("CADASTRO:", nome, login, senha);

    res.render('resposta', {
        resposta: "Cadastrado com sucesso"
    });
});

// 🔵 CADASTRO NO BANCO
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