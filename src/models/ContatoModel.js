const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default:''},
  email: { type: String, required: false, default:'' },
  telefone: { type: String, required: false, default:'' },
  criadoEm: {type: Date, default: Date.now },
  criadoPor: {type: String, required: true}
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body){
  this.body = body;
  this.errors = [];
  this.contato = null;
}
Contato.prototype.register = async function(criadoPor){
  this.valida();
  this.body.criadoPor = criadoPor;
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function(){
  this.cleanUp();
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');
  if(!this.body.email && !this.body.telefone){
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou tefefone');
  }
}

Contato.prototype.cleanUp = function(){
  for (let key in this.body){
      if (typeof this.body[key] !== 'string'){
          this.body[key] = '';
      }
  }
  this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone
  };
}

Contato.buscaPorId = async function(id){
  if (typeof id !== 'string') return;
  const user = await ContatoModel.findById(id);
  return user;
};

Contato.prototype.edit = async function(id){
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});
};

Contato.buscaContatos = async function(user){
  try{
    console.log(user);
    const contatos = await ContatoModel.find({criadoPor: user})
      .sort({criadoEm: -1});
    return contatos;
  }catch (e){
    console.log(e);
    res.render('404');
  }
};
Contato.delete = async function(id){
  try{
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
  }catch (e){
    console.log(e);
    res.render('404');
  }
};

module.exports = Contato;
