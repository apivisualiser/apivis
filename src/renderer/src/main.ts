import './assets/global.css'
import './assets/dimensions.css'
import './assets/bulma.css'
import './assets/icon-colors.css'


import "./app.css";
import App from "./App.svelte";
import "./commands/stdCommands";
import './utility/changeCurrentDbByTab';
import "@mdi/font/css/materialdesignicons.css";

const app = new App({
  target: document.getElementById("app"),
});


export default app;