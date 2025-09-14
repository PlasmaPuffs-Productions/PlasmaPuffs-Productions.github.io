(async () => {
        (() => {
                const searchParameters = new URLSearchParams(window.location.search);
                if (searchParameters.has("redirect")) {
                        const redirectPath = searchParameters.get("redirect");
                        history.replaceState({}, "", redirectPath);
                }
        })();

        await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));

        const deepFreeze = object => {
                if (object === undefined) {
                        return object;
                }

                Object.freeze(object);

                for (const property of Object.getOwnPropertyNames(object)) {
                        const value = object[property];

                        if (value === undefined) {
                                return;
                        }

                        const type = typeof value;
                        if (type === "object" || type === "function") {
                                if (!Object.isFrozen(value)) {
                                        deepFreeze(value);
                                }
                        }
                }

                return object;
        };

        const routes = deepFreeze({
                "/home": {
                        html: "./Home.html",
                        scripts: []
                },
                "/grid": {
                        html: "./Grid.html",
                        scripts: []
                }
        });

        const content = document.getElementById("content");
        const updatePage = async path => {
                const route = routes[path];

                if (route === undefined) {
                        content.innerHTML = "<h1>404 - Page not found</h1>";
                        return;
                }

                try {
                        const response = await fetch(route.page);
                        content.innerHTML = await response.text();

                        for (const script of route.scripts) {
                                const scriptElement = document.createElement("script");
                                scriptElement.src = script;
                                document.body.appendChild(scriptElement);
                        }
                } catch (error) {
                        content.innerHTML = "<h1>Error loading page</h1>";
                        console.error("Navigation error:", error);
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