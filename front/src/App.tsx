import React from 'react';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, Results, SearchBox, Paging, PagingInfo, Sorting, Facet } from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';

import '@elastic/react-search-ui-views/lib/styles/styles.css';
import './App.css';

const connector = new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_ENTERPRISE_SEARCH_PUBLIC_KEY,
  engineName: process.env.REACT_APP_ENTERPRISE_SEARCH_INDEX || 'model-search-demo',
  endpointBase: process.env.REACT_APP_ENTERPRISE_SEARCH_URL || 'https://localhost:3002',
  cacheResponses: false
});

const SORT_OPTIONS = [
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
];

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
        alwaysSearchOnInitialLoad: true,
        searchQuery: {
          disjunctiveFacets: ["pipeline_tag "],
          facets: {
            pipeline_tag : { type: "value", size: 30 }
          }
        }
      }}
    >
      <div className='App'>
        <Layout
          sideContent={
            <div>
              <Sorting
                sortOptions={SORT_OPTIONS}
              />
              <Facet
                field="pipeline_tag"
                label="pipeline_tag"
                filterType="any"
                isFilterable={true}
              />
              </div>
          }
          header={<SearchBox
            autocompleteMinimumCharacters={3}
            autocompleteResults={{
              linkTarget: "_blank",
              sectionTitle: "Suggested Results",
              titleField: "title",
              urlField: "nps_link"
            }}
            autocompleteSuggestions={{
              sectionTitle: "Suggested Queries"
            }}
          />}
          bodyHeader={<PagingInfo/>}
          bodyContent={<Results titleField='title' urlField='nps_link' />}
          bodyFooter={<Paging/>}
        />
      </div>
    </SearchProvider>
  );
}

export default App;
