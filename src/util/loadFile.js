/**
 * @desc files ["xxx/yyy.js"]
 */
export const loadFile = (files = []) => {
    files.forEach(file => {
        if (file.indexOf(".js") !== -1) {
            const loaded = document.querySelector(`script[src="./cdn/${file}"]`);
            if (!loaded) {
                const script = document.createElement("script");
                script.src = "./cdn/" + file;
                document.head.appendChild(script);
                script.onload = function () {
                }
            }
        } else {
            // 检测css加载
            const loaded = document.querySelector(`link[href="./cdn/${file}"]`);
            if (!loaded) {
                // 加载css
                const link = document.createElement("link");
                link.href = "./cdn/" + file;
                link.type = "text/css";
                link.rel = "stylesheet";
                document.head.appendChild(link);
                link.onload = function() {
                }
            }
        }

    });
}