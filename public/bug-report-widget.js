(function () {
    if (window.BugReportWidget) return;

    const BUTTON_ID = 'bugreport-button';
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
        console.log('[BugReportWidget] element selected:', selector);

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

        console.log('[BugReportWidget] inspection started');
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

        console.log('[BugReportWidget] inspection stopped');
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
        console.log('[BugReportWidget] loaded');
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

            const payload = {
                message: message,
                selector: selector,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            fetch('http://127.0.0.1:8000/api/bugreport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(() => {
                alert('Merci pour votre signalement 🙏');
                document.body.removeChild(backdrop);
            })
            .catch(error => {
                console.error('[BugReportWidget] error', error);
                alert('Erreur lors de l’envoi du feedback');
            });
        });

    }

    window.BugReportWidget = { init };

    init();
})();

// (function () {
//     if (window.BugReportWidget) return;

//     window.BugReportWidget = {
//         isOpen: false,

//         init() {
//             console.log('[BugReportWidget] init');

//             this.injectStyles();
//             this.injectButton();
//             this.injectPanel();
//         },

//         injectStyles() {
//             const style = document.createElement('style');
//             style.id = 'bugreport-widget-styles';

//             style.innerHTML = `
//                 #bugreport-widget-button {
//                     position: fixed;
//                     bottom: 20px;
//                     right: 20px;
//                     z-index: 999999;
//                     background: #ff4757;
//                     color: #fff;
//                     border: none;
//                     border-radius: 50px;
//                     padding: 12px 18px;
//                     font-size: 14px;
//                     cursor: pointer;
//                     box-shadow: 0 4px 12px rgba(0,0,0,0.2);
//                 }

//                 #bugreport-widget-panel {
//                     position: fixed;
//                     bottom: 80px;
//                     right: 20px;
//                     width: 320px;
//                     background: #ffffff;
//                     border-radius: 8px;
//                     box-shadow: 0 6px 20px rgba(0,0,0,0.25);
//                     font-family: Arial, sans-serif;
//                     display: none;
//                     z-index: 999999;
//                 }

//                 #bugreport-widget-header {
//                     background: #ff4757;
//                     color: #fff;
//                     padding: 10px;
//                     font-weight: bold;
//                     border-radius: 8px 8px 0 0;
//                 }

//                 #bugreport-widget-body {
//                     padding: 12px;
//                     font-size: 13px;
//                     color: #333;
//                 }

//                 #bugreport-widget-body textarea {
//                     width: 100%;
//                     height: 80px;
//                     resize: none;
//                     margin-bottom: 8px;
//                     font-size: 13px;
//                 }

//                 #bugreport-widget-body button {
//                     width: 100%;
//                     background: #ff4757;
//                     color: #fff;
//                     border: none;
//                     padding: 8px;
//                     cursor: pointer;
//                     border-radius: 4px;
//                 }

//                 #bugreport-widget-close {
//                     float: right;
//                     cursor: pointer;
//                 }
//             `;

//             document.head.appendChild(style);
//         },

//         injectButton() {
//             const button = document.createElement('button');
//             button.id = 'bugreport-widget-button';
//             button.innerText = '🐞 Bug';

//             button.addEventListener('click', () => {
//                 this.togglePanel();
//             });

//             document.body.appendChild(button);
//         },

//         injectPanel() {
//             const panel = document.createElement('div');
//             panel.id = 'bugreport-widget-panel';

//             panel.innerHTML = `
//                 <div id="bugreport-widget-header">
//                     Signaler un bug
//                     <span id="bugreport-widget-close">✖</span>
//                 </div>
//                 <div id="bugreport-widget-body">
//                     <textarea id="bugreport-message" placeholder="Décris le problème..."></textarea>
//                     <button id="bugreport-submit">Envoyer</button>
//                 </div>
//             `;

//             document.body.appendChild(panel);

//             document
//                 .getElementById('bugreport-widget-close')
//                 .addEventListener('click', () => {
//                     this.closePanel();
//                 });

//             document
//                 .getElementById('bugreport-submit')
//                 .addEventListener('click', () => {
//                     this.handleSubmit();
//                 });
//         },

//         handleSubmit() {
//             const message = document.getElementById('bugreport-message').value;

//             if (!message.trim()) {
//                 alert('Merci de décrire le problème');
//                 return;
//             }

//             const payload = {
//                 message: message,
//                 url: window.location.href,
//                 userAgent: navigator.userAgent,
//                 timestamp: new Date().toISOString()
//             };

//             fetch('http://127.0.0.1:8000/api/bugreport', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Erreur réseau');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('[BugReportWidget] success', data);
//                 alert('Merci pour votre signalement 🙏');
//                 this.closePanel();
//             })
//             .catch(error => {
//                 console.error('[BugReportWidget] error', error);
//                 alert('Erreur lors de l’envoi du bug');
//             });
//         },

//         togglePanel() {
//             this.isOpen ? this.closePanel() : this.openPanel();
//         },

//         openPanel() {
//             document.getElementById('bugreport-widget-panel').style.display = 'block';
//             this.isOpen = true;
//         },

//         closePanel() {
//             document.getElementById('bugreport-widget-panel').style.display = 'none';
//             this.isOpen = false;
//         }
//     };
// })();
