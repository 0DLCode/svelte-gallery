export function lazyLoad(image: HTMLImageElement) {
    const loadImage = () => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      }
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage();
          observer.unobserve(image);
        }
      });
    }, { rootMargin: '50px' });
  
    observer.observe(image);
  
    return {
      update() {
        loadImage();
      },
      destroy() {
        observer.unobserve(image);
      }
    };
  }
  