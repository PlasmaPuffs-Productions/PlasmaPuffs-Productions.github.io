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
                        html: "Home.html",
                        scripts: []
                },
                "/grid": {
                        html: "Grid.html",
                        scripts: []
                }
        });

        const content = document.getElementById("content");
        const updatePage = async path => {
                const route = routes[path];
                if (!route) {
                        content.innerHTML = "<h1>404 - Page not found</h1>";
                        return;
                }

                try {
                        content.innerHTML = "<p>Loading...</p>";

                        const response = await fetch(route.html);

                        if (!response.ok) {
                                console.error("Failed to load page:", url, response.status, response.statusText);
                                content.innerHTML = "<h1>404 - Page not found</h1>";
                                return;
                        }

                        const html = await response.text();
                        content.innerHTML = html;

                        for (const script of route.scripts || []) {
                                if (!document.querySelector(`script[src="${script}"]`)) {
                                        const scriptElement = document.createElement("script");
                                        scriptElement.src = script;
                                        scriptElement.defer = true;
                                        document.body.appendChild(scriptElement);
                                }
                        }
                } catch (error) {
                        console.error("Navigation error:", error);
                        content.innerHTML = "<h1>Error loading page</h1>";
                }
        };

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