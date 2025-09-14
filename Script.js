(async () => {
        (() => {
                const searchParameters = new URLSearchParams(window.location.search);
                if (searchParameters.has("redirect")) {
                        const redirectPath = searchParameters.get("redirect");
                        history.replaceState({}, "", redirectPath);
                }
        })();

        await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));

        const content = document.getElementById("content");
        const updatePage = async path => {
                let page;

                switch (path) {
                        case "/home": {
                                page = "./Home.html";
                                break;
                        }

                        case "/grid": {
                                page = "./Grid.html";
                                break;
                        }

                        default: {
                                content.innerHTML = "<h1>404 - Page not found</h1>";
                                return;
                        }
                }

                try {
                        const response = await fetch(page);
                        content.innerHTML = await response.text();
                } catch {
                        content.innerHTML = "<h1>Error loading page</h1>";
                }
        }

        document.querySelectorAll("a.navigation-link").forEach(link => {
                link.addEventListener("click", event => {
                        event.preventDefault();

                        const path = link.getAttribute("href");
                        history.pushState({}, "", path);
                        updatePage(path);
                });
        });

        window.addEventListener("popstate", () => {
                updatePage(window.location.pathname);
        });

        if (window.location.pathname === "/") {
                history.replaceState({}, "", "/home");
        }

        updatePage(window.location.pathname);
})();