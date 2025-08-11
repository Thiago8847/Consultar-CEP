document.addEventListener('DOMContentLoaded', () => {

  // ---------- Busca por CEP ----------
  const cepInput = document.getElementById('cep');
  const buscarCepBtn = document.getElementById('buscarCep');
  const limparCepBtn = document.getElementById('limparCep');
  const statusCep = document.getElementById('statusCep');
  const resultadoCep = document.getElementById('resultadoCep');
  const erroCep = document.getElementById('erroCep');
  const copyCepBtn = document.getElementById('copyCep');

  const camposCep = {
    cep: document.getElementById('r-cep'),
    logradouro: document.getElementById('r-logradouro'),
    bairro: document.getElementById('r-bairro'),
    localidade: document.getElementById('r-localidade'),
    uf: document.getElementById('r-uf')
  };

  // Formatar CEP enquanto digita
  cepInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    e.target.value = v;
  });

  buscarCepBtn.addEventListener('click', buscarCep);
  limparCepBtn.addEventListener('click', limparCep);

  if (copyCepBtn) {
    copyCepBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(camposCep.cep.textContent || '');
      statusCep.textContent = 'CEP copiado!';
      setTimeout(() => statusCep.textContent = '', 2000);
    });
  }

  async function buscarCep() {
    erroCep.style.display = 'none';
    resultadoCep.style.display = 'none';
    statusCep.textContent = 'Buscando...';
    const raw = cepInput.value.replace(/\D/g, '');
    if (!/^\d{8}$/.test(raw)) {
      erroCep.textContent = 'CEP inválido.';
      erroCep.style.display = 'block';
      statusCep.textContent = '';
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data.erro) {
        erroCep.textContent = 'CEP não encontrado.';
        erroCep.style.display = 'block';
        statusCep.textContent = '';
        return;
      }
      preencherCep(data);
      statusCep.textContent = 'Concluído.';
    } catch (e) {
      erroCep.textContent = 'Erro na busca.';
      erroCep.style.display = 'block';
      statusCep.textContent = '';
    }
  }

  function preencherCep(d) {
    camposCep.cep.textContent = d.cep || '';
    camposCep.logradouro.textContent = d.logradouro || '-';
    camposCep.bairro.textContent = d.bairro || '-';
    camposCep.localidade.textContent = d.localidade || '-';
    camposCep.uf.textContent = d.uf || '-';
    resultadoCep.style.display = 'block';
  }

  function limparCep() {
    cepInput.value = '';
    resultadoCep.style.display = 'none';
    erroCep.style.display = 'none';
    statusCep.textContent = '';
  }



  // ---------- Botão Colar ----------
  const btnColar = document.getElementById('btn-colar');
  const inputText = document.getElementById('cep');

  if (btnColar) {
    btnColar.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const texto = await navigator.clipboard.readText();
          inputText.value = texto;
        } else {
          alert('Seu navegador não suporta colar automaticamente.');
        }
      } catch (err) {
        alert('Não foi possível acessar o conteúdo da área de transferência.\nVerifique as permissões do navegador.');
        console.error(err);
      }
    });
  }

});
