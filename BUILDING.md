# BUILDING

## Local Development

The following steps should work for Docker, but were performed with Podman.
If you are using Docker, replace usages of `podman` with `docker` in the commands below.

### Installation

If Deno needs to be installed locally, follow the below instructions.
Otherwise, use the containerized build and run environment.
```shell
curl -fsSL https://deno.land/x/install/install.sh | sh
echo "export DENO_INSTALL=${HOME}/.deno" >> ${HOME}/.bash_profile
echo 'export PATH=$DENO_INSTALL/bin:$PATH' >> ${HOME}/.bash_profile
source ~/.bash_profile
```

### Building

```shell
podman build -t website .
```

### Running

```shell
podman run -it --rm -p 8000:8000 localhost/website
