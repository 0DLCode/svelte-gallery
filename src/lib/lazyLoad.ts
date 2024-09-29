export function lazyLoad(image: HTMLImageElement) {
  const loadImage = () => {
    if (image.dataset.src) {
      image.src = image.dataset.src;
      image.removeAttribute('data-src');
    }
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage();
        observer.unobserve(entry.target); // Arrêter d'observer après chargement
      }
    });
  }, { rootMargin: '50px' });

  observer.observe(image);

  return {
    update() {
      loadImage(); // Recharger l'image si nécessaire après mise à jour
    },
    destroy() {
      observer.disconnect(); // Déconnecter l'observateur lorsque l'image est retirée
    }
  };
}
