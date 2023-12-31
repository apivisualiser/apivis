import "./app.css";
import App from "./App.svelte";
import "./commands/stdCommands";
import './utility/changeCurrentDbByTab';
import "@mdi/font/css/materialdesignicons.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
