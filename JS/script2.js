document.getElementById('buscarEnd').addEventListener('click', async () => {
    const uf = document.getElementById('uf').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim();

    const status = document.getElementById('statusEnd');
    const erro = document.getElementById('erroEnd');
    const tabela = document.querySelector('#tabelaEnd tbody');
    const resultado = document.getElementById('resultadoEnd');

    // Limpa mensagens e tabela
    erro.style.display = 'none';
    resultado.style.display = 'none';
    tabela.innerHTML = '';

    if (!uf || !cidade || !logradouro) {
        erro.style.display = 'block';
        erro.textContent = 'Preencha todos os campos para pesquisar.';
        return;
    }

    status.textContent = 'Pesquisando...';

    try {
        const url = `https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.erro || data.length === 0) {
            erro.style.display = 'block';
            erro.textContent = 'Nenhum endereço encontrado.';
            status.textContent = '';
            return;
        }

        data.forEach(end => {
            tabela.innerHTML += `
                <tr>
                    <td>${end.cep}</td>
                    <td>${end.logradouro}</td>
                    <td>${end.bairro}</td>
                    <td>${end.localidade}</td>
                    <td>${end.uf}</td>
                </tr>
            `;
        });

        resultado.style.display = 'block';
        status.textContent = `${data.length} resultado(s) encontrado(s).`;
    } catch (err) {
        erro.style.display = 'block';
        erro.textContent = 'Erro ao buscar endereço. Tente novamente.';
        status.textContent = '';
    }
});

document.getElementById('limparEnd').addEventListener('click', () => {
    document.getElementById('uf').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('logradouro').value = '';
    document.querySelector('#tabelaEnd tbody').innerHTML = '';
    document.getElementById('resultadoEnd').style.display = 'none';
    document.getElementById('statusEnd').textContent = 'Preencha os campos e clique em Pesquisar.';
    document.getElementById('erroEnd').style.display = 'none';
});
