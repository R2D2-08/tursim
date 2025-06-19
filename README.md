## A Containerised web-app that allows users to visually simulate custom Turing machines, to run code relevant to turmachpy with server config scripts to spin up everything from scratch.
• Developed a self hosted web-app for simulating custom user defined Turing machines visually. 
• Added functionality to allow the user to run python code relevant to turmachpy, a python package I wrote for simulating a variety of Turing machines, on the server. 
• Isolated the back-end, front-end, database and the code-running environment running as micro-services in a docker network. 
• Set up nginx as a reverse proxy such that only the container running it is exposed to the incoming traffic directly. 
• Configured server configuration scripts to secure the server with a UFW firewall, and auto spawn all the relevant containers. 
• Included metrics’ visualization using Grafana and Prometheus.
