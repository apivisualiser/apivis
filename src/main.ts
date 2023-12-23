import "./app.css";
import App from "./App.svelte";
import "@mdi/font/css/materialdesignicons.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
