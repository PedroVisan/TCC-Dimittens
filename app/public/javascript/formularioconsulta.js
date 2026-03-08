const form = document.getElementById('form-consulta');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const cpfUsuario = formData.get('cpfUsuario');

  try {
    const userResponse = await fetch(`/api/usuario/cpf/${cpfUsuario}`);
    const userData = await userResponse.json();

    if (!userData.idUsuario) {
      alert('Usuário não encontrado!');
      return;
    }

    const consultaData = {
      dataHora: formData.get('dataHora'),
      status: formData.get('status'),
      preferencias: formData.get('preferencias'),
      valor: formData.get('valor'),
      tempo: formData.get('tempo'),
      anotacoes: formData.get('anotacoes'),
      usuarioId: userData.idUsuario,
      psicologoId: "<%= psicologoId %>" 
    };

    const response = await fetch('/api/consultas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultaData),
    });

    const result = await response.json();
    if (result.success) {
      alert('Consulta agendada com sucesso!');
      form.reset();
    } else {
      alert('Erro ao agendar consulta: ' + result.message);
    }
  } catch (error) {
    console.error('Erro ao processar a consulta:', error);
    alert('Erro ao enviar os dados. Tente novamente.');
  };
});