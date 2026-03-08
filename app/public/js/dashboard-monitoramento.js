function banirUsuario(idUsuario) {
    if (confirm('Tem certeza que deseja banir este usuário?')) {
      fetch('/api/banir-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Usuário banido com sucesso!');
          location.reload();
        } else {
          alert('Erro ao banir usuário: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao processar a solicitação');
      });
    }
  }