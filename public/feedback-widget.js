(function () {
    if (window.FeedbackWidget) return;

    const BUTTON_ID = 'feedback-widget-button';
    let inspecting = false;
    let hoveredElement = null;

    /* ===========================
       UTILS
    ============================ */

    function highlight(el) {
        if (!el) return;
        el.__fwOldOutline = el.style.outline;
        el.style.outline = '2px solid red';
        el.style.cursor = 'crosshair';
    }

    function unhighlight(el) {
        if (!el) return;
        el.style.outline = el.__fwOldOutline || '';
        el.style.cursor = '';
    }

    function stopEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function getSelector(el) {
        if (el.id) return `#${el.id}`;
        let path = [];
        while (el && el.nodeType === 1 && el !== document.body) {
            let selector = el.tagName.toLowerCase();
            if (el.className) {
                selector += '.' + el.className.trim().split(/\s+/).join('.');
            }
            path.unshift(selector);
            el = el.parentElement;
        }
        return path.join(' > ');
    }

    /* ===========================
       INSPECTION MODE
    ============================ */

    function onMouseOver(e) {
        stopEvent(e);
        if (hoveredElement) unhighlight(hoveredElement);
        hoveredElement = e.target;
        highlight(hoveredElement);
    }

    function onMouseOut(e) {
        stopEvent(e);
        unhighlight(e.target);
    }

    function onClick(e) {
        stopEvent(e);
        const element = e.target;
        exitInspection();

        const selector = getSelector(element);
        console.log('[FeedbackWidget] element selected:', selector);

        showModal(selector);
;
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            exitInspection();
        }
    }

    function enterInspection() {
        if (inspecting) return;
        inspecting = true;

        document.body.style.cursor = 'crosshair';

        document.addEventListener('mouseover', onMouseOver, true);
        document.addEventListener('mouseout', onMouseOut, true);
        document.addEventListener('click', onClick, true);
        document.addEventListener('keydown', onKeyDown, true);

        console.log('[FeedbackWidget] inspection started');
    }

    function exitInspection() {
        inspecting = false;

        if (hoveredElement) unhighlight(hoveredElement);
        hoveredElement = null;

        document.body.style.cursor = '';

        document.removeEventListener('mouseover', onMouseOver, true);
        document.removeEventListener('mouseout', onMouseOut, true);
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onKeyDown, true);

        console.log('[FeedbackWidget] inspection stopped');
    }

    /* ===========================
       BUTTON
    ============================ */

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.innerText = 'Signaler un bug';

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

        btn.addEventListener('click', enterInspection);

        document.body.appendChild(btn);
    }

    /* ===========================
       INIT
    ============================ */

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButton);
        } else {
            createButton();
        }
        console.log('[FeedbackWidget] loaded');
    }

    /* ===========================
    MODALE
    =========================== */

    function showModal(selector) {
        // BACKDROP
        const backdrop = document.createElement('div');
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100vw';
        backdrop.style.height = '100vh';
        backdrop.style.background = 'rgba(0,0,0,0.4)';
        backdrop.style.zIndex = '999998';
        backdrop.style.display = 'flex';
        backdrop.style.alignItems = 'center';
        backdrop.style.justifyContent = 'center';

        // MODAL BOX
        const modal = document.createElement('div');
        modal.style.background = '#fff';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.width = '320px';
        modal.style.boxShadow = '0 6px 20px rgba(0,0,0,.25)';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.gap = '10px';

        const title = document.createElement('h3');
        title.innerText = 'Signaler un bug';
        title.style.margin = '0';
        modal.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Décrivez le problème...';
        textarea.style.width = '100%';
        textarea.style.height = '80px';
        textarea.style.padding = '8px';
        textarea.style.fontSize = '14px';
        modal.appendChild(textarea);

        const btnSend = document.createElement('button');
        btnSend.innerText = 'Envoyer';
        btnSend.style.background = '#38a169';
        btnSend.style.color = '#fff';
        btnSend.style.border = 'none';
        btnSend.style.padding = '8px 12px';
        btnSend.style.borderRadius = '4px';
        btnSend.style.cursor = 'pointer';

        const btnCancel = document.createElement('button');
        btnCancel.innerText = 'Annuler';
        btnCancel.style.background = '#e3342f';
        btnCancel.style.color = '#fff';
        btnCancel.style.border = 'none';
        btnCancel.style.padding = '8px 12px';
        btnCancel.style.borderRadius = '4px';
        btnCancel.style.cursor = 'pointer';

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end';
        btnContainer.style.gap = '10px';
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnSend);

        modal.appendChild(btnContainer);
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // ÉVÉNEMENTS
        btnCancel.addEventListener('click', () => {
            document.body.removeChild(backdrop);
        });

        btnSend.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (!message) {
                alert('Veuillez écrire un message.');
                return;
            }

            console.log('[FeedbackWidget] feedback envoyé:', {
                selector,
                message
            });

            alert('Feedback envoyé !\n' + message);

            document.body.removeChild(backdrop);
        });
    }

    window.FeedbackWidget = { init };

    init();
})();
