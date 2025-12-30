(function () {
    if (window.FeedbackWidget) return;

    const BUTTON_ID = 'feedback-widget-button';

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.innerText = 'Signaler un bug';

        // Styles isolés
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '999999';
        btn.style.padding = '12px 16px';
        btn.style.background = '#e3342f';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,.2)';

        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '0.9';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '1';
        });

        btn.addEventListener('click', () => {
            console.log('[FeedbackWidget] button clicked');
        });

        document.body.appendChild(btn);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButton);
        } else {
            createButton();
        }

        console.log('[FeedbackWidget] initialized');
    }

    window.FeedbackWidget = {
        init
    };

    init();
})();
