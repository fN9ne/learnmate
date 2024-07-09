import "./scss/index.scss";

import App from "./App.tsx";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { setupStore } from "./redux/store.ts";
import { BrowserRouter } from "react-router-dom";

const store = setupStore();

ReactDOM.createRoot(document.querySelector(".wrapper")!).render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
