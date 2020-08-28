require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://admin-dallyla:'+process.env.DB_PASS+'@cluster0.bpdjw.mongodb.net/pedidosDb?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


//Model

const Pedido = mongoose.model('Pedido',{
    numPedido: String,
    nomeCliente: String,
    cpf: String,
    produtos: String,
    valorMercadorias: String,
    valorFrete: String,
    valorTotal: String
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res){
    res.render("home");
});

app.get("/cadastrar", function(req, res){
    res.render("cadastrar");
});

app.get("/buscar", function(req, res){
    res.render("buscar");
});



app.post("/cadastrar", function(req,res){
    const pedido = new Pedido({
        numPedido: req.body.numeroPedido,
        nomeCliente: req.body.nomeCliente ,
        cpf: req.body.cpfCliente,
        produtos: req.body.produtos,
        valorMercadorias: req.body.valorMercadorias,
        valorFrete: req.body.valorFrete,
        valorTotal: req.body.valorTotal
    });

    pedido.save(function(err){
        if(!err){
            console.log("Adicionado novo pedido ao DB.");
            res.redirect("/cadastrar");
        }
    });
});



app.post("/buscar", function(req, res){
    Pedido.find({$or:[{numPedido: req.body.buscarNumPedido}, {nomeCliente: req.body.buscarNomeCliente},{cpf: req.body.buscarCpfCliente}]}, function(err, encontrados){
        if(!err){
            res.render("resultado", {pedidos: encontrados});
        } else{
            console.log(err);
        }
    });
});

app.post("/deletar", function(req, res){
    Pedido.deleteOne({numPedido: req.body.delete}, function(err){
        if(!err){
            res.redirect("/buscar");
        } else{
            console.log(err);
        }
    });
});



// app.get("/resultado", function(req, res){
//     res.render("resultado");
// });











app.listen("3000", function(){
    console.log("Server started on port 3000.");
});