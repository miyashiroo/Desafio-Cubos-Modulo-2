const bancoDeDados = require("../bancodedados/bancodedados.js");

const verificaSenha = async (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }

  if (String(senha_banco) !== (await bancoDeDados.banco.senha)) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }

  next();
};

module.exports = { verificaSenha };
