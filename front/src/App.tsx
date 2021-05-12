import React from 'react';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, Results, SearchBox } from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';

import './App.css';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

const connector = new AppSearchAPIConnector({
  searchKey: 'T3F6eEFlWlpSank1TVpLRGdUZnQyNVdmc1hwVEd0ckY4SEtidEZucndiVUcxZ05TbTdZcjZjcUdVeXZYMEsvSi0tamJWbTRxRkxLRE9MTTYzaEFKQkd4QT09--20c2342fc9bcc6292f2e2d12ed57a5a2bde5a4fe',
  engineName: 'model-search-demo',
  endpointBase: 'http://localhost:3002',
  cacheResponses: false
});

function App() {
  return (
    <SearchProvider
      config={{
        apiConnector: connector
      }}
    >
      <div className='App'>
        <Layout
          header={<SearchBox />}
          bodyContent={<Results titleField='title' urlField='nps_link' />}
        />
      </div>
    </SearchProvider>
  );
}

export default App;
