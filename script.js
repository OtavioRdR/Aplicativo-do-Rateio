var pessoas = [];
var despesas = [];
function adicionarPessoa() {
    var nomePessoa = document.getElementById('nomePessoa').value;
    var numeroPessoa = document.getElementById('numeroPessoa').value;
    var diasFicados = parseInt(document.getElementById('diasFicados').value);
    if (nomePessoa && numeroPessoa && !isNaN(diasFicados)) {
        pessoas.push({ nome: nomePessoa, numero: numeroPessoa, diasFicados: diasFicados });
        document.getElementById('nomePessoa').value = '';
        document.getElementById('numeroPessoa').value = '';
        document.getElementById('diasFicados').value = '';
        atualizarListaPessoas();
    }
    else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}
function adicionarDespesa() {
    var nomeDespesa = document.getElementById('nomeDespesa').value;
    var valorDespesa = parseFloat(document.getElementById('valorDespesa').value);
    if (nomeDespesa && !isNaN(valorDespesa)) {
        despesas.push({ nome: nomeDespesa, valor: valorDespesa });
        document.getElementById('nomeDespesa').value = '';
        document.getElementById('valorDespesa').value = '';
        atualizarListaDespesas();
    }
    else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}
function atualizarListaPessoas() {
    var listaPessoas = document.getElementById('listaPessoas');
    listaPessoas.innerHTML = '';
    pessoas.forEach(function (pessoa) {
        var li = document.createElement('li');
        li.textContent = "".concat(pessoa.nome, " - ").concat(pessoa.numero, " - Dias: ").concat(pessoa.diasFicados);
        var button = document.createElement('button');
        button.textContent = 'Mandar Valor';
        button.onclick = function () { return enviarWhatsApp(pessoa); };
        li.appendChild(button);
        listaPessoas.appendChild(li);
    });
}
function atualizarListaDespesas() {
    var listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    despesas.forEach(function (despesa) {
        var li = document.createElement('li');
        li.textContent = "".concat(despesa.nome, ": R$ ").concat(despesa.valor.toFixed(2));
        listaDespesas.appendChild(li);
    });
}
function calcularRateio() {
    var totalDespesas = despesas.reduce(function (total, despesa) { return total + despesa.valor; }, 0);
    var totalDias = pessoas.reduce(function (total, pessoa) { return total + pessoa.diasFicados; }, 0);
    var valorPorDia = totalDias > 0 ? totalDespesas / totalDias : 0;
    var resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = "<p>Total de Despesas: R$ ".concat(totalDespesas.toFixed(2), "</p>");
    resultadoDiv.innerHTML += "<p>Valor por Dia: R$ ".concat(valorPorDia.toFixed(2), "</p>");
    resultadoDiv.innerHTML += '<h3>Valores a Pagar:</h3>';
    pessoas.forEach(function (pessoa) {
        var valorAPagar = valorPorDia * pessoa.diasFicados;
        resultadoDiv.innerHTML += "<p>".concat(pessoa.nome, ": R$ ").concat(valorAPagar.toFixed(2), "</p>");
    });
}
function gerarPDF() {
    var resultadoDiv = document.getElementById('resultado');
    var pdfContent = resultadoDiv.innerHTML;
    var win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Rateio PDF</title></head><body>');
    win.document.write(pdfContent);
    win.document.write('</body </html>');
    win.document.close();
    win.print();
}
function enviarWhatsApp(pessoa) {
    var totalDespesas = despesas.reduce(function (total, despesa) { return total + despesa.valor; }, 0);
    var totalDias = pessoas.reduce(function (total, pessoa) { return total + pessoa.diasFicados; }, 0);
    var valorPorDia = totalDias > 0 ? totalDespesas / totalDias : 0;
    var valorAPagar = valorPorDia * pessoa.diasFicados;
    var mensagem = "Ol\u00E1 ".concat(pessoa.nome, ",\n\nTotal de Despesas: R$ ").concat(totalDespesas.toFixed(2), "\nValor a Pagar: R$ ").concat(valorAPagar.toFixed(2));
    var url = "https://api.whatsapp.com/send?phone=".concat(pessoa.numero.replace(/\D/g, ''), "&text=").concat(encodeURIComponent(mensagem));
    window.open(url, '_blank');
}
function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle('dark-mode');
}
