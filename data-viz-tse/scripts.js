var treatData = function(rawData, typeData){

    if(typeData == "gender"){
        var feminino = rawData["FEMININO"];
        var masculino = rawData["MASCULINO"];
        var naoInformado = rawData["NÃO INFORMADO"] ? rawData["NÃO INFORMADO"] : 0;  
        var dadosObj = [{ graph: "Homens vs Mulheres" , fem: feminino, mas: masculino, nao: naoInformado }];
        
        var treatedData=['mas','fem', 'nao'].map(function(key,i){
            return dadosObj.map(function(d,j){
                return {x: d['graph'], y: d[key] };
            })
        })
    }


    if(typeData == "escolaridade"){

        //{"ENSINO MÉDIO INCOMPLETO": 46, "LÊ E ESCREVE": 4, "SUPERIOR INCOMPLETO": 116, "ENSINO FUNDAMENTAL INCOMPLETO": 37, "ENSINO MÉDIO COMPLETO": 396, "SUPERIOR COMPLETO": 562, "ENSINO FUNDAMENTAL COMPLETO": 35, "Nome": "Grau de Instrução"}

        var ensMedio = rawData["ENSINO MÉDIO INCOMPLETO"] ? rawData["ENSINO MÉDIO INCOMPLETO"] : 0;  
        var leEscreve = rawData["LÊ E ESCREVE"] ? rawData["LÊ E ESCREVE"] : 0;  
        var supCompleto = rawData["SUPERIOR INCOMPLETO"] ? rawData["SUPERIOR INCOMPLETO"] : 0;  
        var funIncompleto = rawData["ENSINO FUNDAMENTAL INCOMPLETO"] ? rawData["ENSINO FUNDAMENTAL INCOMPLETO"] : 0;  
        var medioCompleto = rawData["ENSINO MÉDIO COMPLETO"] ? rawData["ENSINO MÉDIO COMPLETO"] : 0;  
        var supCompleto = rawData["SUPERIOR COMPLETO"] ? rawData["SUPERIOR COMPLETO"] : 0;  
        var funCompleto = rawData["ENSINO FUNDAMENTAL COMPLETO"] ? rawData["ENSINO FUNDAMENTAL COMPLETO"] : 0;


        var analfabeto = rawData["ANALFABETO"] ? rawData["ANALFABETO"] : 0;

        var dadosObj = [{ graph: "Grau de Escolaridade dos Candidatos", ensMedio: ensMedio, leEscreve: leEscreve, supCompleto: supCompleto, funIncompleto:funIncompleto , medioCompleto: medioCompleto, supCompleto:supCompleto, funCompleto:funCompleto, analfabeto:analfabeto }];
        
        var treatedData=['ensMedio','leEscreve', 'supCompleto', 'funIncompleto', 'medioCompleto', 'supCompleto', 'funCompleto', 'analfabeto'].map(function(key,i){
            return dadosObj.map(function(d,j){
                return {x: d['graph'], y: d[key] };
            })
        })
    }
    

    return(treatedData);
}


// .dark-primary-color    { background: #D32F2F; }
// .default-primary-color { background: #F44336; }
// .light-primary-color   { background: #FFCDD2; }
// .text-primary-color    { color: #FFFFFF; }
// .accent-color          { background: #FF5252; }
// .primary-text-color    { color: #212121; }
// .secondary-text-color  { color: #757575; }
// .divider-color         { border-color: #BDBDBD; }


var drawStackedGraph = function(data, selector, colorTheme){
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .35);

    var y = d3.scale.linear()
            .rangeRound([height, 0]);
    

    if(colorTheme == "gender"){
        var colorRange = ['#2B3A67', '#E84855', "#222"];
    }
    if(colorTheme == "escolaridade"){
        var colorRange = ["#D32F2F", "#F44336", "#FFCDD2", "#FF5252", "#212121", "#757575", "#BDBDBD"];
    }
    if(colorTheme == "etnia"){
        var colorRange = ["#D32F2F", "#F44336", "#FFCDD2", "#FF5252", "#212121", "#757575", "#BDBDBD"];
    }
    
    
    var color = d3.scale.ordinal().range(colorRange);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
            
    var svg = d3.select(selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var dataStackLayout = d3.layout.stack()(data);

    x.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
        
    y.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) { return d.y0 + d.y;})
        ])
        .nice();
        
    var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });
        
    layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y + d.y0);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());
        
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

var errorLoading = function(selector){
    var pai = $(selector).closest("[data-graph]")[0];
    $(pai).addClass("not-loaded");
}

var data = {};

//genero total
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/ba-ds-genero.json",
    data: data
}).done(function(data){
    drawStackedGraph(treatData(data, "gender"), "#genero svg", "gender")
    var parent = $("#genero svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#genero svg"));

var data = {};

//genero eleitorado
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/perfil-genero.json",
    data: data
}).done(function(data){
    console.log(data);
    drawStackedGraph(treatData(data, "gender"), "#genero-eleitorado svg", "gender")
    var parent = $("#genero-eleitorado svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#genero-eleitorado svg"));

//instrucao candidatos
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/ba-ds-grau-instrucao.json",
    data: data
}).done(function(data){
    console.log(data);
    drawStackedGraph(treatData(data, "escolaridade"), "#escolaridade-candidatos svg","escolaridade")
    var parent = $("#escolaridade-candidatos svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#escolaridade-candidatos svg"));


//instrucao candidatos
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/perfil-instrucao.json",
    data: data
}).done(function(data){
    console.log(data);
    drawStackedGraph(treatData(data, "escolaridade"), "#escolaridade-eleitores svg", "escolaridade")
    var parent = $("#escolaridade-eleitores svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#escolaridade-eleitores svg"));