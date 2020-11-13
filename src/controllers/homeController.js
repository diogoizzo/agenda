const Contato = require('../models/ContatoModel');
exports.index = async (req, res) => {
  let logado = false;
  if (req.session.user){
    const contatos = await Contato.buscaContatos();
    res.render('index', {contatos}, logado);
  }else{
    let contatos = {};
    res.render('index', {contatos});
  }
  
};

