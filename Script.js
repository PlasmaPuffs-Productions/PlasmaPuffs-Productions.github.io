(async () => {
        (() => {
                const searchParameters = new URLSearchParams(window.location.search);
                if (searchParameters.has("redirect")) {
                        const redirectPath = searchParameters.get("redirect");
                        history.replaceState({}, "", redirectPath);
                }
        })();

        await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));

        function presentContent(path) {
                const content = document.getElementById("content");
                switch (path) {
                        case "/home":
                                content.textContent = "Welcome to the Home page";
                                break;
                        case "/about":
                                content.textContent = "This is the About page";
                                break;
                        default:
                                content.textContent = "Page not found"
                                break;
                }
        }

        document.querySelectorAll("a.navigation-link").forEach(link => {
                link.addEventListener("click", event => {
                        event.preventDefault();

                        const path = link.getAttribute("href");
                        history.pushState({}, "", path);
                        presentContent(path);
                });
        });

        window.addEventListener("popstate", () => {
                presentContent(window.location.pathname);
        });

        if (window.location.pathname === "/") {
                history.replaceState({}, "", "/home");
        }

        presentContent(window.location.pathname);
})();