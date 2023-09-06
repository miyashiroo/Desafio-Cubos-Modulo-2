const bancoDeDados = require("../bancodedados/bancodedados");

let verificaConta = (numeroConta) => {
  let contaExiste = bancoDeDados.contas.some((usuario) => {
    return usuario.numero === String(numeroConta);
  });

  if (contaExiste) {
    return true;
  }
  return false;
};
module.exports = verificaConta;
