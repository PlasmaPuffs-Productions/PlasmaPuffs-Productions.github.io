(() => {
        if (!window.location.search.includes("redirect=")) {
                const path = window.location.pathname + window.location.search + window.location.hash;
                window.location.replace("/Index.html?redirect=" + encodeURIComponent(path));
        }
})();