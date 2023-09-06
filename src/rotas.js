const express = require("express");
const rotas = express();
const { verificaSenha } = require("./intermediario/verificaSenha");
const {
  listaTodasContas,
  criarConta,
  atualizaDados,
  deletaConta,
  listarSaldo,
  listarExtrato,
} = require("./controladores/contas");
const depositar = require("./controladores/depositos");
const sacar = require("./controladores/saques");
const transferir = require("./controladores/transferencias");

rotas.get("/contas", verificaSenha, listaTodasContas);
rotas.post("/contas", criarConta);
rotas.put("/contas/:numeroConta/usuario", atualizaDados);
rotas.delete("/contas/:numeroConta", deletaConta);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", transferir);
rotas.get("/contas/saldo", listarSaldo);
rotas.get("/contas/extrato", listarExtrato);
module.exports = rotas;
