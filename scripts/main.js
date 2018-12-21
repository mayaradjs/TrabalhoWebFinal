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
  $("#proposicoes").hide();

  $('input, select').keyup(function(event) {
    if (event.keyCode == keyEnter)
      buscar();
  });
});
//Buscar proposições de acordo com os filtros selecionados
function buscar() {
  $("#modal-loading").show();
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
      if(proposicoes.length > 0)
        renderProposicoes(proposicoes);
      $("#modal-loading").hide();

      if(proposicoes <= 0)
        alert("Não existe resultado que atenda os filtros selecionados");

      console.log(proposicoes);
      console.debug("Request Complete");
    });
}

function renderProposicoes(props) {
  $("#proposicoes").show();
  var body = document.getElementById('resultados');
  limpaPropoosicoes(body);
  var tbl = document.createElement('table');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < props.length; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = "<b><a href='Detalhe.html?id=" + props[i].id + "' target='_blank'>" +
      props[i].siglaTipo + props[i].numero + "</a></b> (" + props[i].ano + ") <br>" +
      props[i].ementa + "<br>";
    td.appendChild(document.createTextNode('\u0020'))
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  rederGraficos(body,props);
}

function rederGraficos($jqueryObject, dados) {
  graficoPorAno(dados);
  graficoPorSigla(dados);
}

function graficoPorAno(dados) {
  var ctx = document.getElementById("porAno").getContext('2d');
  var ChartPorAno = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: '# de Proposições por ano',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 3
      }]
    },
    options: {
      title: {
          display: true,
          text: 'Número de Proposições X Ano das Proposições'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  //Contar ocorrencias no objeto
  var counts = {};
  for (var i = 0; i < dados.length; i++) {
    var num = dados[i].ano;
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  var data = ChartPorAno.config.data;
  for (var key in counts) {
      if (counts.hasOwnProperty(key)) {
        data.labels.push(key);
          data.datasets[0].data.push(counts[key]);
      }
  }
  ChartPorAno.update();
}

function graficoPorSigla(dados) {
  var ctx = document.getElementById("porSigla").getContext('2d');
  var CharPorSigla = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '# de Proposições por tipo',
        data: [],
        backgroundColor:  'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      title: {
          display: true,
          text: 'Número de Proposições X Tipo das Proposições'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  //Contar ocorrencias no objeto
  var counts = {};
  for (var i = 0; i < dados.length; i++) {
    var num = dados[i].siglaTipo;
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  var data = CharPorSigla.config.data;
  for (var key in counts) {
      if (counts.hasOwnProperty(key)) {
        data.labels.push(key);
          data.datasets[0].data.push(counts[key]);
      }
  }
  CharPorSigla.update();
}

function limparFiltros() {
  $('#filtros input').val('');
  $("#ddwOrdenacao").val($("#ddwOrdenacao option:first").val());
  $("#ddwOrdem").val($("#ddwOrdem option:first").val());
}

function limpaPropoosicoes($jqueryObject) {
  $jqueryObject.innerHTML = "";
}