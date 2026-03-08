document.addEventListener('DOMContentLoaded', () => {
  console.log("Página de comunidades carregada");
  
  // Exemplo: Adicionar animação ao scroll
  const cards = document.querySelectorAll('.community-card');
  window.addEventListener('scroll', () => {
      const triggerPoint = window.innerHeight / 1.2;
      cards.forEach(card => {
          const cardTop = card.getBoundingClientRect().top;
          if (cardTop < triggerPoint) {
              card.classList.add('show');
          } else {
              card.classList.remove('show');
          }
      });
  });
});
