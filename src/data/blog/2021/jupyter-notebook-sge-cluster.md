---
title: Jupyter on an SGE Cluster: Reverse SSH Tunneling
author: Arup Ghosh
pubDatetime: 2021-05-15T00:00:00.000Z
featured: false
draft: false
tags:
  - Jupyter
  - HPC
  - SGE
  - SSH Tunnel
description: "How to run Jupyter Notebook on an SGE cluster and access it securely using reverse SSH tunneling."
---

In the current HPC setup, we don't have direct access to the child nodes. The only way to connect to any web server applications running in the SGE queue is through reverse tunneling via the head/parent node. This is a guide to accessing a Jupyter Notebook server running in an SGE cluster.

There are two primary methods to submit a job in an SGE cluster: the first is `qsub`, and the interactive method is `qrsh`. If the analysis process is going to take more than a couple of hours, it is better to submit the job with `qsub`. Also, before starting the notebook server, set up [password-based authentication]({{ site.baseurl }}/blog/2020/running-a-jupyter-notebook-server-on-centos-7/) to avoid unauthorized access.

## Notebook in SGE queue

The queue submission process is similar and can be done with a standard SGE script. The following is an example of an SGE script for a notebook server. Using the `-q` option, an appropriate queue type/target node (queue_name@node_address) can be specified.

```bash
#!/bin/bash
#$ -N notebook
#$ -cwd
#$ -q <queue_name>
#$ -e $JOB_ID_$JOB_NAME.err
#$ -o $JOB_ID_$JOB_NAME.out

#activate conda env for notebook
source <path_to_conda>/miniconda3/etc/profile.d/conda.sh
conda activate <notebook_env_name>

#start the notebook server
jupyter notebook --ip '*' --no-browser --port 8898 \
                 --notebook-dir /some/path

```

In the above example, the notebook server binds to all the network interfaces on the node. To determine which node is running the job, use the `qstat` command or check the specific job ID `.err` file. This is required to connect to the notebook server.

```text
#Example
[I 01:17:11.023 NotebookApp] Jupyter Notebook 6.5.2 is running at:
[I 01:17:11.023 NotebookApp] http://compute-0-5.local:8898/
```

## Notebook in an interactive session

To run a Jupyter notebook server in an interactive session, start by activating the conda/python environment and use the `qrsh` command.

```bash

 # Example
 qrsh -cwd -q <queue_name> -N test -V "jupyter notebook --ip '*' --no-browser --port 8898"

```

The node name running the server appears in stdout.

## Connect with the server

As the notebook server is only accessible to the HPC's intranet, an SSH tunnel via the parent node is required.

```bash

 ssh -N -L 8898:compute-0-5.local:8898 <user_name>@<parent_node_ip>

```

Once the connection has been established, the notebook server will be available at `http://localhost:8898`. The overall process is a bit cumbersome, and I am not aware of a better workaround yet.

### Update (Feb 2023)

Vince Buffalo recently shared a [tool](https://github.com/vsbuffalo/remote_jupyter) to manage remote Jupyter sessions. The tool is very useful if you are running multiple Jupyter instances and cannot expose network ports.