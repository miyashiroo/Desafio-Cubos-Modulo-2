let bancoDeDados = require("../bancodedados/bancodedados");

const verificaConta = require("../utilitarios/verificaConta");
const procuraUsuario = require("../utilitarios/procuraUsuario");
const { format } = require("date-fns");

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "Senha Invalida" });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "O valor não pode ser menor que zero!" });
  }

  let naoEhNumero = isNaN(valor) || isNaN(numero_conta);

  if (naoEhNumero) {
    return res.status(400).json({
      mensagem: "Numero do valor ou numero da conta informado é invalido",
    });
  }
  let contaExiste = verificaConta(String(numero_conta));

  if (!contaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada não existe" });
  }

  let conta = procuraUsuario(numero_conta);
  if (conta.usuario.senha !== senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada incorreta!" });
  }

  if (valor > conta.saldo) {
    return res.status(401).json({ mensagem: "Saldo insuficiente para saque" });
  }

  conta.saldo -= valor;
  // refatorar essa parte de registro, fazer função.
  let data = format(new Date(), "yyyy-MM-dd HH:mm:ss").toString();

  let saque = {
    data: data,
    numero_conta: String(numero_conta),
    valor: valor,
  };

  bancoDeDados.saques.push(saque);

  return res.status(204).json();
};
module.exports = sacar;
