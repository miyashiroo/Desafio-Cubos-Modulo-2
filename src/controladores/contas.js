let bancoDeDados = require("../bancodedados/bancodedados");
const verificaEmail = require("../utilitarios/verificaEmail");
const verificaCpf = require("../utilitarios/verificaCpf");
const verificaConta = require("../utilitarios/verificaConta");
const procuraUsuario = require("../utilitarios/procuraUsuario");

const listaTodasContas = async (req, res) => {
  return res.status(200).json(bancoDeDados.contas);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  // fazer função pra verificar se tá vazio e só passar os const pra elas.

  if (!cpf) {
    return res.status(400).json({ mensagem: "O CPF não foi Informado" });
  }
  if (!nome) {
    return res.status(400).json({ mensagem: "O Nome não foi Informado" });
  }
  if (!data_nascimento) {
    return res
      .status(400)
      .json({ mensagem: "A Data de Nascimento não foi informada" });
  }
  if (!telefone) {
    return res.status(400).json({ mensagem: "O Telefone não foi Informado" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "O Email não foi Informado" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A Senha não foi Informado" });
  }

  const cpfJaExiste = verificaCpf(cpf);

  if (cpfJaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o cpf informado!" });
  }

  const emailJaExiste = verificaEmail(email);

  if (emailJaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o e-mail informado!" });
  }

  // adiciona a conta no banco de dados
  bancoDeDados.contas.push({
    numero: String(bancoDeDados.contadorContas++),
    saldo: 0,
    usuario: {
      nome: nome,
      cpf: cpf,
      data_nascimento: data_nascimento,
      telefone: telefone,
      email: email,
      senha: senha,
    },
  });

  return res.status(204).json();
};

const atualizaDados = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  if (!cpf) {
    return res.status(400).json({ mensagem: "O CPF não foi Informado" });
  }
  if (!nome) {
    return res.status(400).json({ mensagem: "O Nome não foi Informado" });
  }
  if (!data_nascimento) {
    return res
      .status(400)
      .json({ mensagem: "A Data de Nascimento não foi informada" });
  }
  if (!telefone) {
    return res.status(400).json({ mensagem: "O Telefone não foi Informado" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "O Email não foi Informado" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A Senha não foi Informado" });
  }

  let naoEhNumero = isNaN(numeroConta);
  if (naoEhNumero) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada é invalido" });
  }

  let contaExiste = verificaConta(String(numeroConta));

  if (!contaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada não existe" });
  }

  const cpfJaExiste = verificaCpf(cpf);

  if (cpfJaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o cpf informado!" });
  }

  const emailJaExiste = verificaEmail(email);

  if (emailJaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o e-mail informado!" });
  }

  let conta = procuraUsuario(numeroConta);

  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  return res.status(204).json();
};

const deletaConta = (req, res) => {
  const { numeroConta } = req.params;

  let naoEhNumero = isNaN(numeroConta);
  if (naoEhNumero) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada é invalido" });
  }

  let contaExiste = verificaConta(String(numeroConta));

  if (!contaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Numero da conta informada não existe" });
  }

  let saldoConta = procuraUsuario(numeroConta).saldo;

  if (saldoConta > 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  bancoDeDados = bancoDeDados.contas.filter((conta) => {
    return conta.numero !== numeroConta;
  });

  return res.status(204).json();
};

const listarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta é obrigatórios!" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A senha é obrigatória" });
  }

  let contaExiste = verificaConta(String(numero_conta));

  if (!contaExiste) {
    return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
  }

  let conta = procuraUsuario(numero_conta);
  if (conta.usuario.senha !== senha) {
    return res.status(401).json({
      mensagem: "A senha do banco informada está incorreta incorreta!",
    });
  }

  return res.status(200).json({ saldo: conta.saldo });
};

const listarExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta é obrigatórios!" });
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "A senha é obrigatória" });
  }

  let contaExiste = verificaConta(String(numero_conta));

  if (!contaExiste) {
    return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
  }

  let conta = procuraUsuario(numero_conta);

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({
      mensagem: "A senha do banco informada está incorreta incorreta!",
    });
  }

  let depositosDaConta = bancoDeDados.depositos.filter((deposito) => {
    return deposito.numero_conta === numero_conta;
  });

  let saquesDaConta = bancoDeDados.saques.filter((saques) => {
    return saques.numero_conta === numero_conta;
  });

  let transferenciasEnviadasDaConta = bancoDeDados.transferencias.filter(
    (transferencias) => {
      return transferencias.numero_conta_origem === numero_conta;
    }
  );

  let transferenciasRecebidasDaConta = bancoDeDados.transferencias.filter(
    (transferencias) => {
      return transferencias.numero_conta_destino === numero_conta;
    }
  );

  let extrato = {
    depositos: depositosDaConta,
    saques: saquesDaConta,
    transferenciasEnviadas: transferenciasEnviadasDaConta,
    transferenciasRecebidas: transferenciasRecebidasDaConta,
  };

  return res.status(200).json(extrato);
};

module.exports = {
  listaTodasContas,
  criarConta,
  atualizaDados,
  deletaConta,
  listarSaldo,
  listarExtrato,
};
