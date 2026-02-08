const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    button.animate(
      [
        { transform: 'scale(1)', boxShadow: 'none' },
        { transform: 'scale(0.97)', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.12)' },
        { transform: 'scale(1)', boxShadow: 'none' }
      ],
      {
        duration: 240,
        easing: 'ease-out'
      }
    );
  });
});
