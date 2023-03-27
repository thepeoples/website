# THEPEOPLES.IO

The Peoples' Infrastructure and Services Platform.

## Introduction

This is the official documentation for the platform instance used to host services provided by `thepeoples.io` domain.
Each platform instance is a self-contained collection of highly-available applications and services.
User data stored within each platform instance is protected with privacy-preserving encryption and fine-grained access controls.
Data can be globally replicated across platform instances, giving applications the ability to be globally distributed.

## Logical Architectural Layers

### Infrastructure

The hardware being used to host the platform.
Infrastructure can be hosted anywhere that is accessible to the desired user base.

An "infrastructure instance" represents one Kubernetes cluster meeting the **Minimum Infrastructure Instance Requirements**.

### Platform

The software consuming the infrastructure in order to provide end-users with desired services.

A "platform instance" is a collection of one or more infrastructure instances that the platform manages to provide high-availability and data privacy.
An example of a platform instance would be `thepeoples.io`.

## Core Principals

* Data privacy is just as important as the free flow of information provided by the Internet
* Security is a design consideration from the start but should not overly disrupt the user experience
* Build for high-availability and horizontal scalability, even if the infrastructure instance contains only a single host 
* Privacy-ensuring (i.e. client-side) data encryption and residency options should come standard
* Decentralize the web and allow users to take control of a valuable asset: their data
* Allow connections between platform instances without an authoritative third-party
* Families and communities should be able to self-host the same platform that powers `thepeoples.io` instance
* Connect communities together while maintaining encryption, privacy, and ownership of managed data
* Users of various experience levels should find the experience fairly intuitive
* Component implementations should be small, modular, and pluggable where practical

### Bottom Line

Be self-sovereign with your data that **you** own, whether hosting it yourself or using a third party host.
This project hopes to decentralize web services through federation of distributed instances of the current reference architecture called:
**The Peoples' Infrastructure and Services Platform**

## Status

### 🚧 Under Construction: Phase 1

The implementation of Phase 1 is nearly complete!

#### Phase 1 - Infrastructure

Design, build, and document the standard feature set that the platform requires from infrastructure instances.

Standard features of the infrastructure:

* Container orchestration
* Secrets management
* Ingress traffic routing
* Automated management of TLS certificates
* High-availability of workloads

**NOTE**: The work on the end-user experience via APIs and UIs will start after completion of Phase 2.
This means features like data backup/restore, encryption, retention, etc will be handled at the platform layer.

#### Phase 2 - Platform Foundation

The foundation of the platform that will serve end users and protect their data.
These are the low-level services required to build applications and services on the platform.

Focus on the basics of building a persistent storage layer with client-side encryption as a standard feature.
This phase should also consider the future multi-region use-cases.
Initially, persistent storage will remain limited to KV-like (NoSQL) databases for all platform services.

* `storage-s3-api`: Low-level S3 storage abstraction API to enforce data privacy using client-side encryption
* `storage-kv-api`: KV storage API built on `storage-s3-api`, with indexing and querying capabilities

##### Persistent Storage API Design Goals

* Vendor-agnostic, easy to globally replicate object storage
* Must support at least one open storage API commonly available from third-party providers
* Storage backends must encrypt user data before it leaves the logical platform boundary
    * Remove as much trust as possible from infrastructure instances
        * Assume all `PersistentVolumes` are vulnerable to data leakage
    * Remove as much trust as possible from third-party storage providers
        * Always use client-side encryption
        * Never delegate the crucial task of encrypting data to an outside service

Traditional SQL databases, while excellent RDBMS systems, are too difficult to configure properly (if not impossible) at this time, based on current core principals and design goals.
Potential open source solutions currently worth exploring:

* [TiDB](https://github.com/pingcap/tidb)
    * [TiDB for PostgreSQL](https://github.com/DigitalChinaOpenSource/TiDB-for-PostgreSQL)

#### Phase 3 - Platform API Experience

With the persistent storage problem solved, work can begin on the end-user experience.
This means actually building and exposing APIs that will provide value to end users whether directly, or through usage of the web UI.
The development of the web UI will begin once API designs are finalized.

#### Phase 4 - Platform UI Experience

With stable APIs to work with, the web-based user interface can be built:

* Seamless, unified, and user-friendly web UI
    * Custom interface using Deno + Fresh?
* OIDC-compatible authentication provider using `storage-kv-api` for backend storage
    * Example reference products: Keycloak

Combined with the previous phase, this phase will provide the framework for applications to build on top of the platform to provide end users with desired services.
The platform becomes stable for building applications and services on near the end of phase 4.
Phase 5 is where end-user value-add velocity begins to ramp up.

#### Phase 5 - Applications

The ultimate goal is to stabilize the code base and the management of the platform before building the end user applications.
This is a list of potential services that could be made available via applications with enough desire from end users:

* Static websites
* Video streaming cache and viewing
    * Example reference products: FreeTube, Invidious
* Federated, real-time, secure communications between users and services
    * Example reference products: Matrix, Signal
* DNS server for allowing low-level web content filtering
    * Example reference products: AdGuard, PiHole, PowerDNS
* Allow users to securely share documents, files, and photos across their devices
    * Example reference products: next/ownCloud, WebDAV
* Collaborative markup document editing
    * Example reference products: EtherPad
* Collaborative spreadsheet editing
    * Example reference products: ReactGrid, HyperFormula
* IoT and user physical environment automation
    * Example reference products: HomeAssistant
* Identity and data federation across platform instances to allow for decentralization
    * No known reference products
* Multi-region infrastructure instances for a platform
    * Example reference products: KubeEdge, Open Cluster Management
* Global, geographic load balancing of Internet traffic to platform
    * No known reference products

With the correct infrastructure, and foundational services provided by the platform, there is unlimited potential for additional applications and features that can be added in the future.

#### Phase 6 - Application Developer Experience

Development of the platform and its applications largely depends on external service providers.
This phase will focus on reducing the third party risk associated with platform sustainability:

* Source code repositories
    * Example reference products: GitHub, GitLab, Gitea
* Container image registries
    * Example reference products: DockerHub, Quay.io

## Infrastructure Instance Requirements

* Working Kubernetes v1.24+ cluster with `cluster-admin` access
* Availability of `Service` type `LoadBalancer`
    * This is included with most public-cloud Kubernetes offerings
    * For on-premise, bare-metal, VMs, etc:
        * MetalLB or alternative

### Session

* Install `kubectl` (i.e. kubernetes-client package), and `helm`
* Start terminal session in this project directory
* Ensure `kubectl` is logged into the desired cluster

## Installation

These instructions assume a new Kubernetes cluster with no other workloads other than those mentioned in the Requirements section.

### Ingress Controller

Any compliant Kubernetes Ingress Controller implementation can be used, but we will default to Traefik for now:

```shell
# Install traefik-ingress controller
kubectl create ns traefik-ingress
helm repo add traefik https://traefik.github.io/charts
helm repo update

# This command can be run multiple times
helm upgrade \
  --install \
  --namespace=traefik-ingress \
  --set 'ports.websecure.tls.enabled=true' \
  --set 'providers.kubernetesIngress.publishedService.enabled=true' \
  traefik traefik/traefik
```

#### Manual Configuration

Determine the externally reachable IP address, and create the DNS wildcard record to route all undefined subdomains to the Ingress Controller for processing:

* Get the `EXTERNAL-IP` from the created service:
    * `kubectl -n traefik-ingress get svc/traefik`
    * Create a wildcard `*` DNS record for the desired domain with the given external IP address

### Certificate Manager

LetsEncrypt is used by default for signing TLS certificates with a well-known and trusted certificate authority.
However, cert-manager has support for using other certificate authorities, if desired.

```shell
# Install cert-manager with LetsEncrypt ClusterIssuer
kubectl create -f resources/cert-manager-install.yaml
kubectl create -f resources/cert-manager-install-clusterissuer.yaml
```

### Identity and Access Management

```shell
# Install keycloak  
kubectl apply -f resources/keycloak-install.yaml
kubectl apply -f resources/keycloak-install-ingress.yaml
```

### Secrets Management

```shell
kubectl create ns vault
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install \
  --namespace=vault \
  --set "server.ha.enabled=true" \
  --set "server.ha.raft.enabled=true" \
  vault hashicorp/vault
```

* NOTE: unlike previous Helm installations, this install command can only be used once
    * To uninstall the Helm chart (required before running `helm install` again):
        * `helm uninstall vault hashicorp/vault --namespace=vault`

#### Manual Configuration

#### One-Time
Vault needs to be initialized only once per installation:

```shell
kubectl -n vault exec vault-0 -- vault operator init \
  -key-shares=3 \
  -key-threshold=2 \
  -format=json > vault-init.json
```

* NOTE: the local `vault-init.yaml` file that gets created is a secret that needs to be safely guarded
* WARNING: the security of data being stored and/or processed by this Kubernetes cluster relies on this secret being properly secured
* General guidance for handling of secrets
    * Secrets should be persisted in encrypted storage with limited digital and physical access
    * Use an auditable, encrypted, limited access, central repository for persistent storage of secrets
        * Any secrets used to access the central repository should be treated with the same security as any other secret
    * Never transmit any portion of a secret in plain text
        * Even when TLS is being used for encryption-in-transit, the secret should remain encrypted-at-rest
    * Never keep a persistent, unencrypted copy of the secret
        * This includes scripts and local workstations
        * Do not write it down, take a picture of it, or otherwise make a physical copy
        * Ensure there are no logs, shell history, keyloggers, etc of secrets/credentials
    * Never use any portion of a secret in source code, instead:
        * Configure scripts and other apps to use a dynamic secrets engine with tightly-scoped, short-lived access tokens
        * Kubernetes has a `CronJob` resource for scripts that need secrets to run within the platform
        * Use a secure CI/CD process to inject short-lived credentials at job run time

The Vault containers need to be unsealed using one or more of the keys listed in `unseal_keys_b64`, inside `vault-init.json` at startup.
See the **Container Restarts** section below for the commands to unseal `vault-0` only.

With the primary Vault container unsealed, join the Vault containers to the raft cluster:

```shell
kubectl -n vault exec -it vault-1 -- vault operator raft join http://vault-active.vault.svc.cluster.local:8200
kubectl -n vault exec -it vault-2 -- vault operator raft join http://vault-active.vault.svc.cluster.local:8200
```

Now, continue with the steps in **Container Restarts** to unseal `vault-1` and `vault-2`.

#### Container Restarts

Vault containers never store the unseal keys, if one is restarted it will need to be unsealed.
Obtain a temporarily unencrypted copy of an unseal key and set it as the value for the `VAULT_UNSEAL_KEY` environment variable:

```shell
kubectl -n vault exec vault-0 -- vault operator unseal $VAULT_UNSEAL_KEY
kubectl -n vault exec vault-1 -- vault operator unseal $VAULT_UNSEAL_KEY
kubectl -n vault exec vault-2 -- vault operator unseal $VAULT_UNSEAL_KEY
```

The output of this command will report the status of the Vault node and cluster.

* NOTE: depending on the value used for `-key-threshold` during initialization, this command may need to be repeated with additional unseal keys

**TODO**: CI/CronJob?

### Vault Configuration Operator

This allows for declarative management of Vault configuration via the Kubernetes API.

```shell
# Install vault-config-operator
kubectl create ns vault-config-operator
helm repo add vault-config-operator https://redhat-cop.github.io/vault-config-operator
helm repo update

# This command can be run multiple times
helm upgrade \
  --install \
  --namespace=vault-config-operator \
  vault-config-operator vault-config-operator/vault-config-operator
```
## TODO

* Failed Helm install: `no matches for kind "ServiceMonitor" in version "monitoring.coreos.com/v1"`

### Operator Lifecycle Manager / OperatorHub (optional)

```shell
# In case it's needed, install OLM, then go to https://operatorhub.io
curl -sL https://github.com/operator-framework/operator-lifecycle-manager/releases/download/v0.24.0/install.sh | bash -s v0.24.0
```

## Troubleshooting

### DNS

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
kubectl exec -it dnsutils -- nslookup kubernetes.default
```
```