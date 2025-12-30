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

        alert('Élément sélectionné :\n' + selector);
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

    window.FeedbackWidget = { init };

    init();
})();
