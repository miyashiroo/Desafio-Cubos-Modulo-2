const bancoDeDados = require("../bancodedados/bancodedados");
const procuraUsuario = (numeroConta) => {
  let usuario = bancoDeDados.contas.find((usuario) => {
    return usuario.numero === String(numeroConta);
  });
  return usuario;
};

module.exports = procuraUsuario;
