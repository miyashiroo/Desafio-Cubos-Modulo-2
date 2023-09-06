const bancoDeDados = require("../bancodedados/bancodedados");

const verificaCpf = (cpf) => {
  let resultadoCpfUnico = bancoDeDados.contas.some((conta) => {
    return conta.usuario.cpf === String(cpf);
  });

  if (resultadoCpfUnico) {
    return true;
  }
  return false;
};

module.exports = verificaCpf;
