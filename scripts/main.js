const keyEnter = 13;
const urlApi = "https://dadosabertos.camara.leg.br/api/v2/proposicoes/";
//https://dadosabertos.camara.leg.br/swagger/api.html
//exemplo: https://dadosabertos.camara.leg.br/api/v2/proposicoes?id=56567657676&ordem=ASC&ordenarPor=id
/*$(function() {
  $(document).tooltip();
});
*/

// Busca quando aperta Enter
$(document).ready(function() {
  $('input, select').keyup(function(event) {
    if (event.keyCode == keyEnter)
      buscar();
  });
});
//Buscar proposições de acordo com os filtros selecionados
function buscar() {
  var parametros = "?"
  var dtInicio = $('#txtDataInicio').val();
  var dtFim = $('#txtDataFim').val();
  var ano = $('#txtAno').val();
  var numProposicao = $('#txtNumeroProposicao').val();
  var autor = $('#txtAutor').val();
  var partido = $('#txtPartido').val();
  var ordenacao = $('#ddwOrdenacao').val();
  var ordem = $('#ddwOrdem').val();
  if (dtInicio != "")
    parametros += "dataApresentacaoInicio=" + dtInicio + "&";
  if (dtFim != "")
    parametros += "dataApresentacaoFim=" + dtFim + "&";
  if (ano != "")
    parametros += "ano=" + ano + "&";
  if (numProposicao != "")
    parametros += "numero=" + numProposicao + "&";
  if (autor != "")
    parametros += "autor=" + autor + "&";
  if (partido != "")
    parametros += "siglaPartidoAutor=" + partido + "&";

  parametros += "ordernarPor=" + ordenacao + "&";
  parametros += "ordem=" + ordem + "&";

  //Para remover o ultimo character da string, normalmente o & ou ?
  parametros = parametros.slice(0, parametros.length - 1);

  var proposicoes = [];

  $.ajax({
      url: urlApi + parametros,
      type: 'GET',
      dataType: 'text',
      headers: {
        Accept: "application/xml; charset=utf-8"
      }
    })
    .done(function(result) {
      console.log(result);
      var xml = new DOMParser().parseFromString(result, "text/xml");
      var retorno = xml.getElementsByTagName("proposicao_");
      for (i = 0; i < retorno.length; i++) {
        var proposicao = {
          id: "",
          siglaTipo: "",
          numero: "",
          ementa: "",
          ano: "",
        }

        proposicao.id = retorno[i].getElementsByTagName("id")[0].innerHTML;
        proposicao.siglaTipo = retorno[i].getElementsByTagName("siglaTipo")[0].innerHTML.trim();
        proposicao.numero = retorno[i].getElementsByTagName("numero")[0].innerHTML;
        proposicao.ementa = retorno[i].getElementsByTagName("ementa")[0].innerHTML;
        proposicao.ano = retorno[i].getElementsByTagName("ano")[0].innerHTML;

        proposicoes.push(proposicao);
      }
    })
    .fail(function(result) {
      //trocarContexto("principal");
      alert("Algo não ocorreu como deveria.");
    })
    .always(function() {
      //$("#modal-loading").hide();
      renderProposicoes(proposicoes);
      console.log(proposicoes);
      console.debug("Request Complete");
    });
}

function renderProposicoes(props) {
  var body = document.getElementById('resultados');
  var tbl = document.createElement('table');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < props.length; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = props[i].ementa;
    td.appendChild(document.createTextNode('\u0020'))
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
}

//Exemplo de gráfico abaixo (pode remover)
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