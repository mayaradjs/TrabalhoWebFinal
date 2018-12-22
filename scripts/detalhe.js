const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');
const urlApi = "https://dadosabertos.camara.leg.br/api/v2/proposicoes/";


$(document).ready(function() {
  if (myParam != null) {
    $("#modal-loading").show();
    var proposicao = {
      siglaTipo: "",
      numero: "",
      ementa: "",
      ementaDetalhada: "",
      ano: "",
      autores: [],
      descricaoTramitacao: "",
      descricaoSituacao: "",
      regime: "",
      despacho: "",
      url: "",
      dataApresentacao: ""
    }

    $.ajax({
        url: urlApi + myParam,
        type: 'GET',
        dataType: 'text',
        headers: {
          Accept: "application/xml; charset=utf-8"
        }
      })
      .done(function(result) {
        console.log(result);
        var xml = new DOMParser().parseFromString(result, "text/xml");
        var retorno = xml.getElementsByTagName("dados");
        proposicao.siglaTipo = retorno[0].getElementsByTagName("siglaTipo")[0].innerHTML.trim();
        proposicao.numero = retorno[0].getElementsByTagName("numero")[0].innerHTML;
        proposicao.ementa = retorno[0].getElementsByTagName("ementa")[0].innerHTML;
        proposicao.ementaDetalhada = retorno[0].getElementsByTagName("ementaDetalhada")[0].innerHTML;
        proposicao.ano = retorno[0].getElementsByTagName("ano")[0].innerHTML;
        proposicao.descricaoTramitacao = retorno[0].getElementsByTagName("descricaoTramitacao")[0].innerHTML;
        proposicao.descricaoSituacao = retorno[0].getElementsByTagName("descricaoSituacao")[0].innerHTML;
        proposicao.regime = retorno[0].getElementsByTagName("regime")[0].innerHTML;
        proposicao.despacho = retorno[0].getElementsByTagName("despacho")[0].innerHTML;
        proposicao.url = retorno[0].getElementsByTagName("url")[0].innerHTML;
        data = retorno[0].getElementsByTagName("dataApresentacao")[0].innerHTML;
        data = data.slice(0, data.length - 6);
        proposicao.dataApresentacao = data;
        var uriAutores = retorno[0].getElementsByTagName("uriAutores")[0].innerHTML;
        proposicao.autores = retornaVetorDeAutores(uriAutores, proposicao);

      })
      .fail(function(result) {
        //trocarContexto("principal");
        alert("Algo não ocorreu como deveria.");
        window.location.href = "index.html";
      })
      .always(function() {
        renderProposicao(proposicao);
        document.getElementById('google-search').src += proposicao.siglaTipo + "+" + proposicao.numero + "%2F" + proposicao.ano;
        $("#modal-loading").hide();
        console.log(proposicao);
        console.debug("Request Complete");
      });


  } else {
    alert("Não foi informado a proposição");
    window.location.href = "index.html";
  }
});

function retornaVetorDeAutores(uriAutores) {
  var result = getAutores(uriAutores);
  autores = [];
  var xml = new DOMParser().parseFromString(result, "text/xml");
  var retorno = xml.getElementsByTagName("autor");
  for (i = 0; i < retorno.length; i++) {
    autores.push(retorno[i].getElementsByTagName("nome")[0].innerHTML)
  }
  return autores;
}

function getAutores(uriAutores) {
  return $.ajax({
    url: uriAutores,
    type: 'GET',
    dataType: 'text',
    headers: {
      Accept: "application/xml; charset=utf-8"
    },
    async: false
  }).responseText;
}

function renderProposicao(prop) {
  $("#tituloProposicao").text(prop.siglaTipo + prop.numero + "/" + prop.ano);
  $("#ementa").text(prop.ementa);
  $("#dataApresentacao").text(prop.dataApresentacao);
  $("#autores").text(prop.autores);
  var cont = "<b>Tramitação: </b>" + prop.descricaoTramitacao + "<br>" +
    "<b>Situação: </b>" + prop.descricaoSituacao + "<br>" +
    "<b>Regime: </b>" + prop.regime + "<br>" +
    "<b>Despacho: </b>" + prop.despacho + "<br>";
  document.getElementById("status").innerHTML = cont;
  $("#ementaDetalhada").text(prop.ementaDetalhada);
  $('#ementaIntegra').attr('href', prop.url);
  if (prop.url == "")
    $('#ementaIntegra').hide();
}

function buscarMais() {
  $("#titPesquisaMais").show();
  $("#google-search").show();
  $("#buscarMais").hide();
}