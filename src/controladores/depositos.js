let bancoDeDados = require("../bancodedados/bancodedados");

const verificaConta = require("../utilitarios/verificaConta");
const procuraUsuario = require("../utilitarios/procuraUsuario");
const { format } = require("date-fns");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (valor <= 0) {
    return res.status(400).json({ mensagem: "O valor é negativo ou zerado." });
  }
  let naoEhNumero = isNaN(valor);

  if (naoEhNumero) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada é invalido" });
  }
  let contaExiste = verificaConta(String(numero_conta));

  if (!contaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada não existe" });
  }

  let conta = procuraUsuario(numero_conta);
  conta.saldo += valor;

  let data = format(new Date(), "yyyy-MM-dd HH:mm:ss").toString();

  let deposito = {
    data: data,
    numero_conta: String(numero_conta),
    valor: valor,
  };

  bancoDeDados.depositos.push(deposito);

  return res.status(204).json();
};

module.exports = depositar;
