import { jsPDF } from "jspdf";

interface Pessoa {
    nome: string;
    numero?: string; 
    diasFicados: number;
}

interface Despesa {
    nome: string;
    valor: number;
}

let pessoas: Pessoa[] = [];
let despesas: Despesa[] = [];

function adicionarPessoa(): void {
    const nomePessoa = (document.getElementById('nomePessoa') as HTMLInputElement).value;
    const numeroPessoa = (document.getElementById('numeroPessoa') as HTMLInputElement).value || undefined; // Tornando opcional
    const diasFicados = parseInt((document.getElementById('diasFicados') as HTMLInputElement).value);

    if (nomePessoa && !isNaN(diasFicados)) {
        pessoas.push({ nome: nomePessoa, numero: numeroPessoa, diasFicados });
        (document.getElementById('nomePessoa') as HTMLInputElement).value = '';
        (document.getElementById('numeroPessoa') as HTMLInputElement).value = '';
        (document.getElementById('diasFicados') as HTMLInputElement).value = '';
        atualizarListaPessoas();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function adicionarDespesa(): void {
    const nomeDespesa = (document.getElementById('nomeDespesa') as HTMLInputElement).value;
    const valorDespesa = parseFloat((document.getElementById('valorDespesa') as HTMLInputElement).value);
    
    if (nomeDespesa && !isNaN(valorDespesa)) {
        despesas.push({ nome: nomeDespesa, valor: valorDespesa });
        (document.getElementById('nomeDespesa') as HTMLInputElement).value = '';
        (document.getElementById('valorDespesa') as HTMLInputElement).value = '';
        atualizarListaDespesas();
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function atualizarListaPessoas(): void {
    const listaPessoas = document.getElementById('listaPessoas')!;
    listaPessoas.innerHTML = '';
    pessoas.forEach(pessoa => {
        const li = document.createElement('li');
        li.textContent = `${pessoa.nome} ${pessoa.numero ? `(${pessoa.numero})` : ''} - Dias : ${pessoa.diasFicados}`;
        listaPessoas.appendChild(li);
    });
}

function atualizarListaDespesas(): void {
    const listaDespesas = document.getElementById('listaDespesas')!;
    listaDespesas.innerHTML = '';
    despesas.forEach(despesa => {
        const li = document.createElement('li');
        li.textContent = `${despesa.nome} - R$ ${despesa.valor.toFixed(2)}`;
        listaDespesas.appendChild(li);
    });
}

function calcularRateio(): void {
}

function gerarPDF(): void {
    const doc = new jsPDF();
    doc.text("Rateio de Despesas", 10, 10);
    
    pessoas.forEach((pessoa, index) => {
        const texto = `${pessoa.nome} ${pessoa.numero ? `(${pessoa.numero})` : ''} - Dias: ${pessoa.diasFicados}`;
        doc.text(texto, 10, 20 + index * 10);
    });

    const startDespesasY = 20 + pessoas.length * 10 + 10; // 10 é o espaço extra
    doc.text("Despesas:", 10, startDespesasY);
    
    despesas.forEach((despesa, index) => {
        const textoDespesa = `${despesa.nome} - R$ ${despesa.valor.toFixed(2)}`;
        doc.text(textoDespesa, 10, startDespesasY + 10 + index * 10);
    });

    doc.save("rateio.pdf");
}

function toggleDarkMode(): void {
    const body = document.body;
    body.classList.toggle('dark-mode');
}