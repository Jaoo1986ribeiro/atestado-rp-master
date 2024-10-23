document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os campos de entrada
  const todosOsCampos = document.querySelectorAll('input, select, textarea');

  // Torna todos os campos obrigatórios
  todosOsCampos.forEach(campo => {
    campo.required = true;
  });

  // Adiciona validação ao formulário
  const formulario = document.querySelector('form');
  formulario.addEventListener('submit', function(event) {
    let camposVazios = [];

    // Verifica se algum campo está vazio
    todosOsCampos.forEach(campo => {
      if (!campo.value.trim()) {
        camposVazios.push(campo.name || campo.id);
      }
    });

    if (camposVazios.length > 0) {
      event.preventDefault();
      alert('Por favor, preencha os seguintes campos obrigatórios: ' + camposVazios.join(', '));
    }
  });
});
