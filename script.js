let pessoas = [];
let despesas = [];

function validarFormularioPessoa() {
    const nomePessoa = document.getElementById('nomePessoa').value;
    const diasFicados = parseInt(document.getElementById('diasFicados').value);
    
    let valid = true;
    
    const nomeErro = document.getElementById('nomePessoaErro');
    if (!nomePessoa) {
        nomeErro.textContent = 'Nome é obrigatório!';
        valid = false;
    } else {
        nomeErro.textContent = '';
    }

    const diasErro = document.getElementById('diasFicadosErro');
    if (isNaN(diasFicados) || diasFicados <= 0) {
        diasErro.textContent = 'Digite um número de dias válido!';
        valid = false;
    } else {
        diasErro.textContent = '';
    }
    
    return valid;
}

function adicionarPessoa() {
    if (!validarFormularioPessoa()) {
        return;
    }
    
    const nomePessoa = document.getElementById('nomePessoa').value;
    const numeroPessoa = document.getElementById('numeroPessoa').value || undefined;
    const diasFicados = parseInt(document.getElementById('diasFicados').value);

    pessoas.push({ nome: nomePessoa, numero: numeroPessoa, diasFicados });
    document.getElementById('nomePessoa').value = '';
    document.getElementById('numeroPessoa').value = '';
    document.getElementById('diasFicados').value = '';
    
    atualizarListaPessoas();
}

function atualizarListaPessoas() {
    const listaPessoas = document.getElementById('listaPessoas');
    listaPessoas.innerHTML = '';
    pessoas.forEach(pessoa => {
        const li = document.createElement('li');
        li.textContent = `${pessoa.nome} - Dias: ${pessoa.diasFicados}`;
        listaPessoas.appendChild(li);
    });
}

function adicionarDespesa() {
    const nomeDespesa = document.getElementById('nomeDespesa').value;
    const valorDespesa = parseFloat(document.getElementById('valorDespesa').value);
    const categoria = document.getElementById('categoriaDespesa').value;

    if (nomeDespesa && !isNaN(valorDespesa)) {
        despesas.push({ nome: nomeDespesa, valor: valorDespesa, categoria });
        atualizarListaDespesas();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function atualizarListaDespesas() {
    const categoriaSelecionada = document.getElementById('categoriaDespesa').value;
    const listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    
    const despesasFiltradas = categoriaSelecionada
        ? despesas.filter(despesa => despesa.categoria === categoriaSelecionada)
        : despesas;

    despesasFiltradas.forEach(despesa => {
        const li = document.createElement('li');
        li.textContent = `${despesa.nome} - R$ ${despesa.valor.toFixed(2)} (${despesa.categoria})`;
        listaDespesas.appendChild(li);
    });
}

function calcularRateio() {
    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);
    const totalDias = pessoas.reduce((total, pessoa) => total + pessoa.diasFicados, 0);
    const valorPorDia = totalDias > 0 ? totalDespesas / totalDias : 0;

    let resultadoHTML = `<p>Total de Despesas: R$ ${totalDespesas.toFixed(2)}</p>`;
    resultadoHTML += `<p>Valor por Dia: R$ ${valorPorDia.toFixed(2)}</p>`;
    resultadoHTML += '<h3>Valores a Pagar:</h3>';
    
    pessoas.forEach((pessoa) => {
        let valorAPagar = valorPorDia * pessoa.diasFicados;
        resultadoHTML += `<p>${pessoa.nome}: R$ ${valorAPagar.toFixed(2)}</p>`;
    });

    document.getElementById('resultado').innerHTML = resultadoHTML;
}

function exportarParaCSV() {
    const header = ["Nome", "Número", "Dias Ficados", "Despesa", "Valor"];
    const rows = pessoas.map(pessoa => {
        const despesa = despesas.find(despesa => despesa.nome === pessoa.nome);
        return [
            pessoa.nome,
            pessoa.numero || '',
            pessoa.diasFicados,
            despesa?.nome || '',
            despesa?.valor.toFixed(2) || ''
        ];
    });

    let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rateio.csv");
    document.body.appendChild(link);
    link.click();
}

function exportarParaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Rateio de Despesas', 20, 20);
    
    let y = 30;
    pessoas.forEach(pessoa => {
        doc.text(`${pessoa.nome} - Dias: ${pessoa.diasFicados}`, 20, y);
        y += 10;
    });
    
    despesas.forEach(despesa => {
        doc.text(`${despesa.nome} - R$ ${despesa.valor.toFixed(2)} (${despesa.categoria})`, 20, y);
        y += 10;
    });

    doc.save("rateio.pdf");
}

function alternarModo() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}
