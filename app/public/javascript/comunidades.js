/* Comunidades Recomendadas Animação */

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.comunidades-recomendadas');
    const sliderItems = document.querySelectorAll('.comunidades-unidade');
  
    sliderContainer.innerHTML += sliderContainer.innerHTML;
  
    let offset = 0;
    const speed = 1;
  
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
  