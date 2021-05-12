# Full-stack Node.js & Typescript Demo

# Data Backend

- I used App Search from Elastic's Enterprise Search built on top of ElasticSearch, because it's easier to bootstrap a simple search engine demo UI with opensource Elastic's Search-UI React components.
- In production, I'd rather build on top of ElasticSearch and develop our own UI, to have fine tuning control over the index and more complex search queries. 

# Indexation architecture

- I 'd use Kubernetes and OpenFaas as a distributed asynchronous serverless functions, or any serverless framework. 
- Local development environment for OpenFass/Kubernetes is easy to install with microk8s, minikube or k3s (docs: https://docs.openfaas.com/deployment/kubernetes/), and is a powerfull tool for scaling. AWS Lambda with `serverless` official framework is another powerfull infrastructure.
- I'd create a function to index the latest README.md text of each git repository from https://huggingface.co from an event hooked by another process described below
- I'd create a git repository watcher process, that loops over the repositories regularly, and calls `git diff-index --name-only HEAD` to see if the README.md file has changed in order to call the event that triggers the async function.
- Other things that have been ruled out of this demo for the sake of simplicity, like removing deleted models.