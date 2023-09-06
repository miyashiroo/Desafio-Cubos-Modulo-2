let bancoDeDados = require("../bancodedados/bancodedados");

const verificaConta = require("../utilitarios/verificaConta");
const procuraUsuario = require("../utilitarios/procuraUsuario");
const { format } = require("date-fns");

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_destino) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta destino precisa ser informada!" });
  }
  if (!numero_conta_origem) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta destino precisa ser informada!" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "Senha obrigatória" });
  }
  if (!valor) {
    return res.status(400).json({ mensagem: "Valor Obrigatório" });
  }

  let contaOrigem = procuraUsuario(numero_conta_origem);
  if (!contaOrigem) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta de origem não existe" });
  }

  let contaDestino = procuraUsuario(numero_conta_destino);
  if (!contaDestino) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta de destino não existe" });
  }

  if (contaOrigem.usuario.senha !== senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada está incorreta!" });
  }

  if (valor > contaOrigem.saldo) {
    return res
      .status(401)
      .json({ mensagem: "Saldo insuficiente para transferência" });
  }

  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  let data = format(new Date(), "yyyy-MM-dd HH:mm:ss").toString();

  let transferencia = {
    data: data,
    numero_conta_origem: String(numero_conta_origem),
    numero_conta_destino: String(numero_conta_destino),
    valor: valor,
  };

  bancoDeDados.transferencias.push(transferencia);

  return res.status(204).json();
};

module.exports = transferir;
