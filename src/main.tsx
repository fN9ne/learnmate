import "./scss/index.scss";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Provider } from "react-redux";
import { setupStore } from "./store/store.ts";

const store = setupStore();

ReactDOM.createRoot(document.querySelector(".wrapper")!).render(
	<Provider store={store}>
		<App />
	</Provider>
);
