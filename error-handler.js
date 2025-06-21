// Chrome 확장 프로그램 오류 핸들러
(function() {
    // 가능한 한 빨리 실행
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // console.error 오버라이드
    console.error = function(...args) {
        const message = args.map(arg => String(arg)).join(' ');
        if (message.includes('chrome-extension://') || 
            message.includes('Failed to fetch dynamically imported module') ||
            message.includes('Failed dynamically imported module')) {
            return;
        }
        originalError.apply(console, args);
    };

    // console.warn 오버라이드 (Tailwind CSS 경고 포함)
    console.warn = function(...args) {
        const message = args.map(arg => String(arg)).join(' ');
        if (message.includes('cdn.tailwindcss.com should not be used in production') ||
            message.includes('chrome-extension://')) {
            return;
        }
        originalWarn.apply(console, args);
    };

    // 전역 오류 핸들러 (캡처 단계)
    window.addEventListener('error', function(event) {
        if (event.filename && event.filename.includes('chrome-extension://')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return true;
        }
    }, true);

    // Promise rejection 핸들러 (캡처 단계)
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason || {};
        const message = (reason.message || reason.toString() || '').toLowerCase();
        
        if (message.includes('chrome-extension://') || 
            message.includes('failed to fetch dynamically imported module') ||
            message.includes('failed dynamically imported module')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return true;
        }
    }, true);

    // MutationObserver로 동적으로 추가되는 스크립트 감시
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT' && node.src && node.src.includes('chrome-extension://')) {
                        node.remove();
                    }
                });
            });
        });

        // DOM이 준비되면 감시 시작
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }
})();

// Tailwind CSS 설정
window.tailwind = window.tailwind || {};
window.tailwind.config = window.tailwind.config || {};
window.tailwind.config.silent = true; 