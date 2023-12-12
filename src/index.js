import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";
import store from './store'
const queryCLient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <QueryClientProvider client={queryCLient}>
          <Provider store={store}>

      <BrowserRouter>
          <App />
      </BrowserRouter>
          </Provider>
      </QueryClientProvider>
  </React.StrictMode>
);
