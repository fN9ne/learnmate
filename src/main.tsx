import "./scss/index.scss";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Provider } from "react-redux";
import { setupStore } from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

const store = setupStore();

ReactDOM.createRoot(document.querySelector(".wrapper")!).render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
