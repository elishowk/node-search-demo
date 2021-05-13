# Full-stack Node.js & Typescript Demo

# Usage

- Create the bridge network : `docker network create --driver=bridge --attachable --internal=false default-bridge-network`
- Start Elastic EnterpriseSearch for initial configuration : `docker-compose up enterprisesearch`
- Go to http://localhost:3002 and follow the onboarding by creating an engine name, use `model-search-demo` by default
- Copy the auto-generated keys : one public for the front, one private for the back, go to http://localhost:3002/as#/credentials
- Edit the .env file with environment variables for REACT_APP_ENTERPRISE_SEARCH_PUBLIC_KEY and ENTERPRISE_SEARCH_PRIVATE_KEY. Set also ENTERPRISE_SEARCH_INDEx of you used another name than model-search-demo
- Start the front and back with `docker-compose up` 
- Indexation will immediately start, wait a bit for results to appear
- Go to http://localhost:3000
- You can also check the search engine at http://localhost:3002/as#/engines/model-search-demo/documents/

# Data Backend

- I used App Search from Elastic's Enterprise Search built on top of ElasticSearch, because it's easier to bootstrap a simple search engine demo UI with opensource Elastic's Search-UI React components.
- In production, I'd rather build on top of ElasticSearch and develop our own UI, to have fine tuning control over the index and more complex search queries. 

# Real-world architecture VS. demo architecture

- I 'd use Serverless function to process git changes and index them. For example, AWS Lambda or Kubernetes+OpenFaas as a distributed asynchronous serverless functions.
- Local development environment for OpenFass/Kubernetes is easy to install with microk8s, minikube or k3s (docs: https://docs.openfaas.com/deployment/kubernetes/), and is a powerfull tool for scaling. AWS Lambda with `serverless` official framework is another powerfull infrastructure.
- I'd reuse the function created here to index the latest README.md text of each git repository from https://huggingface.co from an event hooked by another process described below
- I'd create another watcher process, that loops over the repositories regularly, and calls `git diff-index --name-only HEAD` to see if the README.md file has changed in order to call the event (SNS or OpenFaas Events) that triggers the async function.
- Other things that have been ruled out of this demo for the sake of simplicity, like removing deleted models.
