import React from 'react';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, Results, SearchBox, Paging, PagingInfo, Sorting } from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';

import '@elastic/react-search-ui-views/lib/styles/styles.css';
import './App.css';

const connector = new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_ENTERPRISE_SEARCH_PUBLIC_KEY,
  engineName: process.env.REACT_APP_ENTERPRISE_SEARCH_INDEX || 'model-search-demo',
  endpointBase: process.env.REACT_APP_ENTERPRISE_SEARCH_URL || 'https://localhost:3002',
  cacheResponses: false
});

function App() {
  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        hasA11yNotifications: true,
        a11yNotificationMessages: {
          searchResults: ({ start, end, totalResults, searchTerm }: { start: number, end: number, totalResults: number, searchTerm: string }) =>
            `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`
        },
        result_fields: {
          title: {
            snippet: {
              size: 100,
              fallback: true
            }
          },
          nps_link: {
            raw: {}
          },
          body: {
            snippet: {
              size: 100,
              fallback: true
            }
          }
        },
        alwaysSearchOnInitialLoad: true
      }}
    >
      <div className='App'>
        <Layout
          header={<SearchBox
            autocompleteResults={{
              sectionTitle: "Suggested Results",
              titleField: "title",
              urlField: "nps_link"
            }}
            autocompleteSuggestions={{
              sectionTitle: "Suggested Queries"
            }}
          />}
          bodyHeader={[<PagingInfo/>, <Sorting
            sortOptions={[
              {
                name: "Relevance",
                value: "",
                direction: ""
              },
              {
                name: "Title",
                value: "title",
                direction: "asc"
              }
            ]}
          />]}
          bodyContent={<Results titleField='title' urlField='nps_link' />}
          bodyFooter={<Paging/>}
        />
      </div>
    </SearchProvider>
  );
}

export default App;
