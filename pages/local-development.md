<img src="/logo.svg" width="128px" height="128px" />

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
```

### Build and Run Locally Without Containers

For developing locally without containers, you can build and run the app using the `deno` CLI:

```shell
deno run -A main.ts 
```

For live-reload functionality during local development:

```shell
deno task start
```

For IntelliJ IDEs using the Deno plugin, the run configuration "Deno Fresh" should already be configured for debugging.
For other IDEs, a task to use either run method above can be created.
