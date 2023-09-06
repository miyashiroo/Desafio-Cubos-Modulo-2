const bancoDeDados = require("../bancodedados/bancodedados");

const verificaEmail = (email) => {
  let resultadoEmailUnico = bancoDeDados.contas.some((conta) => {
    return conta.usuario.email === String(email);
  });

  if (resultadoEmailUnico) {
    return true;
  }
  return false;
};
module.exports = verificaEmail;
