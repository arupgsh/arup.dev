---
title: Run a Secure Jupyter Notebook Server on CentOS 7
author: Arup Ghosh
pubDatetime: 2020-05-15T00:00:00.000Z
featured: false
draft: false
tags:
  - Jupyter
  - CentOS 7
  - Linux
  - Data Science
description: "A concise guide to installing and configuring a secure Jupyter Notebook server on CentOS 7."
---

A guide to installing and setting up a Jupyter notebook server with Python 2.7 and 3 kernels for a local network in RHEL 7/CentOS 7/Oracle Linux 7.

First, install the required dependencies for Jupyter Notebook.

<div class="callout callout-info">
  <strong>Info:</strong> the following repos are no longer functional.
</div>

**Install dependencies and repositories:**

```bash
sudo yum install epel-release
yum install -y python-pip python-devel python-virtualenv
yum groupinstall 'Development Tools'
```

Set the virtual environment and install Jupyter Notebook using pip.

```bash
virtualenv jupyter-virtualenv
source jupyter-virtualenv/bin/activate
pip install jupyter
```

Run Jupyter Notebook and test that the installation works properly on your PC/workstation.

```bash
jupyter notebook
```

Generate the configuration file for the Jupyter Notebook. The configuration file will be different for each user on the machine to avoid conflicts. Generating a separate configuration file lets users run separate instances of a notebook server with user-specified passwords.

```bash
jupyter notebook --generate-config
```

Before starting the notebook server, set up a password for your instance using the following command.

```bash
jupyter notebook password
```

If you don’t set up a password, the default password is the access token and can be found in the terminal (?token=).

```bash
[I 11:31:38.714 NotebookApp] 0 active kernels
[I 11:31:38.714 NotebookApp] The Jupyter Notebook is running at: http://localhost:8888/?token=bf955b36f6957215ee6c774bcfeb23649334fb88f5040087
[I 11:31:38.714 NotebookApp]

Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[W 11:31:38.715 NotebookApp] No web browser found: could not locate runnable browser.
[C 11:31:38.715 NotebookApp]

Copy and paste this URL into your browser when you connect for the first time,
to login with a token:
    http://localhost:8888/?token=bf955b36f6957215ee6c774bcfeb23649334fb88f5040087
[I 11:31:58.671 NotebookApp] 302 GET /?token=bf955b36f6957215ee6c774bcfeb23649334fb88f5040087 (::1) 0.82ms
```

Once the previous steps are done, edit the notebook configuration file generated using the --generate-config option. The configuration file will be located in the following path.

```bash
cat ~/.jupyter/jupyter_notebook_config.py
```

Use your favorite text editor to open the file and make the following changes to allow LAN access.
Set the IP to '*' to bind on all networking interfaces of the machine. Also, you can use only a public IP address if your machine has one.

```python
c.NotebookApp.ip = '*'
```

If you want to set up a password manually, change the following parameter.

```python
c.NotebookApp.password = u'sha1:bcd259ccf...'
```

**Code to generate a hashed password:**

```python
In [1]: from notebook.auth import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:67c9e60bb8b6:9ffede0825894254b2e042ea597d771089e11aed'

```

Launching a browser is not necessary when you are running a server.

```python
c.NotebookApp.open_browser = False
```

Change the port for the notebook server to avoid conflicts with other applications; by default it is 8888. If multiple users are running a notebook server, use a different port in each case.

```python
c.NotebookApp.port = 8888 #Change if already assigned to another service.
```

Add the port to the firewall and reload.

```bash
sudo firewall-cmd --zone=public --add-port=8888/tcp --permanent
sudo firewall-cmd --reload
firewall-cmd --list-all
```

After configuration, enable Jupyter Notebook to run in the background with nohup().

```bash
nohup jupyter notebook &
```

To stop the server, kill the processes.

```bash
lsof nohup.out
kill -9
```

When your system Python version is 2.7 but you also want to add Python 3 to the Jupyter Notebook, the following code will help.

### Enable kernels

**Python 2**

```bash
python2 -m pip install ipykernel
python2 -m ipykernel install --user
```

**Python 3**

```bash
python3 -m pip install ipykernel
python3 -m ipykernel install --user
```