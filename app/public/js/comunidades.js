/* Comunidades Recomendadas Animação */

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.comunidades-recomendadas');
    const sliderItems = document.querySelectorAll('.comunidades-unidade');
  
    sliderContainer.innerHTML += sliderContainer.innerHTML; // Duplicar os itens para criar um loop contínuo
  
    let offset = 0;
    const speed = 1; // Velocidade de movimento em pixels
  
    function animate() {
      offset -= speed;
      if (offset <= -sliderContainer.scrollWidth / 2) {
        offset = 0;
      }
      sliderContainer.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(animate);
    }
  
    animate();
  });
  