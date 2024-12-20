let pessoas = [];
let despesas = [];

function adicionarPessoa() {
    const nomePessoa = document.getElementById('nomePessoa').value;
    const numeroPessoa = document.getElementById('numeroPessoa').value;
    if (nomePessoa && numeroPessoa) {
        pessoas.push({ nome: nomePessoa, numero: numeroPessoa });
        document.getElementById('nomePessoa').value = '';
        document.getElementById('numeroPessoa').value = '';
        atualizarListaPessoas();
    }
}

function adicionarDespesa() {
    const nomeDespesa = document.getElementById('nomeDespesa').value;
    const valorDespesa = parseFloat(document.getElementById('valorDespesa').value);
    if (nomeDespesa && !isNaN(valorDespesa)) {
        despesas.push({ nome: nomeDespesa, valor: valorDespesa });
        document.getElementById('nomeDespesa').value = '';
        document.getElementById('valorDespesa').value = '';
        atualizarListaDespesas();
    }
}

function atualizarListaPessoas() {
    const listaPessoas = document.getElementById('listaPessoas');
    listaPessoas.innerHTML = '';
    pessoas.forEach((pessoa) => {
        const li = document.createElement('li');
        li.textContent = `${pessoa.nome} - ${pessoa.numero}`;
        
        // Criar o botão "Mandar Valor"
        const button = document.createElement('button');
        button.textContent = 'Mandar Valor';
        button.onclick = () => enviarWhatsApp(pessoa); // Passa a pessoa para a função enviarWhatsApp
        
        li.appendChild(button);
        listaPessoas.appendChild(li);
    });
}

function atualizarListaDespesas() {
    const listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    despesas.forEach(despesa => {
        const li = document.createElement('li');
        li.textContent = `${despesa.nome}: R$ ${despesa.valor.toFixed(2)}`;
        listaDespesas.appendChild(li);
    });
}

function calcularRateio() {
    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);
    const valorPorPessoa = totalDespesas / pessoas.length;
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p>Total de Despesas: R$ ${totalDespesas.toFixed(2)}</p>`;
    resultadoDiv.innerHTML += `<p>Valor por Pessoa: R$ ${valorPorPessoa.toFixed(2)}</p>`;
    resultadoDiv.innerHTML += '<h3>Valores a Pagar:</h3>';
    pessoas.forEach(pessoa => {
        resultadoDiv.innerHTML += `<p>${pessoa.nome}: R$ ${valorPorPessoa.toFixed(2)}</p>`;
    });
}

function gerarPDF() {
    const resultadoDiv = document.getElementById('resultado');
    const pdfContent = resultadoDiv.innerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Rateio PDF</title></head><body>');
    win.document.write(pdfContent);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

function enviarWhatsApp(pessoa) {
    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);
    const valorPorPessoa = totalDespesas / pessoas.length;
    const mensagem = `Olá ${pessoa.nome},\n\nTotal de Despesas: R$ ${totalDespesas.toFixed(2)}\nValor a Pagar: R$ ${valorPorPessoa.toFixed(2)}`;
    const url = `https://api.whatsapp.com/send?phone=${pessoa.numero}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}