const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');
const urlApi = "https://dadosabertos.camara.leg.br/api/v2/proposicoes/";


$(document).ready(function() {
  if(myParam != null){
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
        document.getElementById('google-search').src += proposicao.siglaTipo+ "+" + proposicao.numero+"%2F"+proposicao.ano;
        $("#modal-loading").hide();
        console.log(proposicao);
        console.debug("Request Complete");
      });

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }else{
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

}